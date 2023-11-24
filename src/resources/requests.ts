import { State, Row } from "../library/types";

const names = ["Andrew", "Alice", "Arik", "Frank", "May"];
const ages = ["24", "31", "34", "30", "45"];
const height = ["58", "56", "54", "53", "52"];

const random = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)];

export const fetchRows = (): Promise<Row[]> =>
  Promise.resolve(
    Array(50)
      .fill(names)
      .flat()
      .map((name, idx) => ({
        name,
        age: random(ages),
        height: random(height),
        id: `${idx + 1}`,
      }))
  );

type Filters = State["filters"];
export const fetchFilters = (): Promise<Filters> =>
  Promise.resolve([
    {
      id: "1",
      label: "Andrews",
      conditions: [{ key: "name", value: "andrew" }],
    },
    {
      id: "2",
      label: "31 year olds",
      conditions: [{ key: "age", value: "31" }],
    },
  ]);

type Columns = State["columns"];
export const fetchColumns = (): Promise<Columns> =>
  Promise.resolve([
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Height (inches)", key: "height" },
  ]);
