
## Introduction

Part 3 is about the concept

Understanding state tree transformations is so undervalued that the average developer doesn't think about (or even understand) it when designing an application. A mastery of this is a hidden superpower when working global state management systems.

It is the last piece of the puzzle to creating fast enterprise software using React. It scales infinitely. There's is no such thing as an application that is too large or complex. In fact, the true power of this design paradigm reveals itself in those situations.

###

Brittle, inflexible, and unstandardized memoization approaches are rife with hazards and weaknesses.

1. Some algorithms may seem "too complex" to memoize
2. Stale caches are a common source of silent errors

A structured framework for memoization fixes all of these.

1. Every global state algorithm, regardless of size or complexity, can be memoized.
2. It has inherent safeguards against stale caches. It is magnitudes harder to return them.
3. Cache hits are maximized in a deterministic and easy-to-reason way.
4. They are inherently pure functions.

## idk lol

In part 2, it may have seemed strange that selector functions, regardless of complexity, were decoupled from `useSelector`. This is for two reasons:

1. Pure functions are dead-easy to test
2. Memoization is easier to implement

Memoizing operations in data structures is the last piece of the puzzle for applications that are optimized and maintainable. But memoizing operations that are derived from (essentially) a mini database is difficult. It requires an intuitive understanding of how the state tree changes as data is mutated, added, and removed from it.

## Custom `createSelector`

For learning purposes, here is a custom implementation of a powerful memoization function. It has the core features of `createSelector`, from the package [`reselect`](https://www.npmjs.com/package/reselect).

```typescript
function createSelector(selectors, computingFn) {
  let computedSelectorCache = [];
  let cache;

  return (state) => {
    const computedSelectors = selectors.map((fn) => fn(state));
    const hasChanges = computedSelectors.some(
      (computed, idx) => computedSelectorCache[idx] !== computed
    );
    if (hasChanges) {
      cache = computingFn(...computedSelectors);
      computedSelectorCache = computedSelectors;
    }

    return cache;
  };
}
```

## `createSelector` Deconstructed

The following logic maximizes memoization effectiveness.

1. Prepare two caches: For computed resolver values and the function's return value

```typescript
function createSelector(selectors, computingFn) {
  let computedSelectorCache = [];
  let cache;

  /// ...
}
```

2. Compute the selectors, and compare the selector values from the previous invocation.

```typescript
function createSelector(selectors, computingFn) {
  let computedSelectorCache = [];
  let cache;

  return (state) => {
    const computedSelectors = selectors.map((fn) => fn(state));
    const hasChanges = computedSelectors.some(
      (computed, idx) => computedSelectorCache[idx] !== computed
    );
    // ...
  };
}
```

Selectors are pure functions. So if all selectors are computed and the resolved values are the same compared to the previous state, then the cached value can be safely returned. This is essentially a "pre-verification" of a datum's equality before it is available to the algorithm.

3. If there are changes, update the cache and return the new value

```typescript
function createSelector(selectors, computingFn) {
  // ...

  return (state) => {
    const computedSelectors = // ...
    const hasChanges = // ....
    if (hasChanges) {
      cache = computingFn(...computedSelectors);
      computedSelectorCache = computedSelectors;
    }

    return cache;
  };
}
```

If the selectors resolve to different arguments, then the `cache` recomputes.


## Seeing State as a Tree

Mutations are easiest to understand when `state` is conceptualized as a tree data structure. Moving forward, a colored node will denote a node that will fail strict equality; either a change in value, reference, or both.

A new state tree is required when updating state. But the word "new" isn't a granular descriptor. Only the root node needs to be replaced in order for it to be defined as a "new tree". Subtree nodes don't have to change reference nor value. The existing nodes just need to be connected to a new root node. Revisit the reducer function in `makeProvider`.

```typescript
const reducer = (state, action) => ({
  ...state,
  ...action(state),
});
```

The spread operator performs a shallow merge. Think of this operation as the creation of a new root node for the state tree.

![localImage](./resources/pt2-fig-1.png)

[fig 1] The root node of the state tree being mutated after `reducer` computation

## Visualizing Resolver Functions

The hardest part about effective selectors is writing optimal resolver functions. It's helpful to think of a resolver function as an entity that "traverses" the state tree to access necessary nodes.

The following is a small, normalized, state tree.

```typescript
export const normalizedState = {
  docs: {
    1: {
      title: "Performant React",
      id: 1,
      updatedAt: 1668117919710,
    },
    2: {
      title: "React Presentation",
      id: 2,
      updatedAt: 1636582015583,
    },
  },
  docIds: [1, 2],
  app: {
    mounting: false,
  },
};
```

A tree representation would look like this

![localImage](./resources/pt2-fig-2.png)
