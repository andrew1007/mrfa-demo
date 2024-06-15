# Make React Fast Again Part 3: State tree mutations and algorithm memoization

## Introduction

Part 3 is about the concept

Understanding state tree transformations is so undervalued that the average developer doesn't think about (or even understand) it when designing an application. A mastery of this is a hidden superpower when working global state management systems.

It is the last piece of the puzzle to creating fast enterprise software using React. It scales infinitely. There's is no such thing as an application that is too large or complex. In fact, the true power of this design paradigm reveals itself in those situations.

###

Brittle, inflexible, and unstandardized memoization approaches are rife with hazards and weaknesses.

1. Some algorithms may seem "too complex" to memoize
2. Fear of silently returning stale values
3. Fear of silently missing the cache every time

Creating a structured and functionally pure framework for memoization fixes all of these things.

1. Every global state algorithm, regardless of size or complexity, can be memoized.
2. It is magnitudes harder to return stale values.
3. Cache hits are maximized in a deterministic and easy-to-reason way.

Frameworks have rules (good rules though). And it requires an understanding of state tree transformations.

## idk lol

In part 2, it may have seemed strange that selector functions, regardless of complexity, were decoupled from `useSelector`. This is for two reasons:

1. Pure functions are dead-easy to test
2. Memoization is easier to implement

Memoizing operations in data structures is the last piece of the puzzle for highly optimized applications that are fast and maintainable. But memoizing operations that are derived from (essentially) a mini database is difficult. It requires an intuitive understanding of how the state tree changes as data is mutated, added, and removed from it.

## Seeing State Tree as Nodes

Mutations are easiest to understand when `state` is treated like nodes in a tree data structure. Moving forward, a colored node will denote a node that will fail strict equality; either a change in value, reference, or both.

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

The following sequence of operations occurs for effective memoization.

1. Prepare two caches: Resolver values and return value

```typescript
function createSelector(selectors, computingFn) {
  let computedSelectorCache = [];
  let cache;

  /// ...
}
```

Two caches are required: 1. For the algorithm's return value and 2. The return values of the selectors.

2. Compare selector return values from previous arguments to current arguments

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

Selectors are pure functions. So if all selectors are computed and the resolved values are the same compared to the previous state, then the cached value can be safely returned.

This does a "pre-verification" of a datum's equality before it is available to the algorithm. Combined with functional purity, stale caches are virtually impossible.

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

## Visualizing Resolver Functions

The hardest part about effective memoization is writing the correct resolver functions. It's helpful to think of a resolver as a function that traverses the tree to find nodes. The targeted nodes should be the exact ones required for computation.

The following is a small, normalized, state tree.

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

A tree representation would look like this

![localImage](./resources/pt2-fig-2.png)

## Traversing the State Tree with Selectors

A selector function's argument is the `state` tree and the return value is a node. To return the `docs` node, the selector would be:

```typescript
const getDocs = (state) => state.docs;
```

`getDocs` traverses the tree to select `docs`.

![localImage](./resources/pt2-fig-3.png)

## Factory Selectors

A selector is any function where the only argument is `state`. To account for other parameters, currying is required. For example, if a key is specified by runtime (such as an `id`), it must be curried. Here is an example that targets a child node in `docs`.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id];

const getDoc = makeGetDocById(1);
```

![localImage](./resources/pt2-fig-4.png)

## Composing Selectors

The first argument of `createSelector` accepts an array of selectors. This is how multiple nodes can be used in a computation. `getDocs` and `getDocIds` are used together to compute the necessary data. This memoized selector will only recompute when either node (`docs` and `docIds`) changes value.

```typescript
// resolvers
const getDocs = (state) => state.docs;
const getDocIds = (state) => state.docIds;

// pure selector
const getDocTitles = createSelector([getDocs, docIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});
```

![localImage](./resources/pt2-fig-5.png)

Now, this selector hook will only recompute (and thus trigger a rerender) when `docs` and/or `docIds` updates.

// selector hook
const useGetDocTitles = useSelector(getDocTitles);

## Resolvers are Selectors

One of the incredible powers of the selector model is that computed selectors can be used as resolver functions. Selectors are infinitely composable and can be reused with virtually no performance penalties (because they are memoized).

```typescript
const getDocTitles = createSelector([getDocs, docIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;
const getCapitalizedTitles = createSelector([getDocTitles], (titles) =>
  titles.map(capitalize)
);

const useGetCapitalizedTitles = useSelector(getCapitalizedTitles);
```

## `createSelector` Resolver Design

The hardest part about effective memoization is writing optimal resolver functions. They can be the difference between an app that slows to a crawl and another that is lightning fast. Remember that most of the performance savings when memoizing are from rerender suppression. Algorithms are usually a non-issue.

We can start by talking about a useless selector. One that targets the root node of the state tree, `getState`. The root node is guaranteed to be a new node during any state update. This selector will always miss its cache and recompute.

```typescript
const getState = (state) => state;

const makeGetParsedDocById = (id) =>
  createSelector([getState], (state) => {
    const { updatedAt, ...rest } = state.docs[id];
    return {
      ...rest,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

Targeting the `docs` node is much better, because state updates that don't modify `docs` won't affect the caching strategy.

```typescript
const getDocs = (state) => state.docs;

const makeGetParsedDocById = (id) =>
  createSelector([getDocs], (docs) => {
    const doc = docs[id];

    return {
      ...doc,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

But best of all, the resolver function can traverse deeper into the state tree and target the exact node of interest. Granular resolvers are almost always better. Accessing the exact nodes that are required for computation maximizes the effectiveness of this caching strategy.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => {
    return {
      ...doc,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

## Factory Selectors for Multi-cache situations

`createSelector` has a cache size of one. This meets most use cases. But some situations may require a larger cache. For example, when an algorithm needs to operate on something by id. This situation is common when many instances of a component are rendered, such as a table or list of UI elements.

The factory selector above, `makeGetParsedDocById`, will miss constantly miss its cache because `id` changes. The factory selector needs its own copy of the selector in every hook, which can be accomplished with `useMemo`.

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
```

Now, each `useGetDocById` has its own cache, allowing maximal strict equality matching.

## Optimizing State Tree Mutations

Rerenders from algorithms are now contingent on memoization effectiveness and are based on the following:

1. The granularity/mindfulness of what nodes to target in `createSelector`.
2. Minimizing the number of nodes that change when updating state.

Effectively targeting nodes for memoization is meaningless if those nodes are uselessly changing. Minimizing node updates during state transformations is an art that becomes manageable with an intuitive understanding of how state changes.

### An Unoptimized Transformation Approach

Copying unchanged nodes is a common issue. In the following code snippet, the state transformation algorithm creates a new node for every object in `docs`. A rerender is triggered in every instance of `useGetDocById`. It is irrespective of the nodes that have changed in value. The react dev tools performance profile confirms this.

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

![localImage](./resources/pt2-fig-6.png)

### An Optimal Transformation Approach

Transforming the single node is optimal. This transformation strategy targets the single node that requires an update.

```typescript
const updateDate = (newDate, currId) => {
  dispatch(({ docs }) => {
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

![localImage](./resources/pt2-fig-7.png)

## Conclusion

The foundation is laid out. The only thing left is to practice until this is all second-nature.

It may be readily apparent that this scales to applications of any size... or maybe it doesn't seem apparent. To drive the point home, part 4 will drive the point home with an analyses and benchmarks of a fully functional React application: A music player.
