import { applyState, useDispatch, State } from "./StateManager";
import React from "react";
import RowCheckbox from "./RowCheckbox";
import EditableCell, { EditableCellProps } from "../resources/EditableCell";

type TableRowProps = {
  id: string;
};
type TableRowStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowComponent = React.FunctionComponent<
  TableRowProps & TableRowStateProps
>;
type HandleEdit = EditableCellProps["onEditCell"];

const TableRow: TableRowComponent = (props) => {
  const { row, columns } = props;
  const dispatch = useDispatch();

  const handleEdit: HandleEdit = ({ id, key, value }) => {
    dispatch(({ rows }) => {
      const nextRows = { ...rows };
      nextRows[id] = {
        ...nextRows[id],
        [key]: value,
      };

      return {
        rows: nextRows,
      };
    });
  };

  return (
    <tr>
      <td>
        <RowCheckbox id={row.id} />
      </td>
      {columns.map(({ key }) => {
        return (
          <EditableCell
            key={key}
            field={key}
            id={row.id}
            value={row[key]}
            onEditCell={handleEdit}
          />
        );
      })}
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
