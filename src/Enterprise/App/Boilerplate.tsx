import React from "react";
import { applyState, State, useDispatch } from "../state";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Comp: Component = (props) => {
  const dispatch = useDispatch();
  return null;
};

const mappedState = () => (state: State) => ({});

export default applyState(mappedState)(Comp);
