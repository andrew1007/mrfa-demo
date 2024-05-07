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

Let's take a look at a sample state tree that is normalized

```typescript
export const normalizedState = {
  docs: {
    1: {
      title: "Performant React",
      id: 1,
      updatedAt: 1668117919710, // 11-10-2022
    },
    2: {
      title: "React Presentation",
      id: 2,
      updatedAt: 1636582015583, // 11-10-2021
    },
  },
  docIds: [1, 2],
  app: {
    mounting: false,
  },
};
```

Let's say a component needs an array of titles. We can memoize this operation by having the resolver functions "target" the relevant nodes: `docs` and `docIds`

```typescript
// resolvers
const getDocs = (state) => state.docs;
const getDocIds = (state) => state.docIds;

// pure selector
const getDocTitles = createSelector([getDocs, docIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});

// selector hook
const useGetDocTitles = useSelector(getDocTitles);
```

Now, this selector hook will only recompute (and thus trigger a rerender) when `docs` and/or `docIds` updates.

## Resolvers are Selectors

One of the incredible powers of the selector model is that computed selectors can be used as resolver functions. Selectors are infinitely composable and can be reused with virtually no performance penalties (because they are memoized).

```typescript
const capitalize = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`;
const getParsedTitles = createSelector([getDocTitles], (titles) =>
  capitalize(titles)
);

const useGetParsedTitles = useSelector(getParsedTitles);
```

## Factory Selectors for Multi-cache situations

`createSelector` has a cache size of one. This meets most use cases, but some situations may require a larger cache. For example, when an algorithm needs to operate on something by id. This situation is common when many instances of a component are rendered, such as a table.

A selector like this will miss its cache because `id` is constantly changing. In this situation, a factory is required.

```tsx
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => {
    return {
      ...doc,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });

const useGetParsedDocById = (id) => {
  const getParsedDocById = useMemo(() => makeGetParsedDocById(id), [id]);
  return useSelector(getParsedDocById);
};

const DocEntry = (props) => {
  const parsedDoc = useGetParsedDocById(props.id);

  return <>{JSON.stringify(parsedDoc)}</>;
};
```

Now, each instance of `useGetDocById` has its own selector instance, which allows maximal strict equality matching.

## Optimizing State Tree Mutations

Algorithms are rerenders are now contingent on the effectiveness of a system's memoization implementation. Naturally, the fewer changes in nodes, the better the system performs. Minimizing node updates during state transformations is an art that becomes manageable with an intuitive understanding of how state changes. Useless node updates are a fatal performance mistake. Copying unchanged nodes is a common issue.

```typescript
const updateDate = (newDate, currId) => {
  dispatch((state) => {
    return {
      docs: Object.fromEntries(
        Object.entries(state.docs).map(([id, doc]) => ({
          ...doc,
          date: currId === id ? newDate : doc.date,
        }))
      ),
    };
  });
};
```

Here, every data record node has changed. If the table has 100 rows, then 100 components will fail strict equality and uselessly trigger DOM node reconciliation checks. Instead of modifying every node, via spread operator, transforming the single node of interest is ideal.

```typescript
const updateDate = (newDate, currId) => {
  dispatch((state) => {
    const nextDocs = { ...docs };

    nextDocs[currId] = {
      ...nextDocs[currId],
      date: newDate,
    };

    return {
      docs: nextDocs,
    };
  });
};
```
