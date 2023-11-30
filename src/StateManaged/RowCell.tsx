import { applyState, useDispatch, State, Row } from "./StateManager";
import React from "react";
import EditableCell, { EditableCellProps } from "../resources/EditableCell";

type RowCellProps = {
  id: string;
  field: keyof Row;
};

type RowCellStateProps = ReturnType<ReturnType<typeof mappedState>>;
type RowCellComponent = React.FC<RowCellProps & RowCellStateProps>;
type HandleEdit = EditableCellProps["onConfirm"];

const RowCell: RowCellComponent = (props) => {
  const { value, id, field } = props;
  const dispatch = useDispatch();

  const handleEdit: HandleEdit = (value) => {
    dispatch((prevState) => {
      const nextRows = { ...prevState.rows };
      nextRows[id] = {
        ...nextRows[id],
        [field]: value,
      };

      return {
        rows: nextRows,
      };
    });
  };

  return (
    <EditableCell value={value} onConfirm={handleEdit} />
  );
};

const mappedState = () => (state: State, ownProps: RowCellProps) => {
  const { rows } = state;
  const { field, id } = ownProps;
  return {
    value: rows[id][field],
  };
};

export default applyState<RowCellProps>(mappedState)(RowCell);
