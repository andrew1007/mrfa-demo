import React from "react";
import EditableCell from "../resources/EditableCell";
import RowCheckbox from "./RowCheckbox";
import { State, Row } from "./types";
import { HandleCellEdit } from "./App";

export type TableProps = {
  rows: Row[];
  columns: State["columns"];
  onEditCell: HandleCellEdit;
  onCheck: (
    id: string
  ) => React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  selected: State["selected"];
  onAllCheck: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
};

const Table: React.FC<TableProps> = (props) => {
  const { rows, columns, onEditCell, onCheck, selected, onAllCheck } = props;

  const allCheckboxChecked = selected.length === rows.length;

  return (
    <table style={{ margin: 'auto' }}>
      <thead>
        <tr>
          <td>
            <RowCheckbox
              onChange={onAllCheck}
              checked={allCheckboxChecked}
            />
          </td>
          {columns.map(({ label, key }) => {
            return <td key={key}>{label}</td>;
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          return (
            <tr key={row.id}>
              <td>
                <RowCheckbox
                  checked={selected.includes(row.id)}
                  onChange={onCheck(row.id)}
                />
              </td>
              {columns.map(({ key }) => {
                return (
                  <EditableCell
                    key={key}
                    value={row[key]}
                    onConfirm={(value) => {
                      onEditCell({
                        id: row.id,
                        key,
                        value
                      })
                    }}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
