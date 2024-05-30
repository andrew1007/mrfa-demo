# Make React Fast Again Part 2: Normalized State Trees, the Selector Model, and `useSelector`

## Introduction

The complexity of modern frontend applications are immense. Design decisions are easier when the application is treated like a server with a thin UI layer on top of it. In a server, data is king and is always treated with respect.

The way data is structured, managed, transformed, and computed will be the central point of interest. The better the data is designed, the simpler it is to maintain and optimize a React app.

## Normalized State Data

Normalization is imperative for a maintainable SSOT (single source of truth) data model. Do not duplicate stored data. It may be helpful to think of a state tree as a server-side database. 

In the same way data (and its normalization) is respected on the backend, similar attitudes should apply to how the frontend manages data.

Duplication becomes less alluring when data is easily accessible. This is commonly done by storing data as records in key-value pairs. This also provides the benefit of O(1) key access. An array of records can be converted using a simple one-liner.

If order matters in a part of an application (that cannot computed), retain an array of `ids`.

```typescript
const normalizedState = {
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
};
```

## Derive values instead of storing them

Store minimal information in state and compute the data.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
```

Saving computed values is duplication in disguise. Storing computed values requires permanent maintenance for the lifespan of the app. When the data origin changes, the computed value needs to be updated in conjunction.

Never denormalize a state tree for speculative optimization. Assume an algorithm is fast until proven otherwise. On top of this, algorithms become a vanishing concern when computed values are cached. Powerful, functional, and robust memoization strategies will be covered (in part 3).

## Selectors: consistent and predictable data computation

The selector pattern is an algorithm design philosophy. It places emphasis on consistent interfaces for algorithms, which is perfect when there is a singular source of data for (almost) all parts of the application.

The benefits are immense:

- They are pure functions
- Easy to test
- Easy to refactor
- Uniform arguments make code easier to reason about
- Algorithms are decoupled from UI
- Enables structured and predictable memoization patterns (discussed later)
- Infinitely reusable with virtually no performance penalties (with memoization).

## Selectors with only state data

Algorithms that only require state data are easy to write and are composable.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);

const getDocLabels = (state) => {
  const docList = getDocList(state);
  return docList.map(({ title }) => title);
};
```

## Selectors with extra parameters

Selectors other parameters are trickier to write. The function needs to be curried. The reason will become apparent when memoization is covered.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id];
```

## `useSelector`

The higher order component approach was taken for learning purposes. It is the more "formal" way, because data management stays within React's data flow paradigm. A hook would be more practical, but they naturally rerender on every update, so a few sneaky tricks are required to suppress rerenders. Integrating `useSelector` into `makeProvider` requires some changes.

1. There needs to be a data structure to hold data listeners and they need to be recomputed for every render cycle (`subscribers`).
2. The current state needs to persist outside of the component (`currentState`).

Each hook retains computed data in a `useRef` hook, to avoid a rerender.

```tsx
const makeProvider = (initialState) => {
  // ...
  let subscribers = [];
  let currentState = initialState;

  // Provider component with state management hook
  const Provider = ({ children }) => {
    const reducer = (state, action) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);
    currentState = state;
    subscribers.forEach((fn) => {
      fn(state);
    });

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // ...

  const NotComputed = Symbol("NotComputed");

  const useSelector = (selector) => {
    const [, forceRender] = useReducer((s) => s + 1, 0);
    const selectorRef = useRef(selector);
    const currValRef = useRef(selector(currentState));

    useEffect(() => {
      const fn = (state: T) => {
        const computed = selectorRef.current(state);

        if (currValRef.current !== computed || state === initialState) {
          currValRef.current = computed;
          forceRender();
        }
      };
      subscribers.push(fn);

      return () => {
        subscribers = subscribers.filter((currFn) => currFn !== fn);
      };
    }, []);

    return currValRef.current;
  };

  return {
    applyState,
    Provider,
    useDispatch,
    createSelector,
    useSelector,
  };
};
```

## Selectors used in `useSelector`

It is no coincidence that the interface of the selector matches the interface of `useSelector`. By invoking the selectors in `useSelector`, algorithms and UI are neatly separated, along with optimal rerender suppression.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
const useGetDocList = () => useSelector(getDocList);

const makeGetDocById = (id) => (state) => state.docs[id];
const useGetDocById = (id) => useSelector(makeGetDocById(id));

const Component = (props) => {
  const docList = useGetDocList();
  const doc = useGetDocById(props.id);
  return null;
};
```

## Computed Data Will Rerender

This current strategy works because the selectors are returning nodes in the state tree. But if the operation inside the selector turns into algorithm that returns an object (which happens all the time), the selector will *always* trigger a rerender. Memoization makes this a solvable problem.

```typescript
const makeGetDocById = (id) => (state) => {
  const doc = state.docs[id]
  return {
    ...doc,
    timestamp: moment(doc.updatedAt).format('YYYY-MM-DD')
  }
};

const useGetDocById = (id) => useSelector(makeGetDocById(id));
```


## Conclusion

