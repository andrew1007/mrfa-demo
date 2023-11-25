import React from "react";
import { applyState, State } from "./StateManager";

type ParentProps = {
  id: string;
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type RowCheckboxComponent = React.FunctionComponent<ParentProps & StateProps>;

type ToggleCheck = React.InputHTMLAttributes<HTMLInputElement>["onChange"];

const RowCheckbox: RowCheckboxComponent = (props) => {
  const { checked } = props;

  // Don't worry about this handler. We're concentrating on the pre-computation aspect of this code snippet
  const toggleCheck: ToggleCheck = (e) => null

  return <input onChange={toggleCheck} type="checkbox" checked={checked} />;
};

const mappedState = () => (state: State, ownProps: ParentProps) => ({
  checked: state.selected.includes(ownProps.id),
});

export default applyState(mappedState)(RowCheckbox);
