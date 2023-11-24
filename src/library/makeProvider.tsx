import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
  FunctionComponent,
  useMemo,
  memo,
} from "react";

const noop = () => null;

function makeProvider<T>(initialState: T) {
  type DispatchCb = (prevState: T) => Partial<T>;

  const StateContext = createContext(initialState);
  const DispatchContext = createContext(
    noop as unknown as Dispatch<DispatchCb>
  );

  // Provider component with state management hook
  const Provider: FunctionComponent<{ children: ReactNode }> = ({
    children,
  }) => {
    const reducer = (state: T, action: DispatchCb) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // HOC to connect state to components
  type MappedState<T, P, V = any> = () => (state: T, ownProps: P) => V;
  function applyState<P>(mappedState: MappedState<T, P>) {
    return (Component: FunctionComponent<any>) => {
      const MemoedComponent = memo(Component)
      const ApplyStateComponent = (props: P) => {
        const mappedStateInstance = useMemo(() => mappedState(), []);
        const state = useContext(StateContext);

        const mergedProps = {
          ...props,
          ...mappedStateInstance(state, props),
        };

        return <MemoedComponent {...mergedProps} />;
      };
      ApplyStateComponent.displayName = `applyState{${Component.name}}`;
      return ApplyStateComponent;
    };
  }

  const useDispatch = () => useContext(DispatchContext);

  return {
    applyState,
    Provider,
    useDispatch,
  };
}

export default makeProvider;
