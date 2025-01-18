# Memoization

## Introduction

Brittle, inflexible, and unstandardized memoization approaches are rife with hazards and weaknesses.

1. Some algorithms may seem "too complex" to memoize
2. Stale caches are a common source of silent errors
3. Every memoization challenge becomes a unique case study to solve

A memoization framework, that leverages selector functions, fixes all of these.

1. Every global state algorithm can be memoized.
2. It has inherent safeguards against stale caches.
3. The memoization strategy is identical, regardless of size or complexity.

## `useSelector`
The higher order component, via `applyState`, was used for learning purposes. It is the more "formal" way, because data management stays within React's data flow paradigm. But a hooks are more practical to use in React apps. 

A `useSelector` function can be created into `makeProvider`. It fills an identical role with the same rerender suppression capabilities. It is functionally equivalent to redux's [`useSelector`](https://react-redux.js.org/api/hooks#useselector) The implementation details of the custom implementation are detailed in appendix 1.

## `createSelector`

Selector-based memoization is already available with the package [`reselect`](https://www.npmjs.com/package/reselect). Its `createSelector` function is simple, but incredibly effective. The following is a bare-bones implementation of it.

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

A deconstruction and explanation of `createSelector` is in appendix 2.

## `createSelector` data access, via Tree Traversal

`createSelector`'s uses selector functions to make data available in a pure way. When a `createSelector` function is invoked, the array of selectors are evaluated and their return values become arguments in the computation callback. 

```typescript
const getDocs = (state) => state.docs;

const getDocDates = createSelector([getDocs], (docs) => {
  return Object.values(docs).map(({ updatedAt }) => updatedAt);
});
```

`createSelector` seamlessly integrates into selector-based applications. When invoking a `createSelector` function, the argument is still the same: the `state` tree.

```typescript
const useGetDocDates = () => useSelector(state => getDocDates(state))
```

Skipping the anonymous function is perfectly fine too

```typescript
const useGetDocDates = () => useSelector(getDocDates)
```


## Resolver Design

`createSelector`'s memoization check is the same as its data access mechanism. If the selectors are pure, it is virtually impossible to return stale values. Ineffective selectors are a common mistake, making this technique susceptible to cache-misses. Selector design is integral to the success of `createSelector`. Traversing down to precise nodes for computation is imperative.

In the following example, `makeGetParsedDocById`, the tree-traversal selector traverses down to `docs`.

```typescript
// suboptimal
const getDocs = (state) => state.docs;

const makeGetParsedDocById = (id) =>
  createSelector([getDocs], (docs) => {
    const doc = docs[id]
    return {
      ...doc,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

This will hit its cache in many instances. But a better, more granular, selector that can be written. A `makeGetParsedDocById` will traverse down to the exact node of interest.

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

This approach maximizes the cache hits.

## Resolvers are Selectors

Just like with normal selectors, `createSelector` enables infinite reusability. An `createSelector` function can be used in the resolver array.

```typescript
const getDocs = (state) => state.docs;
const getDocIds = (state) => state.docIds;

const getDocTitles = createSelector([getDocs, getDocIds], (docs, docIds) => {
  return docIds.map((id) => docs[id].title);
});

// use computed selector in resolvers array
const getCapitalizedTitles = createSelector([getDocTitles], (titles) => {
  const capitalize = (str) => str ? `${str[0].toUpperCase()}${str.slice(1)}` : '';

  return titles.map(capitalize);
});

const useGetCapitalizedTitles = () => useSelector(getCapitalizedTitles);
```

## Factory Selectors for Multi-cache situations

A factory selector like `makeGetParsedDocById` evaluates to a new selector instance. This means that there will never be a populated cache. The same instance needs to be retained across render cycles. `useMemo` solves this.

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

Another option is to create an abstraction that embeds `useMemo`.

```typescript
const useFactorySelector = (factorySelector) => {
  return (...args) => {
    const selector = useMemo(() => factorySelector(...args), [...args])
    return useSelector(selector)
  }
}

const useGetParsedDocById = useFactorySelector(id => makeGetParsedDocById(id))
```
