import React from "react";
import { applyState } from "../../state";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Dashboard: Component = (props) => {
  return null;
};

const mappedState = () => () => ({});

export default applyState<NoParentProps>(mappedState)(Dashboard);
