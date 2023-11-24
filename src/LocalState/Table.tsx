import React from "react";
import EditableCell, { EditableCellProps } from "../resources/EditableCell";
import { State, Row } from "./types";

export type TableProps = {
  rows: Row[];
  columns: State["columns"];
  onEditCell: EditableCellProps["onEditCell"];
  onCheck: (
    id: string
  ) => React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  selected: State["selected"];
  onAllCheck: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
};

export const Table: React.FC<TableProps> = (props) => {
  const { rows, columns, onEditCell, onCheck, selected, onAllCheck } = props;

  const allCheckboxChecked = selected.length === rows.length;

  return (
    <table>
      <thead>
        <tr>
          <td>
            <input
              onChange={onAllCheck}
              checked={allCheckboxChecked}
              type="checkbox"
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
                <input
                  checked={selected.includes(row.id)}
                  onChange={onCheck(row.id)}
                  type="checkbox"
                />
              </td>
              {columns.map(({ key }) => {
                return (
                  <EditableCell
                    key={key}
                    value={row[key]}
                    id={row.id}
                    field={key}
                    onEditCell={onEditCell}
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
