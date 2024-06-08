# Make React Fast Again Part 2: Normalized State Trees, the Selector Model, and `useSelector`

## Introduction

The complexity of modern frontend applications are immense. The way data is structured, managed, transformed, and computed will be the central point of interest. The better the data is designed, the simpler it is to maintain and optimize a React app.The principles of designing backend systems

Design decisions are easier when the application is treated like a server with a thin UI layer on top of it. In a server, data is king and is always treated with respect.

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

- They are [pure functions](https://en.wikipedia.org/wiki/Pure_function)
- Easy to test
- Easy to refactor
- Uniform arguments make code easier to reason about
- Algorithms are decoupled from UI
- Enables structured and predictable memoization patterns (discussed later)
- Infinitely reusable with virtually no performance penalties (with memoization).

## Selectors with only state data

Algorithms that only require state data are easy to write and are composable.

```typescript
// returns an array of `doc` objects, in the correct order
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);

// parses all doc objects (correct order) for their titles
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

The higher order component, via `applyState` approach was taken for learning purposes. It is the more "formal" way, because data management stays within React's data flow paradigm. A hook would be more practical, but they naturally rerender on every update. In order to use use hooks that suppress rerenders, sneaky tricks are required. Integrating a hook that does this, `useSelector`, requires some changes to `makeProvider`. The following exist outside of React's traditional data management system:

1. A data structure to hold data listeners and recomputed during render cycles (`subscribers`).
2. `state` needs to be tracked outside of the component (`currentState`).

Each hook retains computed data in a `useRef` hook, to avoid a rerender.

```tsx
const makeProvider = (initialState) => {
  // hold `useSelector` callbacks
  let subscribers = [];
  // keep a current copy of the current state for computing `useSelector`'s initial value
  let currentState = initialState;

  // Provider component with state management hook
  const Provider = ({ children }) => {
    const reducer = (state, action) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);

    // Update the current state on every render cycle
    currentState = state;

    // Recompute all selectors on every render cycle
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

  const useSelector = (selector) => {
    const [, forceRender] = useReducer((s) => s + 1, 0);
    const selectorRef = useRef(selector);
    const currValRef = useRef(selector(currentState));

    useEffect(() => {
      // listener for `useSelector` to determine if a rerender is required.
      const fn = (state) => {
        const computed = selectorRef.current(state);

        if (currValRef.current !== computed) {
          currValRef.current = computed;
          // force a rerender if the computed value fails strict equality
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

## `useSelector` Deconstructed

React's data management update system is inextricably tied to rerenders, so computation needs to exist outside of it. Here are the events that occur in order to accomplish this (in order).

This is accomplished by storing the selector functions inside a data structure that React does not manage.

1. On instantiation of `makeProvider`, an array is created to hold all `useSelector` callbacks.

```typescript
let subscribers = [];
```

2. Each instance of `useSelector` stores its callback in the `subscribers` array.

```typescript
const useSelector = (selector) => {
  // ...
  useEffect(() => {
    // listener for `useSelector` to determine if a rerender is required.
    const fn = (state) => {
      // ...
    };
    subscribers.push(fn);
  }, []);
};
```

3. On state update, `subscribers` are all recomputed

```typescript
const Provider = ({ children }) => {
  // ...
  const [state, dispatch] = useReducer(reducer, initialState);
  subscribers.forEach((fn) => {
    fn(state);
  });
};
```

4. The most recent state value needs to be available in order to correctly compute the initial value in `useSelector`.

```typescript
const Provider = ({ children }) => {
  // ...
  const [state, dispatch] = useReducer(reducer, initialState);

  let currentState = initialState;
};
```

5. `useSelector` uses `currentState` to compute the current value on mount. Each hook retains computed data in a `useRef` hook.

```typescript
const useSelector = (selector) => {
  // ...
  const currValRef = useRef(selector(currentState));
};
```

6. A rerender is forced when necessary. This setup defers the decision as to whether not a rerender should occur.

```typescript
const useSelector = (selector) => {
  const [, forceRender] = useReducer((s) => s + 1, 0);
  // ...

  useEffect(() => {
    // ...
    const fn = (state) => {
      const computed = selectorRef.current(state);
      const prevValue = currValRef.current;
      if (prevValue !== computed) {
        currValRef.current = computed;
        // force a rerender if the computed value fails strict equality
        forceRender();
      }
    };
    // ...
  }, []);

  // ...
};
```

## Selectors used in `useSelector`

`useSelector` and the selector pattern share identical interfaces. Rerenders are optimally suppress and, as a side bonus, algorithms and UI are neatly separated in an easy-to-reason (pure) way.

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

## Computed Data Will Always Rerender

This current strategy works because the selectors are returning nodes in the state tree. But if the operation inside the selector turns into algorithm that returns an object (which happens all the time), the selector will _always_ trigger a rerender.

In the following example, `makeGetDocById` now returns a new object on every computation, failing strict equality on every render cycle. The trick to solving this is by returning the same object as often as possible: memoization.

```typescript
const makeGetDocById = (id) => (state) => {
  const doc = state.docs[id];
  return {
    ...doc,
    timestamp: moment(doc.updatedAt).format("YYYY-MM-DD"),
  };
};

const useGetDocById = (id) => useSelector(makeGetDocById(id));
```

## Conclusion

Part 2 ends on a cliffhanger. Is this design paradigm so restrictive that one can't even compute custom data structures in a selector? This will *always* happen with a normalized `state` object. 

Does this deprive developers from doing basic things like returning new objects in an algorithm?

 hard-fought performance techniques? Should 


What's the point of all of this if something as simple as returning a new object destroys all
 sure readers on