import React from "react";
import { applyState, State, useDispatch } from "./StateManager";
import { heavy } from "../resources/utils";

type ParentProps = {
  id: string;
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type RowCheckboxComponent = React.FC<ParentProps & StateProps>;

type ToggleCheck = React.InputHTMLAttributes<HTMLInputElement>["onChange"];

const RowCheckbox: RowCheckboxComponent = (props) => {
  const { id, checked } = props;
  const dispatch = useDispatch();
  heavy();
  const toggleCheck: ToggleCheck = (e) => {
    dispatch(({ selected }) => ({
      selected: e.target.checked
        ? [...selected, id]
        : selected.filter((selectedId) => selectedId !== id),
    }));
  };

  return <input onChange={toggleCheck} type="checkbox" checked={checked} />;
};

const mappedState = () => (state: State, ownProps: ParentProps) => ({
  checked: state.selected.includes(ownProps.id),
});

export default applyState(mappedState)(RowCheckbox);
