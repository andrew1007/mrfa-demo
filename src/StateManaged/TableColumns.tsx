import React from "react";
import { applyState, State } from "./StateManager";

type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableHeaderComponent = React.FunctionComponent<StateProps>;

export const TableColumns: TableHeaderComponent = (props) => {
  const { columns } = props;

  return (
    <>
      {columns.map(({ label, key }) => {
        return <td key={key}>{label}</td>;
      })}
    </>
  );
};

const mappedState = () => (state: State) => ({
  columns: state.columns,
});

export default applyState(mappedState)(TableColumns);
