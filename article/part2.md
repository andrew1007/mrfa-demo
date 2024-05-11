# Make React Fast Again Part 2: Normalized State Trees, the Selector Model, and `useSelector`

## Introduction

The complexity of modern frontend applications are immense. Design decisions are easier when the application is treated like a server with a thin UI layer on top of it. In a server, data is king and is always treated with respect.

The way data is structured, managed, transformed, and computed will be the central point of interest. The better the data is designed, the simpler it is to maintain and optimize a React app.

## Normalized State Data

Normalization is imperative for a maintainable SSOT (single source of truth) data model. Do not duplicate stored data. It may be helpful to think of a state tree as a server-side database. In the same way data (and its normalization) is respected on the backend, similar attitudes should apply to how the frontend manages data.

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

Assume an algorithm is fast until proven otherwise. Never denormalize a state tree for speculative optimization. Powerful, functional, and robust memoization (covered in part 3) solves virtually all performance issues.

## Selectors: consistent and predictable data computation

The selector pattern is an algorithm design philosophy. It places emphasis on consistent interfaces for algorithms, which is perfect when there is a singular source of data for (almost) all parts of the application.

The benefits are immense:

- They are pure functions
- Easy to test
- Easy to refactor
- Uniform arguments make code easier to reason about
- Algorithms are decoupled from UI
- Memoization is easy (discussed later)
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

Selectors with multiple parameters are a little trickier to write. The extra data can technically be added as a second parameter. But for the time being, write them as curried functions. The reason will become apparent when memoization is covered.

```typescript
const makeGetDocById = (id) => (state) => state.docs[id]
```

## `useSelector`

For the sake of learning, the higher order component model for rerender suppression was discussed. But practically speaking, it is easier to use a hook. But hooks will naturally rerender on every update, so a few sneaky tricks need to be performed in order to suppress rerenders on every render cycle. Integrating `useSelector` into `makeProvider` requires a few small changes. There needs to be a data structure to hold data listeners and they need to be recomputed for every render cycle.

```tsx
const makeProvider = (initialState) => {
  // ...
  let subscribers = []

  // Provider component with state management hook
  const Provider = ({ children }) => {
    const reducer = (state, action) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);

    subscribers.forEach((fn) => {
      fn(state)
    })

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // ...

  const NotComputed = Symbol('NotComputed')

  const useSelector = (selector) => {
    const [, forceRender] = useReducer(s => s + 1, 0);
    const selectorRef = useRef(selector);
    const currValRef = useRef(NotComputed as V)

    useEffect(() => {
      const fn = (state) => {
        const computed = selectorRef.current(state)
        if (currValRef.current !== computed) {
          currValRef.current = computed
          forceRender()
        }
      }
      subscribers.push(fn)
      return () => {
        subscribers = subscribers.filter(currFn => currFn !== fn)
      }
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
}
```

## `useSelector` Explained

Each hook retains computed data in a `useRef` hook, because assigning data to it does not trigger a rerender.


## Selectors used in `useSelector`

It is no coincidence that the interface of the selector matches the interface of `useSelector`. By invoking the selectors in `useSelector`, algorithms and UI are neatly separated, along with optimal rerender suppression.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
const useGetDocList = useSelector(getDocList)

const makeGetDocById = (id) => (state) => state.docs[id]
const useGetDocById = (id) => useSelector(makeGetDocById(id))

const Component = (props) => {
  const docList = useGetDocList()
  const doc = useGetDocById(props.id)
  return null
}
```

