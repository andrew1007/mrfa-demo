
# `createSelector`

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
