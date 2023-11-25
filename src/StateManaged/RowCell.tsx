import { applyState, useDispatch, State, Row } from "./StateManager";
import React from "react";
import EditableCell, { EditableCellProps } from "../resources/EditableCell";

type RowCellProps = {
  id: string;
  field: keyof Row;
};

type RowCellStateProps = ReturnType<ReturnType<typeof mappedState>>;
type RowCellComponent = React.FunctionComponent<
  RowCellProps & RowCellStateProps
>;
type HandleEdit = EditableCellProps["onConfirm"];

const RowCell: RowCellComponent = (props) => {
  const { value, id, field } = props;
  const dispatch = useDispatch();

  const handleEdit: HandleEdit = ({ id, key, value }) => {
    dispatch((prevState) => {
      const nextRows = { ...prevState.rows };
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
    <EditableCell field={field} id={id} value={value} onConfirm={handleEdit} />
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
