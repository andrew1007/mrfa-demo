import { applyState, State } from "./StateManager";
import React from "react";
import TableRow from "./TableRow";
import { getFilteredRowIds } from "./selectors";

type TableRowsStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowsComponent = React.FC<TableRowsStateProps>;

const TableRows: TableRowsComponent = (props) => {
  const { rowIds } = props;
  return (
    <>
      {rowIds.map((id) => {
        return <TableRow id={id} key={id} />;
      })}
    </>
  );
};

const mappedState = () => (state: State) => {
  return {
    rowIds: getFilteredRowIds(state),

  }
};

export default applyState(mappedState)(TableRows);
