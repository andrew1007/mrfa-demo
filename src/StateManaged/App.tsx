import React, { useEffect } from "react";
import Filter from "./Filter";
import SearchBar from "./SearchBar";
import { useDispatch } from "./StateManager";
import Table from "./Table";
import "./styles.css";
import { fetchColumns, fetchFilters, fetchRows } from "../resources/requests";

const App: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([fetchRows(), fetchFilters(), fetchColumns()]).then(
      ([rows, filters, columns]) => {
        dispatch(() => ({
          rows: Object.fromEntries(rows.map((row) => [row.id, row])),
          rowIds: rows.map(({ id }) => id),
          columns,
          filters,
        }));
      }
    );
  }, [dispatch]);

  return (
    <div>
      <Filter />
      <SearchBar />
      <Table />
    </div>
  );
};

export default App;
