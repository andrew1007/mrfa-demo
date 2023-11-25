import { applyState, State } from "./StateManager";
import React from "react";
import TableRow from "./TableRow";

type TableRowsStateProps = ReturnType<ReturnType<typeof mappedState>>;
type TableRowsComponent = React.FunctionComponent<TableRowsStateProps>;

const TableRows: TableRowsComponent = (props) => {
    const { filters, focusedFilter, searchText, rows, rowIds } = props
    const currentFilter = filters.find(({ id }) => id === focusedFilter);

    const filteredRowIds = rowIds.filter((rowId) =>
        currentFilter?.conditions.every(
            (cond) => rows[rowId][cond.key] === cond.value
        ) ?? true
    )
        .filter((rowId) => rows[rowId].name.includes(searchText));

    return (
        <>
            {filteredRowIds.map((id) => {
                return <TableRow id={id} key={id} />;
            })}
        </>
    );
};

const mappedState = () => (state: State) => {
    const { filters, focusedFilter, searchText, rowIds, rows } = state

    return { filters, focusedFilter, searchText, rowIds, rows }
};

export default applyState(mappedState)(TableRows);
