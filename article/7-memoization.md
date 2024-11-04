# Memoization

## Introduction

Brittle, inflexible, and unstandardized memoization approaches are rife with hazards and weaknesses.

1. Some algorithms may seem "too complex" to memoize
2. Stale caches are a common source of silent errors
3. Everyone memoization challenge becomes a unique "case study" to solve

A memoization framework, that leverages selector functions, fixes all of these.

1. Every global state algorithm can be memoized.
2. It has inherent safeguards against stale caches.
3. The memoization strategy is identical, regardless of size or complexity.

## `useSelector`
The higher order component, via `applyState` approach was taken for learning purposes. It is the more "formal" way, because data management stays within React's data flow paradigm. A hook, `useSelector` is more practical to use in React apps. It has the same rerender suppression capabilities as `applyState`. A custom `useSelector` is integrated into `makeProvider`, which is functionally equivalent to redux's [`useSelector`](https://react-redux.js.org/api/hooks#useselector) The implementation details of the custom implementation are detailed in appendix 1.

## `createSelector`

Selector-based memoization uses a powerful methodology, in the form of `createSelector`, from the npm package [`reselect`](https://www.npmjs.com/package/reselect). While simple to write, `reselect` is more robust. A deconstruction and explanation of `createSelector` is in appendix 2.

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

`createSelector`'s uses selector functions to make data available in a pure way. When a `createSelector` function is invoked, the array of selectors are evaluated and their return values become arguments in the computation callback. 

```typescript
const getDocs = (state) => state.docs;

const getDocDates = createSelector([getDocs], (docs) => {
  return Object.values(docs).map(({ updatedAt }) => updatedAt);
});
```

`createSelector` is designed to be transparently integrated into applications that rely on the selector model for algorithms. When invoking a `createSelector` function, the argument is still the same: the `state` tree.

## `createSelector` memoization, via Tree Traversal

The memoization strategy of `createSelector` is directly integrated with its data access mechanism. The cache is returned if strict equality is met for all evaluated selectors. This cache verifications system is an incredible strength. It is virtually impossible to return stale values, because data access and cache verification are the same operation.

For tree-traversal selectors, traversing down to an unchanged node meets the strict equality requirement.

## Resolver Design

`createSelector` standardizes cache verification. This contrasts most memoization methodologies, like `useMemo`, where it is the developer's duty to write their own verification conditions.

But this standardization is a double-edged sword, because it is easy to write ineffective selectors. Selector design is integral to the success of `createSelector`. Traversing down to precise nodes for computation maximizes the effectiveness of this caching strategy.

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

Just like with normal selectors, `createSelector` allows infinite reusability. A `createSelector` function can be used in the resolver array, regardless of their return value.

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

With `useMemo`, the factory selector `makeGetParsedDocById` retains its instance between render cycles through memoization.

```tsx
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => ({
    ...doc,
    date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
  }));

const useGetParsedDocById = (id) => {
  const getParsedDocById = useMemo(() => makeGetParsedDocById(id), [id]);
  return useSelector(getParsedDocById);
};
```
