import { applyState, State, useDispatch } from "./StateManager";
import React, { ChangeEventHandler } from "react";

type FilterStateProps = ReturnType<ReturnType<typeof mappedState>>;
type FilterComponent = React.FunctionComponent<FilterStateProps>;
type UpdateFocusedFilter = ChangeEventHandler<HTMLSelectElement>;

export const Filter: FilterComponent = (props) => {
  const { options, value } = props;
  const dispatch = useDispatch();

  const updateFocusedFilter: UpdateFocusedFilter = (e) => {
    dispatch(() => ({
      focusedFilter: e.target.value,
    }));
  };

  return (
    <select onChange={updateFocusedFilter} value={value}>
      <option value={""}>None</option>
      {options.map(({ id, label }) => (
        <option value={id} key={id}>
          {label}
        </option>
      ))}
    </select>
  );
};

const mappedState = () => (state: State) => ({
  options: state.filters,
  value: state.focusedFilter,
});

export default applyState(mappedState)(Filter);
