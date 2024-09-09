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

The memoization strategy of `createSelector` is directly integrated with its data access mechanism. If all selectors traverse to unchanged nodes, then the cached value is returned. This cache verifications system is an incredible strength. It is virtually impossible to return stale values, because data access and cache verification are in the same operation.

## Resolver Design

`createSelector` standardizes cache verification. This contrasts most memoization methodologies, where it is the developer's duty to write their own verification conditions. Most notably, with `useMemo` and its dependency array.

This standardization is a double-edged sword, because it is easy to write ineffective selectors. Selector design is integral to the success of `createSelector`. The best selectors optimally navigate the `state` tree to target the exact node(s) of interest. Accessing the exact nodes that are required for computation maximizes the effectiveness of this caching strategy.

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

## Resolvers are Selectors

Earlier, selectors were referred to as functions that traverse the `state` tree. But the other layer to `createSelector` is that selectors, regardless of their return value, are also valid resolver functions.

```typescript
const getDocs = (state) => state.docs;
const getDocIds = (state) => state.docIds;

const getDocTitles = createSelector([getDocs, getDocIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});

// use computed selector in resolvers array
const getCapitalizedTitles = createSelector([getDocTitles], (titles) => {
  const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

  return titles.map(capitalize);
});

const useGetCapitalizedTitles = () => useSelector(getCapitalizedTitles);
```

## Factory Selectors for Multi-cache situations

The same instance of a factory selector is required for the lifespan of the component. A new instance means a new cache, which guarantees cache misses. This is solved using `useMemo`.

The factory selector `makeGetParsedDocById` retains its instance between render cycles through memoization.

```tsx
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => ({
    ...doc,
    date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
  }));

const useGetParsedDocById = id => {
  return useMemo(() => makeGetParsedDocById(id), [id])
}

const useGetParsedDocById = (id) => {
  const getParsedDocById = useMemo(() => makeGetParsedDocById(id), [id]);
  return useSelector(getParsedDocById);
};
```
