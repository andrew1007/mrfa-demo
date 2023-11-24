# Make React Fast Again Part 1: Reconciliation

It really is a shame that there is no style guide. The freedom to do whatever you want is the freedom to create poor experiences for users of your application. One of the biggest mistakes that is made, almost without fail, is poor performance. The core architecture of many apps inevitably out-scale itself. React apps start fine, but slowly accumulate performance problems. But make no mistake: React is not inherently slow. But it is easy to make architectural decisions that make it slow.

I want to set the record straight and show you the true potential of React. I would not be arrogant enough to say that my way is the definitive approach. I am only here to show you one way that I have developed through personal experience. It has been proven itself in my personal and professional projects that I develop at TikTok. 

But this is not easy to teach. It requires a deep understanding of React, data structure mutations, and established design patterns. The first step is to learn what the virtual DOM is and the reconciliation algorithm.

The virtual DOM is React’s approach to high-performance DOM changes. The virtual DOM is an un-rendered representation of the previous DOM state. When a change occurs, optimal transformation strategies are performed by comparing the virtual DOM to the DOMs next incoming state.

The comparison process utilizes the reconciliation algorithm. The DOM diffing process of a mounted component is commonly referred to as a rerender. When a component rerenders, its children (at all levels of nesting) trigger render cycles. Render cycles are triggered when data is updated (usually with the `useState` hook).

This rendering strategy can create crippling performance issues in large applications. Rerender propagation is an obfuscated process for the untrained eye. When, why, and where rerenders are is lost in the sauce for large applications.

Rerenders are not inherently bad. After all, they are necessary for an application to be responsive. It is when rerenders occur many times and, most importantly, when they are triggered in unnecessary places.

Discovering performance woes is easy (fixing them is another story) with the browser extension React Developer Tools. It has a performance profiler that visualizes component render cycles, via flame graph.

To visualize this, a small application is needed. This app has a button that increments a counter and a basic table implementation. Note that this table, on a conceptual level, is unrelated to the button and its incrementing UI.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button onClick={() => setCounter((prev) => prev + 1)}>
        increment ({counter})
      </button>
      <Table />
    </div>
  );
};

const Table = () => (
  <table>
    <tbody>
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Row idx={i} key={i} />
        ))}
    </tbody>
  </table>
);

const Row = ({ idx }) => (
  <tr>
    <td>{idx}</td>
  </tr>
);

ReactDOM.render(
  <App />,
  // assuming you have an html file with a <div id="root" />
  document.getElementById("root")
);
```

A button click triggers a render cycle by invoking `setCounter`. Visually, `App` has experience a DOM update. But reconciliation is diffing more DOM nodes than one might expect.

No props have been passed down to Table and Row. It is fundamentally impossible for these components be affected by the parent's App.jsx state change. But cascading rerenders for every child in the component is the default behavior. Updating App.jsx causes reconciliation to uselessly trigger for all of its children. This consumes precious resources on the client.

Imagine one state change triggering useless render cycles on hundreds DOM elements. What if something trivial like an `input` did this on every keystroke? This is the silent killer of enterprise software.

A defacto solution exists for useless rerender suppression, called `React.memo`. It performs a shallow equality check (JavaScript's strict equality operator) on all incoming props from the parent component. In the sample code, simply wrapping the child components with it.

With this simple change, the flame graph has changed. There are now gray cells. These represent components that did not rerender during a particular render cycle in the app.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = React.memo(() => {
  // ...
});

const Table = React.memo(() => (
  // ...
));

const Row = React.memo(({ idx }) => (
  // ...
));

ReactDOM.render(
  <App />,
  // assuming you have an html file with a <div id="root" />
  document.getElementById("root")
);
```

It would be naive to think that we're done. Any professional developer knows that this example looks nothing like enterprise software. We need to develop a full-scale architecture in order to leverage the power of `React.memo` in apps that render thousands of DOM nodes and trigger hundreds of render cycles (possibly thousands) per minute.

In order to see what a fast implementation looks like, first we need to look at one that is slow. Here is the implementation of a searchable and selectable table using local state. Because data is required in many locations, a god component is necessary when using local state. Code snippets here will not be type defined. The repo here has the full code in TypeScript. The most important part of this is to see that all of the managed data needs to be passed down from the top of the component hierarchy.

```jsx
import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import { fetchColumns, fetchFilters, fetchRows } from "./requests";
import Table from "./Table";

const App = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState([]);
  const [focusedFilter, setFocusedFilter] = useState("");
  const [selected, setSelected] = useState([]);

  // fetch all table data from an endpoint
  useEffect(() => {
    Promise.all([fetchRows(), fetchFilters(), fetchColumns()]).then(
      ([rows, filters, columns]) => {
        setRows(rows);
        setColumns(columns);
        setFilters(filters);
      }
    );
  }, []);

  // using the current selected filter conditions, filter our non-matching rows
  const getFilteredRows = () => {
    const currentFilter = filters.find(({ id }) => id === focusedFilter);
    if (!currentFilter) {
      return rows;
    }

    return rows
      .filter((row) =>
        currentFilter?.conditions.every(
          (cond) => row[cond.key] === cond.value
        ) ?? true
      )
  };

  // update table data on save
  const handleCellEdit = ({ id, key, value }) => {
    setRows((prevRows) => {
      return prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [key]: value };
        }
        return row;
      });
    });
  };

  // update array of selected checkbox
  const toggleCheckChange = (id) => (e) => {
    if (e.target.checked) {
      return setSelected((prevSelected) => [...prevSelected, id]);
    } else {
      return setSelected((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  // select or deselect all, based on current state of selected checkboxes
  const toggleCheckAll = () => {
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
```

It is telling about useless rerenders when inspecting the flame graph, On checkbox select and selecting new filter conditions, a complete rerender of the entire table occurs. When inspecting the props that are passed down from `App` to `Table`, you can see that it is fundamentally impossible to ever suppress rerenders; even if `Table` is wrapped in a `React.memo`. `getFilteredRows()`, `handleCellEdit`, `toggleCheckChange`, and `toggleCheckAll` fail reference equality on every render cycle.

Technically, this could be solved with `useCallback` and `useMemo`. But these should be avoided as often as possible. They are brittle to use and must be vigilantly maintained. These hooks rely on a dependency array, which is susceptible to ineffective memoization and returning stale values.

Traditional performance techniques, like `useCallback` and `useMemo`, inevitably become liabilities in large applications. All of these issues and considerations are a non-issue if a different data management design pattern is used. It starts with shared state: the Context API.

### Performant Context

The guiding principle is minimizing reliance of UI on other UI. The more data is passed from parent to child, the harder it is to optimize. In order to directly pass data to the components that need it, the context API is needed.

Context is widely regarded as slow; with claims that it does not scale. This is a half-truth. In reality, context is not intrinsically slow. What is slow is the downstream consequences of data updating. `useContext` triggers rerenders every time data updates. Triggering reconciliation on DOM nodes is slow.

But this is based on the most common design pattern that is used with context, which is calling `useContext` directly inside the UI component that needs the data. The key phrase is "UI component". Of course, `useContext` must be called in a component; but nothing is stopping us from using it in a component that has no HTML.

Here is a basic state management library that can be used to suppress rerenders. It is a scalable implementation that works in applications of any size. It leverages the following concepts:

- Context to store state
- useReducer to dispatch and transform state data
- higher order component to process data before it is passed to a component.

```jsx
import React, {
  createContext,
  useContext,
  useReducer,
} from "react";

const noop = () => null;

function makeProvider(initialState) {

  const StateContext = createContext(initialState);
  const DispatchContext = createContext(noop);

  // Provider component with state management hook
  const Provider = ({ children }) => {
    const reducer = (state, action) => ({
      ...state,
      ...action(state),
    });

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // HOC to connect state to components
  function applyState(mappedStateFn) {
    return (Component) => {
      const ApplyStateComponent = (props: P) => {
        const state = useContext(StateContext);

        const mergedProps = {
          ...props,
          ...mappedStateFn(state, props),
        };

        return <Component {...mergedProps} />;
      };
      ApplyStateComponent.displayName = `applyState{${Component.name}}`;
      return ApplyStateComponent;
    };
  }

  const useDispatch = () => useContext(DispatchContext);

  return {
    applyState,
    Provider,
    useDispatch,
  };
}

export default makeProvider;
```

The high order component `applyState` is the secret sauce here. Instead of exposing all of state to a component, `applyState` accepts a function resolver that allows pre-processing data before it is passed down to the component. By strategically parsing, extracting, and computing data inside `applyState`, `React.memo` (which is embedded in the implementation of `applyState`) can properly detect and suppress rerenders.

The `dispatch` function is in its own context and directly exposed (via `useDispatch`). This is because `dispatch` is a stable dependency. It is safe to use as a hook directly in components because it will never trigger a rerender. The full state tree is available in the callback argument. You can think of this `dispatch` pattern as a (less powerful) thunk that can be directly called in a component.

This is one step closer to applying this to enterprise software. But we aren't there yet. There is an art to meeting strict equality for all incoming data as often as possible.

In this article, I will cover the easiest one: component design.

Designing optimized components is about creating a logical separation of UI elements based on the data they use. Size of a component is not the causation of optimized components; it is a correlation.

To conceptualize this, we can revisit our naive table. What is the logical separation of data, based on the minimum amount of data that is required for rendering? To explore this properly, we need to tabulate the features of the table and the correlating data that is required from them.

To accomplish this, we start at the bottom of the component hierarchy and work up. The lower in the hierarchy we can isolate heavy data access, the better.

Cell:
Each cell is technically the true rendering location (AKA the HTML) of the data in the table. The minimum amount of information that is required is the text to be rendered. The checkbox cell's minimum amount of information to render is a `checked` boolean.

The cell is where all of the heavy lifting occurs. It only stands to reason that the rest of the components should be designed to suppress useless rerenders for cells. Ticking a checkbox doesn't need to rerender checkboxes for other rows. Filtering out rows by selection doesn't need to rerender cells. To accomplish this, data access needs to circumvent the component hierarchy as much as possible. This is where our custom context abstraction, `applyState` comes into play.

Make no mistake: passing data down from parent to child is oftentimes required. The difference between the optimized and naive approach is making strategic decisions to minimize the amount of information to pass down. In an overwhelming majority of situations, the minimum amount of information is an id. Passing down an id (which are primitives) from parent to child won't trigger a useless rerender when the component is wrapped in `React.memo`. `applyState` embeds `React.memo`; if a component is wrapped in it, `React.memo` does not need to be wrapped again. The `id` from the parent and direct data access + computation inside `applyState` is how strict equality for all incoming props will be met.

## Optimized Component Design

With the prerequisite knowledge out of the way, we can finally get started with component design. Note that the algorithms I will be writing are not ideal. What should be focused on are the rerender-suppression strategies. Robust and optimized algorithms are part of the overall architecture. But not enough topics have been covered yet to talk about them.

### Isolate Zero-dependency UI
For brevity's sake, I will concentrate on the content in the `tbody` content and "select all" checkbox. Conceptually, the way columns work are identical.

Only the minimum amount of information should be passed down. In this use case, `table`, `tbody` and `tr` for the column headers never change, so it makes sense to group them into a component that do not accept nor provide any `props`. It is ideal to group zero-dependency UI into a separate component; they will never have a reason to rerender itself, nor propagate rerenders down to its children. Remember to wrap this in `React.memo`.

```jsx
import React from "react";
import TableColumns from "./TableColumns";
import AllCheckbox from "./AllCheckbox";
import TableRows from "./TableRows";

export const Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <td>
            <AllCheckbox />
          </td>
          <TableColumns />
        </tr>
      </thead>
      <tbody>
        <TableRows />
      </tbody>
    </table>
  );
};

export default React.memo(Table);
```

### Row Optimization

The next logical separation is the iteration of the table rows, where each `tr` is its own component. The minimum amount of information required to track what data maps to which `tr` is the `id` of the data record.

```jsx
import React from "react";
import { applyState, State } from "./StateManager";
import TableRow from "./TableRow";

export const TableRows = (props) => {
  const { rowIds } = props;
  return (
    <>
      {rowIds.map((id) => {
        return <TableRow id={id} key={id} />;
      })}
    </>
  );
};

const getFilteredRowIds = (state) => {
  const { filters, focusedFilter, rows } = state
  const currentFilter = filters.find(({ id }) => id === focusedFilter);
  if (!currentFilter) {
    return rows;
  }

  return rows
    .filter((row) =>
      currentFilter?.conditions.every(
        (cond) => row[cond.key] === cond.value
      ) ?? true
    )
    .map(({ id }) => id)
};

const mappedState = () => (state: State) => {
  return {
    rowIds: getFilteredRowIds(state),
  }
};

export default applyState(mappedState)(TableRows);
```

`rowIds`, which always fails strict equality, triggers a rerender on every render cycle. With our current set of knowledge, this rerender is virtually unavoidable. But this is of little consequence. This difficult-to-suppress operation is completely isolated from the rest of the system. Due to the content of the component. There is almost no rerender overhead, nor do rerenders propagate down. Strict equality is met as often as possible, because `TableRow`'s only prop is `id`.

### Cell Optimization

Passing data from `TableRow` down to `TableCell` is an open-ended problem. There are a multiple to approaches, but the common goals are the same
1. The cell is its own component.
2. The data computed in `applyState` should pass strict equality as often as possible.

For `TableCell`, the `id` is not enough information. The field name is required as well. In this use case, passing the column in its entirety to each row component is perfectly fine, from a performance standpoint. In this use case, the data in the store never changes. Strict equality will be met when passing the entire array of columns down.

The minimum amount of information (that also passes strict equality) is passed from parent UI to its children. In `applyState`, the entire state tree is available, so we can use the identifiers (`id` and `fieldName`) to access data. The heavy lifting can be done inside `applyState` and data that will always pass strict equality (in this case a string) can be passed down. This takes care of rendering the cell's read state.

### Checkbox Optimization

The checkbox requires a different approach. Only the `id` is required to track which row's checkbox is currently being rendered. Passing the entire array of selected rows is a bad idea. This data structure will change when a checkbox is interacted with and will fail reference equality for all checkboxes simultaneously. Instead, the calculation can be done inside `applyState` and a simple `boolean` can be passed down. By doing this, only the checkbox that has changed will rerender.

### Performance visualization

Given a large table, any of these operations would bring a naive implementation to its knees. Every cell would rerender in any interaction. But because we are accessing data in such a granular and targeted way, this is a non-issue. The flame graphs say it all.

## Algorithms Outside of UI

Front-loading the computation in `applyState` may seem like a waste of resources. If the entire subtree is passed to the component, useless recomputation of O(n) or even O(n^2) would be circumvented.

```jsx
const RowCheckbox = (props) => {
  const { id, selected } = props;
  const dispatch = useDispatch();
  
  const checked = selected.includes(id)

  const toggleCheck = (e) => {
    dispatch(({ selected }) => ({
      selected: e.target.checked
        ? [...selected, id]
        : selected.filter((selectedId) => selectedId !== id),
    }));
  };

  return <input onChange={toggleCheck} type="checkbox" checked={checked} />;
};

const mappedState = () => (state: State) => ({
  selected: state.selected,
});

export default applyState(mappedState)(RowCheckbox);
```

This true, but impractical. Remember that this architecture is for enterprise software; maintainability comes first. Algorithms in components violate separation of concerns and they cannot be reused in other locations. On top of that, there is already a solution for this. Functional (pure) memoization strategies enable patterns that are robust and reusable. The negligible performance tradeoff is worth the massive increases in scalability of the architecture.

With these concepts, an app gains huge performance wins in many situations. This is only scratching the surface of the knowledge to write a fully optimized React app. To get the full picture, these topics need to be covered.

- Robust memoization strategies for computed data
- Structuring normalized state trees
- Dispatching optimal state transformations
