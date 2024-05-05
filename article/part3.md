# Make React Fast Again Part 3: State tree mutations and algorithm memoization

## Introduction

In part 2, it may have seemed strange that selector functions, regardless of complexity, were decoupled from `useSelector`. This is for two reasons:

1. Pure functions are dead-easy to test
2. Memoization is easier to implement

Memoizing operations in data structures is the last piece of the puzzle for highly optimized applications that are fast and maintainable. But memoizing operations that are derived from (essentially) a mini database is difficult. It requires an intuitive understanding of how the state tree changes as data is mutated, added, and removed from it.

## Seeing State Tree as Nodes

Mutations are easiest to understand when `state` is treated like nodes in a tree data structure. Moving forward, a colored node will denote a node that will fail strict equality; either a change in value, reference, or both.

A new state tree is required when updating state. But the word "new" isn't a granular descriptor. Only the root node needs to be replaced in order for it to be defined as a "new tree". Subtree nodes don't have to change; neither reference nor value. The existing nodes just need to be connected to a new root node. Revisit the reducer function in `makeProvider`.

```typescript
const reducer = (state, action) => ({
  ...state,
  ...action(state),
});
```

The spread operator performs a shallow merge. Think of this operation as the creation of a new root node for the state tree.

## Optimizing State Tree Mutations

Fast systems minimize node updates. Useless node updates are a fatal performance mistake. Copying unchanged nodes is a common issue.

```typescript
// BAD DISPATCH ALGORITHM UPDATE HERE
```

Here, every data record node has changed. If the table has 100 rows, then 100 components will fail strict equality and uselessly trigger DOM node reconciliation checks.

Instead of modifying every node, via spread operator, transforming the single node of interest is ideal. The algorithm has a negligible performance difference, but the important part is modifying as few nodes as possible. This has massive implications for memoization.

## Custom `createSelector`

Under normal circumstances, reinventing the wheel is bad. But for learning purposes, here is a custom implementation of a powerful memoization function. It is functionally equivalent to `createSelector`, from the package `reselect`.

```typescript
function createSelector(selectors, computingFn) {
  const empty = Symbol("emptyCache");
  let computedCache = [];
  let cache = empty;

  return (state) => {
    const extracted = selectors.map((fn) => fn(state));
    const hasChanges = extracted.some(
      (computed, idx) => computedCache[idx] !== computed
    );
    if (cache === empty || hasChanges) {
      cache = computingFn(...extracted);
      computedCache = extracted;
    }

    return cache;
  };
}
```

`createSelector` accepts an array of resolver functions. The purpose of these resolver functions are twofold:

1. The computed value of the function is available as an argument in `computingFn`.
2. The computed value is checked for strict equality, to determine if it needs to be recomputed.

If all resolvers computed to a value that meets strict equality, the cached value is returned. This saves computation time. But more importantly, a cached value is equal by reference. This suppresses useless rerenders. This has an immense implication: A normalized state tree rarely has data structures that a component requires. But now that doesn't matter, because computed values will maximally meet strict equality, when memoized.

## Visualizing Resolver Functions

The hardest part about effective memoization is writing the correct resolver functions. It's helpful to think of a resolver as a function that "crawls" down a state tree to target required nodes. The nodes that are targeted should be the exact nodes that are required to compute the data.

## Resolvers are Selectors

One of the incredible powers of the selector model is that computed selectors can be used as resolver functions. Selectors are infinitely composable and can be reused with virtually no performance penalties (because they are memoized).

## Factory Selectors for Multi-cache situations

`createSelector` has a cache size of one. This meets most use cases, but some situations may require a larger cache. For example, when an algorithm needs to operate on something by id.

A selector like this will miss its cache because `id` is constantly changing. In this situation, a factory is required.

```typescript
const makeGetDocById = (id) => createSelector((state) => state.docs[id]);

const useGetDocById = (id) => {
  const getDocById = useMemo(() => makeGetDocById(id), [id]);
  return useSelector(getDocById);
};
```

Now, each instance of `useGetDocById` has its own selector instance, which allows maximal strict equality matching.
