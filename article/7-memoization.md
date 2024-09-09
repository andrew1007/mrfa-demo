# Memoization

## Introduction

Brittle, inflexible, and unstandardized memoization approaches are rife with hazards and weaknesses.

1. Some algorithms may seem "too complex" to memoize
2. Stale caches are a common source of silent errors
3. Each challenge becomes its own memoization "case study"

A memoization framework, that leverages selector functions, fixes all of these.

1. Every global state algorithm can be memoized.
2. It has inherent safeguards against stale caches.
3. The memoization strategy is identical, regardless of size or complexity.

## `createSelector`

Selector-based memoization uses a powerful methodology, in the form of `createSelector`, from the npm package [`reselect`](https://www.npmjs.com/package/reselect). While simple to write, `reselect` is more robust. A deconstruction and explanation of the magic behind `createSelector` can be found in appendix 2.

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

## `createSelector` data access, via Tree Traversal

Selector functions are `createSelector`'s mechanism to access data. Selector-evaluated data are arguments in the computation callback. `createSelector` is designed to be transparently integrated into applications that rely on the selector model for algorithms.

```typescript
const getDocs = (state) => state.docs;

const getDocDates = createSelector([getDocs], (docs) => {
  return Object.values(docs).map(({ updatedAt }) => updatedAt);
});
```

## `createSelector` memoization, via Tree Traversal

The memoization strategy of `createSelector` is directly integrated with its data access mechanism. This is the incredible strength of this caching system. 

## Traversing the state tree for data

Effective use of `createSelector` requires optimal resolver design. Resolvers are used to traverse the tree to target nodes that hold the data of interest.

## Traversing the State Tree with Selectors

A selector function's argument is the `state` tree and the return value is a node. To return the `docs` node, the selector would be:

```typescript
const getDocs = (state) => state.docs;
```

`getDocs` traverses the tree (down one level) to select the `docs` node.

![localImage](./resources/pt2-fig-3.png)

## Factory Selectors

A selector's single argument is `state`. Currying is required for extra parameters. This is common when a parameter is specified in runtime (such as an `id`). Here is an example that targets a child node in `docs`.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id];

const getDoc = makeGetDocById(1);
```

![localImage](./resources/pt2-fig-4.png)

## Composing Selectors

`createSelector`'s first parameter is an array of selectors, allowing the use of multiple selectors at once. This provides an intuitive way to access multiple state tree nodes.

`getDocs` and `getDocIds` are used together to compute the necessary data. This memoized selector will only recompute when either `docs` and/or `docIds` changes value.

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

## Resolvers are Selectors

Computed selectors can be used as resolver functions. They are infinitely composable, reusable, and incur virtually no performance penalties (because they are memoized).

```typescript
const getDocTitles = createSelector([getDocs, docIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

// use computed selector in resolvers array
const getCapitalizedTitles = createSelector([getDocTitles], (titles) =>
  titles.map(capitalize)
);

const useGetCapitalizedTitles = useSelector(getCapitalizedTitles);
```

## `createSelector` Resolver Design

The hardest part about effective memoization is writing optimal resolver functions. They can make or break apps.

It is easy to accidentally create ineffective selectors. An obvious example would be targeting the root node. The root node is guaranteed to be a new node during any state update. This selector, `getState`, will always miss its cache and recompute.

```typescript
// useless resolver fn
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

Targeting `docs` node is better.

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

`createSelector` has a cache size of one. This meets most use cases. But some situations may require a larger cache. For example, when an algorithm needs to find data by id. This is common when rendering many component instances, such as a table or list of UI elements.

Without any extra techniques, `makeGetParsedDocById` would create a new selector instance (and a new cache) on every render cycle. This guarantees cache misses.

```tsx
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => ({
    ...doc,
    date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
  }));

const useGetParsedDocById = (id) => {
  const getParsedDocById = makeGetParsedDocById(id);
  return useSelector(getParsedDocById);
};
```

A persistent cache can be created using `useMemo`. Using a memoization hook retains an instance of the selector for as long as possible.

```tsx
const useGetParsedDocById = (id) => {
  const getParsedDocById = useMemo(() => makeGetParsedDocById(id), [id]);
  return useSelector(getParsedDocById);
};
```
