import makeProvider from "./makeProvider";
import { State } from "./types";

const initialState: State = {
  rows: {},
  rowIds: [],
  columns: [],
  searchText: "",
  filters: [],
  focusedFilter: "",
  selected: [],
};

export const {
  Provider,
  applyState,
  // createSelector,
  useDispatch,
} = makeProvider(initialState);
