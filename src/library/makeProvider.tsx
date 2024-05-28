import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
  FC,
  useMemo,
  memo,
  useRef,
  useEffect,
} from "react";

const noop = () => null;

const makeProvider = <T,>(initialState: T) => {
  type DispatchCb = (prevState: T) => Partial<T>;
  let currentState = initialState
  const StateContext = createContext(initialState);
  const DispatchContext = createContext(
    noop as unknown as Dispatch<DispatchCb>
  );

  type StateSubscriber<V> = (state: T) => V

  let subscribers: StateSubscriber<any>[] = []

  // Provider component with state management hook
  const Provider: FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const reducer = (state: T, action: DispatchCb) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);
    currentState = state
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

  type Selector<OwnProps, V> = (state: T, ownProps: OwnProps) => V;
  function createSelector<B, A>(
    selectors: Selector<B, any>[],
    computingFn: (...arg: any[]) => A
  ) {
    let computedCache = [] as any[];
    let cache: A;

    return (state: T, ownProps?: B) => {
      const extracted = selectors.map((fn) =>
        fn(state, ownProps ?? ({} as B))
      ) as any[];
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

  const useSelector = <V,>(selector: StateSubscriber<V>) => {
    const [, forceRender] = useReducer(s => s + 1, 0);
    const selectorRef = useRef(selector);
    const currValRef = useRef(selector(currentState))
    useEffect(() => {
      const fn = (state: T) => {
        const computed = selectorRef.current(state)

        if (currValRef.current !== computed || state === initialState) {
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

  const useDispatch = () => useContext(DispatchContext);

  return {
    applyState,
    Provider,
    useDispatch,
    createSelector,
    useSelector,
  };
}

export default makeProvider;
