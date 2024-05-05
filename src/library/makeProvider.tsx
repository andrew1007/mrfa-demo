import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
  FC,
  useMemo,
  memo,
} from "react";

const noop = () => null;

const makeProvider = <T,>(initialState: T) => {
  type DispatchCb = (prevState: T) => Partial<T>;

  const StateContext = createContext(initialState);
  const DispatchContext = createContext(
    noop as unknown as Dispatch<DispatchCb>
  );

  // Provider component with state management hook
  const Provider: FC<{ children: ReactNode }> = ({
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

  const applyState = <P,>(mappedState: MappedState<T, P>) => {
    return (Component: FC<any>) => {
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

  type Selector<V> = (state: T) => V;
  function createSelector<B, A>(selectors: Selector<B>[], computingFn: (...arg: any[]) => A) {
    let computedCache = [] as any[];
    let cache: A;

    return (state: T) => {
      const extracted = selectors.map((fn) => fn(state)) as any[];
      const hasChanges = extracted.some(
        (computed, idx) => computedCache[idx] !== computed
      );
      if (!cache || hasChanges) {
        cache = computingFn(...extracted);
        computedCache = extracted;
      }

      return cache;
    };
  }

  const useDispatch = () => useContext(DispatchContext);

  return {
    applyState,
    Provider,
    useDispatch,
    createSelector,
  };
}

export default makeProvider;
