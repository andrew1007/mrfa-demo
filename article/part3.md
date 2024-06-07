# Make React Fast Again Part 3: State tree mutations and algorithm memoization

## Introduction

In part 2, it may have seemed strange that selector functions, regardless of complexity, were decoupled from `useSelector`. This is for two reasons:

1. Pure functions are dead-easy to test
2. Memoization is easier to implement

Memoizing operations in data structures is the last piece of the puzzle for highly optimized applications that are fast and maintainable. But memoizing operations that are derived from (essentially) a mini database is difficult. It requires an intuitive understanding of how the state tree changes as data is mutated, added, and removed from it.

## Commenting on the React Compiler
There is plenty of talk about a new feature: The [React Compiler](https://react.dev/learn/react-compiler). It markets itself as the answer to suppressing useless rerenders "for free". But in reality, a technology like this is not a free pass to be undisciplined. Poorly-designed apps have useless rerenders embedded within their DNA. No novel technology (short of AI code refactoring) will ever fix foundational performance issues. That being said, learning effective memoization and designing normalized state trees are still a worthy endeavor, because of the following:

- It is platform-agnostic. Any technology, library, or framework will benefit from this knowledge.
- The performance gains in React are massive, which will be thoroughly proven in part 4.

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

![localImage](./resources/pt2-fig-1.png)

[fig 1] The root node of the state tree being mutated after `reducer` computation

## Custom `createSelector`

For learning purposes, here is a custom implementation of a memoization function that is powerful, robust, and pure. It is functionally equivalent to `createSelector`, from the package [`reselect`](https://www.npmjs.com/package/reselect).

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

Take a look at a sample state tree that is normalized

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

If an array of titles is needed, the resolver functions should individually "target" the relevant nodes: `docs` and `docIds`.

## "Crawling" the State Tree with Selectors

A selector function's argument is the `state` tree and the return value is a node in it. For example, to return the `docs` node, the selector would be as follows.

```typescript
const getDocs = (state) => state.docs;
```

`getDocs` crawls down the state tree to select the `docs` node

![localImage](./resources/pt2-fig-3.png)

A selector is any function where the only argument is `state`. Here is an example that targets a child node in `docs`. There can be many childen, so `id` needs to be accounted for. This requires currying.

```typescript
const makeGetDocById = (id) => state => state.docs[id]

const getDoc = makeGetDocById(1)
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
const capitalize = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`;
const getParsedTitles = createSelector([getDocTitles], (titles) =>
  capitalize(titles)
);

const useGetParsedTitles = useSelector(getParsedTitles);
```

## Factory Selectors for Multi-cache situations

`createSelector` has a cache size of one. This meets most use cases. But some situations may require a larger cache. For example, when an algorithm needs to operate on something by id. This situation is common when many instances of a component are rendered, such as a table or list of UI elements.

A selector like this will miss its cache because `id` is constantly changing. In this situation, a factory is required.

```tsx
const makeGetDocById = (id) => (state) => state.docs[id];

const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => {
    const { updatedAt, ...rest } = doc;
    return {
      ...rest,
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

Now, each `useGetDocById` has its own cache, via individual instance of `makeGetParsedDocById`. This allows maximal strict equality matching.


## `createSelector` Resolver Design

The hardest part about effective memoization is writing optimal resolver functions. They can be the difference between an app that slows to a crawl and another that is lightning fast. Remember that all of the performance savings when memoizing are from rerender suppression. It has little to do with the computation of the algorithm.

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
    const { updatedAt, ...rest } = docs[id];
    return {
      ...rest,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

But best of all, our resolver function can reach deep into the state tree and target the exact node. This resolver has minimal performance penalties, because key access within an object is an O(1) operation.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id];
const makeGetParsedDocById = (id) =>
  createSelector([makeGetDocById(id)], (doc) => {
    const { updatedAt, ...rest } = doc;
    return {
      ...rest,
      date: dayjs(doc.updatedAt).format("YYYY-MM-DD"),
    };
  });
```

Granular resolvers are almost always better. Accessing the exact nodes that are required for computation maximizes the effectivess of this caching strategy.

## Optimizing State Tree Mutations

Rerenders from algorithms are now contingent on memoization effectiveness and are based on the following:

1. The granularity/mindfulness of what nodes to target in `createSelector`.
2. Minimizing the number of nodes that change when updating state.

Effectively targeting optimal nodes is meaningless if they are constantly changing for useless reasons. Minimizing node updates during state transformations is an art that becomes manageable with an intuitive understanding of how state changes.

Copying unchanged nodes is a common issue. In the following code snippet, the state transformation algorithm creates a new node for every single object in the `docs` key. This triggers a rerender in every single instance of `useGetDocById`, regardless of the number of nodes that have actually changed. The react dev tools performance profile confirms this.

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

Instead of modifying every node, via spread operator, transforming the single node (and its root) of interest is ideal. Here, the dev tools profiler only update necessary components.

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

![localImage](./resources/pt2-fig-7.png)