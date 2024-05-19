import React from "react";
import { applyState } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import Session from "./Session";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const NavBar: Component = (props) => {
  return (
    <nav>
      <HeavyUselessUI />
      {/* <Session /> */}
    </nav>
  );
};

const mappedState = () => () => ({});

export default applyState(mappedState)(NavBar);
