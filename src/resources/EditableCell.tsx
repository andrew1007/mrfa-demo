import React, { ChangeEventHandler, useEffect, useState } from "react";

export type EditableCellProps = {
  value: string;
  onEditCell: (params: { id: string; key: string; value: string }) => void;
  field: string;
  id: string;
};

const EditableCell: React.FC<EditableCellProps> = (props) => {
  const { value, onEditCell, id, field } = props;
  const [editState, setEditState] = useState(false);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!editState) {
      setEditValue(value);
    }
  }, [value, editState]);

  const handleEdit: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditValue(e.currentTarget.value);
  };

  const handleSave = () => {
    onEditCell({
      id,
      key: field,
      value: editValue,
    });
    setEditState(false);
  };

  return (
    <th className="cell">
      {editState ? (
        <div className="edit-container">
          <input
            value={editValue}
            onChange={handleEdit}
            className="value-edit"
          />
          <button className="button" onClick={handleSave}>
            <div className="confirm" />
          </button>
          <button className="button" onClick={() => setEditState(false)}>
            <div className="close" />
          </button>
        </div>
      ) : (
        <div className="read-container">
          <span className="read-text">{value}</span>
          <button className="button" onClick={() => setEditState(true)}>
            <div className="edit" />
          </button>
        </div>
      )}
    </th>
  );
};

export default EditableCell;
