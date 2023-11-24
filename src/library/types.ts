type colKey = keyof State["rows"][0];

export type Row = {
  name: string;
  age: string;
  height: string;
  id: string;
};

export type State = {
  rows: Record<string, Row>;
  rowIds: string[];
  columns: {
    label: string;
    key: colKey;
  }[];
  searchText: string;
  filters: {
    id: string;
    label: string;
    conditions: {
      key: colKey;
      value: string;
    }[];
  }[];
  focusedFilter: string;
  selected: string[];
};
