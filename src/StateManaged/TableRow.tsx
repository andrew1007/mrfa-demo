import { applyState, State } from "./StateManager";
import React from "react";
import RowCheckbox from "./RowCheckbox";
import RowCell from "./RowCell";

type TableRowProps = {
  id: string;
};
type TableRowStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowComponent = React.FunctionComponent<
  TableRowProps & TableRowStateProps
>;

const TableRow: TableRowComponent = (props) => {
  const { row, columns, id } = props;

  return (
    <tr>
      <td>
        <RowCheckbox id={id} />
      </td>
      {columns.map(({ key }) => <RowCell key={key} field={key} id={row.id} />)}
    </tr>
  );
};

const mappedState = () => (state: State, ownProps: TableRowProps) => {
  const { rows } = state;
  return {
    row: rows[ownProps.id],
    columns: state.columns,
  };
};

export default applyState<TableRowProps>(mappedState)(TableRow);
