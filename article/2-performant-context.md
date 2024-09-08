
## Performant Context

The guiding principle of fast components is the minimization of UI relying on other UI for data. Optimizing becomes harder when more data is passed from parent to child. Circumventing data-passing from parent to child requires the context API.

Context is widely regarded as slow; with claims that it does not scale. This is a half-truth. The downstream consequence Context's usage is the real origin of degraded performance. [`useContext`](https://react.dev/reference/react/useContext) triggers rerenders on every context update. In reality, criticisms of context's performance should actually be pointed at computational overhead of reconciliation.

Calling `useContext` inside UI components is its standard usage. But this design pattern is how expensive rerenders and Context updates appear to be immutably linked. Of course, `useContext` is called in a component. But `useContext` is usable in components with no HTML.

Here is a basic state management library that can be used to suppress rerenders. It is a scalable implementation that works in applications of any size. It leverages the following concepts:

- [`Context`](https://react.dev/reference/react/createContext) to store data.
- [`useReducer`](https://react.dev/reference/react/useReducer) to dispatch and transform state data.
- Higher order component to access context data and process data before it is passed to a component.

```jsx
import React, { createContext, useContext, useReducer } from "react";

const noop = () => null;

const makeProvider = (initialState) => {
  const StateContext = createContext(initialState);
  const DispatchContext = createContext(noop);

  const reducer = (state, action) => ({
    ...state,
    ...action(state),
  });

  // Provider component with state management hook
  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // HOC to connect state to components
  const applyState = (mappedState) => {
    return (Component) => {
      const MemoComponent = memo(Component);
      const ApplyStateComponent = (props) => {
        const mappedStateInstance = useMemo(() => mappedState?.(), []);

        const state = useContext(StateContext);
        const combinedProps = {
          ...props,
          ...mappedStateInstance?.(state, props),
        };

        return <MemoComponent {...combinedProps} />;
      };
      ApplyStateComponent.displayName = `applyState{${Component.name}}`;
      return ApplyStateComponent;
    };
  };

  const useDispatch = () => useContext(DispatchContext);

  return {
    applyState,
    Provider,
    useDispatch,
  };
};

export default makeProvider;
```

The high order component `applyState` is the secret sauce. `applyState` acts as a proxy for context access. Components never have direct access to context. `applyState` accepts a function resolver, allowing data processing before it is passed down to the component. Under the hood, `applyState` calls `useContext`. As a consequence, `applyState` always gets rerendered. But the computational overhead of algorithms in `applyState`'s function resolver is miniscule compared to rerenders of components with DOM nodes.

By strategically parsing and computing data inside `applyState`, `React.memo` (embedded in `applyState`) can properly detect and suppress useless rerenders. The interface of `applyState` is akin to [`connect`](https://react-redux.js.org/api/connect) in `redux`. The function resolver of `applyState` is essentially `mapStateToProps`.

The `dispatch` function (from `useReducer`) is in its own context and directly exposed (via `useDispatch`). `dispatch` is a stable dependency (retains reference equality), making it safe to use directly in components. The full state tree is available in the callback argument. This `dispatch` pattern can be thought of as a (less powerful) thunk that can be directly called in a component.

This is one step closer to application in enterprise software. But there is an art to maximizing strict equality for components that receive data from context.
