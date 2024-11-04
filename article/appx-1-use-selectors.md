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

1. On instantiation of `makeProvider`, an array is created to hold all `useSelector` callbacks. These callbacks function as listeners.

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
const makeProvider = (initialState) => {
  let currentState = initialState;

  const Provider = ({ children }) => {
    // ...
    const [state, dispatch] = useReducer(reducer, initialState);
    currentState = state;
  };
  // ...

  const useSelector = (selector) => {
    // ...
    const currValRef = useRef(selector(currentState));
  };
};
```

6. A rerender is forced when the selector's cached value has changed. This setup defers the rerender decision.

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

With `useSelector`, rerenders are optimally suppressed. As a side bonus, algorithms and UI are neatly separated in an easy-to-reason (pure) way.

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
