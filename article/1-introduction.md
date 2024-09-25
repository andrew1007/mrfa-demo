# Make React Fast Again Part 1: Reconciliation and Component Design

## React can be fast

It's a shame that there is no style guide for React. One of the biggest mistakes that is made, almost without fail, is poor performance. The core architecture of many apps inevitably out-scale themselves. React apps start fine, but slowly accumulate performance problems. Poor architectural decisions make it slow. There is nothing inherently wrong with React.

Good architecture can be learned. But it requires a deep understanding of React, data structure mutations, and applying tried-and-true design patterns to component design. The first step is to learn what the [virtual DOM](https://legacy.reactjs.org/docs/faq-internals.html) is and the [reconciliation algorithm](https://legacy.reactjs.org/docs/reconciliation.html).

## The Virtual DOM

The virtual DOM is React’s approach to high-performance DOM changes. The virtual DOM is an un-rendered representation of the previous DOM state. When a change occurs, optimal transformation strategies are performed by comparing the virtual DOM to the DOMs next incoming state.

The comparison process utilizes the reconciliation algorithm. The DOM diffing process of a mounted component is commonly referred to as a rerender. When a component rerenders, its child components (at all levels of nesting) also trigger render cycles. Render cycles are triggered when React-managed data is updated (usually with the [`useState`](https://react.dev/reference/react/useState) hook).

This rendering strategy can create crippling performance issues in large applications. Rerender propagation is an obfuscated process for the untrained eye. When, why, and where rerenders are is lost in the sauce for large applications.

Rerenders are not inherently bad. After all, they are necessary for an application to be responsive. It is when rerenders occur many times and, most importantly, when they are triggered in unnecessary places.

## Leveraging React Developer Tools

Discovering performance woes is easy (fixing them is another story) with the browser extension [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?pli=1). It has a performance profiler that visualizes component render cycles, via flame graph.

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

A button click triggers a render cycle by invoking `setCounter`. Visually, `App` has experienced a DOM update. But reconciliation is diffing more DOM nodes than one might expect.

No `props` are passed down to `Table` and `Row`. It is fundamentally impossible for these components be affected by `App`'s state change. But cascading rerenders to child components is the default behavior. Updating `App` causes reconciliation to trigger in unnecessary locations. This consumes precious resources on the client.

![uncontrolled cascading rerenders](../images/no-memo-rerender.png)

Imagine one state change triggering useless render cycles on hundreds DOM elements. What if something trivial like an `input` did this on every keystroke? This is the silent killer of enterprise software.

There is a de facto solution exists for useless rerender suppression: `React.memo`. It performs a shallow equality check (JavaScript's strict equality operator) on all incoming `props` from the parent component. In the sample code, simply wrapping the child components with it suppresses the useless rerenders.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  // ...
};

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

The flame graph has changed. There are now gray cells. These represent components that did not rerender during a particular render cycle in the app.

![memoed to prevent cascading rerenders](../images/memoed-supressed-rerender.png)

It would be naive to think the performance conversation is over. Any professional developer knows that enterprise software.

this example looks nothing like enterprise software. A full-scale architecture is required to truly optimize enterprise software.

leverage the full power of `React.memo`.
In apps that render thousands of DOM nodes and trigger hundreds of heavy render cycles (possibly thousands) per minute.

## To be continued

With these concepts, typical web apps gain substantial amounts of responsiveness. But there are more performance wins that build on top of mindful component design, resulting in hyper-optimized applications. The following will take performance to a level that most developers have never seen in enterprise software.

- Structuring normalized state trees
- Robust memoization strategies for computed data
- Dispatching optimal state transformations
