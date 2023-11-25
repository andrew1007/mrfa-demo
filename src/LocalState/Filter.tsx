import React from "react";
import { State } from "./types";

type FilterProps = {
  options: State["filters"];
  onFilterChange: (id: string) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
};
type UpdateFocusedFilter = React.ChangeEventHandler<HTMLSelectElement>;
type UpdateSearchText = React.ChangeEventHandler<HTMLInputElement>;

const Filter: React.FC<FilterProps> = (props) => {
  const { options, onFilterChange, onSearchChange, searchText } = props;

  const updateFocusedFilter: UpdateFocusedFilter = (e) => {
    onFilterChange(e.target.value);
  };

  const updateSearchText: UpdateSearchText = (e) => {
    onSearchChange(e.currentTarget.value || "");
  };

  return (
    <div>
      <select onChange={updateFocusedFilter}>
        <option value={""}>None</option>
        {options.map(({ id, label }) => {
          return (
            <option value={id} key={id}>
              {label}
            </option>
          );
        })}
      </select>
      <input value={searchText} onChange={updateSearchText} />
    </div>
  );
};

export default Filter;
