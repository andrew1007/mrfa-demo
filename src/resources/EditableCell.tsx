import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Close, ModeEdit, Check } from '@mui/icons-material';
import { heavy } from "./utils";

export type EditableCellProps = {
  value: string;
  onConfirm: (value: string) => void;
};

const EditableCell: React.FC<EditableCellProps> = (props) => {
  const { value, onConfirm } = props;
  const [editState, setEditState] = useState(false);
  const [editValue, setEditValue] = useState("");

  heavy();

  useEffect(() => {
    if (!editState) {
      setEditValue(value);
    }
  }, [value, editState]);

  const handleEdit: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditValue(e.currentTarget.value);
  };

  const handleSave = () => {
    onConfirm(editValue);
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
            <Check className="icon" />
          </button>
          <button className="button" onClick={() => setEditState(false)}>
            <Close className="icon" />
          </button>
        </div>
      ) : (
        <div className="read-container">
          <span className="read-text">{value}</span>
          <button className="button" onClick={() => setEditState(true)}>
            <ModeEdit className="icon" />
          </button>
        </div>
      )}
    </th>
  );
};

export default EditableCell;
