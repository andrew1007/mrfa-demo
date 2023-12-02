import React from "react";
import { useDispatch, applyState, State } from "./StateManager";
import { heavy } from "../resources/utils";

type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FC<StateProps>;
type ToggleCheck = React.InputHTMLAttributes<HTMLInputElement>["onChange"];

const AllCheckbox: Component = (props) => {
  const { allSelected } = props;
  heavy();
  const dispatch = useDispatch();

  const toggleCheck: ToggleCheck = () => {
    dispatch(({ rowIds }) => ({
      selected: allSelected ? [] : [...rowIds],
    }));
  };

  return <input onChange={toggleCheck} checked={allSelected} type="checkbox" />;
};

const mappedState = () => (state: State) => ({
  allSelected: state.selected.length === state.rowIds.length,
});

export default applyState(mappedState)(AllCheckbox);
