import { State } from "./StateManager";

export const getFilteredRowIds = (state: State) => {
  const { filters, focusedFilter, searchText, rowIds, rows } = state
  const currentFilter = filters.find(({ id }) => id === focusedFilter);

  if (!currentFilter && !searchText) {
    return rowIds;
  }

  return rowIds
    .filter((rowId) =>
      currentFilter?.conditions.every(
        (cond) => rows[rowId][cond.key] === cond.value
      ) ?? true
    )
    .filter((rowId) => rows[rowId].name.includes(searchText));
}
