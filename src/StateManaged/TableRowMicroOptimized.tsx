import { applyState, State } from "./StateManager";
import React from "react";
import RowCheckbox from "./RowCheckbox";
import RowCell from "./RowCell";

export type TableRowProps = {
  id: string;
};
type TableRowStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowComponent = React.FunctionComponent<
  TableRowProps & TableRowStateProps
>;

export const TableRow: TableRowComponent = (props) => {
  const { columns, id } = props;

  return (
    <tr>
      <td>
        <RowCheckbox id={id} />
      </td>
      {columns.map(({ key }) => (
        <RowCell key={key} id={id} field={key} />
      ))}
    </tr>
  );
};

const mappedState = () => (state: State) => ({
  columns: state.columns,
});

export default applyState<TableRowProps>(mappedState)(TableRow);
