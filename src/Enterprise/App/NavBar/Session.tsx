import React from "react";
import { applyState } from "../../state";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Session: Component = (props) => {
  return null;
};

const mappedState = () => () => ({});

export default applyState<NoParentProps>(mappedState)(Session);

const NewComponent: React.FC<Record<string, never>> = (props) => {
  return <div>hello my name is Andrew</div>;
};
