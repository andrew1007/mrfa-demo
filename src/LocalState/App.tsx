import { useEffect, useState } from "react";
import Filter from "./Filter";
import Table, { TableProps } from "./Table";
import "./styles.css";
import { State, Row } from "./types";
import { EditableCellProps } from "../resources/EditableCell";
import { fetchColumns, fetchFilters, fetchRows } from "../resources/requests";

type Rows = Row[];
type Columns = State["columns"];
type Filters = State["filters"];
type SearchText = State["searchText"];
type FocusedFilter = State["focusedFilter"];
type Selected = State["selected"];
type HandleCellEdit = EditableCellProps["onConfirm"];
type ToggleCheckChange = TableProps["onCheck"];
type ToggleCheckAll = TableProps["onAllCheck"];

const App = () => {
  const [rows, setRows] = useState<Rows>([]);
  const [columns, setColumns] = useState<Columns>([]);
  const [filters, setFilters] = useState<Filters>([]);
  const [searchText, setSearchText] = useState<SearchText>("");
  const [focusedFilter, setFocusedFilter] = useState<FocusedFilter>("");
  const [selected, setSelected] = useState<Selected>([]);

  useEffect(() => {
    Promise.all([fetchRows(), fetchFilters(), fetchColumns()]).then(
      ([rows, filters, columns]) => {
        setRows(rows);
        setColumns(columns);
        setFilters(filters);
      }
    );
  }, []);

  const getFilteredRows = () => {
    const currentFilter = filters.find(({ id }) => id === focusedFilter);
    if (!currentFilter && !searchText) {
      return rows;
    }

    return rows
      .filter((row) =>
        currentFilter?.conditions.every(
          (cond) => row[cond.key] === cond.value
        ) ?? true
      )
      .filter(({ name }) => name.includes(searchText));
  };

  const handleCellEdit: HandleCellEdit = ({ id, key, value }) => {
    setRows((prevRows) => {
      return prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [key]: value };
        }
        return row;
      });
    });
  };

  const toggleCheckChange: ToggleCheckChange = (id) => (e) => {
    if (e.target.checked) {
      return setSelected((prevSelected) => [...prevSelected, id]);
    } else {
      return setSelected((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const toggleCheckAll: ToggleCheckAll = () => {
    if (selected.length === rows.length) {
      setSelected([]);
    } else {
      setSelected(rows.map(({ id }) => id));
    }
  };

  return (
    <>
      <Filter
        options={filters}
        onFilterChange={setFocusedFilter}
        onSearchChange={setSearchText}
        searchText={searchText}
      />
      <Table
        rows={getFilteredRows()}
        columns={columns}
        selected={selected}
        onEditCell={handleCellEdit}
        onCheck={toggleCheckChange}
        onAllCheck={toggleCheckAll}
      />
    </>
  );
};

export default App;
