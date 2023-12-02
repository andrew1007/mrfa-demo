import { applyState, State } from "./StateManager";
import React from "react";
import RowCheckbox from "./RowCheckbox";
import RowCell from "./RowCell";

type TableRowProps = {
  id: string;
};
type TableRowStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowComponent = React.FC<
  TableRowProps & TableRowStateProps
>;

const TableRow: TableRowComponent = (props) => {
  const { columns, id } = props;

  return (
    <tr>
      <td>
        <RowCheckbox id={id} />
      </td>
      {columns.map(({ key }) => <RowCell key={key} field={key} id={id} />)}
    </tr>
  );
};

const mappedState = () => (state: State) => {
  return {
    columns: state.columns,
  };
};

export default applyState<TableRowProps>(mappedState)(TableRow);
