## Seeing State as a Tree

Mutations are easiest to understand when `state` is conceptualized as a tree data structure. Moving forward, a colored node will denote a node that will fail strict equality; either a change in value, reference, or both.

A new state tree is required when updating state. But the word "new" isn't a granular descriptor. Only the root node needs to be replaced in order for it to be defined as a "new tree". Subtree nodes don't have to change reference nor value. The existing nodes just need to be connected to a new root node. Revisit the reducer function in `makeProvider`.

```typescript
const reducer = (state, action) => ({
  ...state,
  ...action(state),
});
```

The spread operator performs a shallow merge. Think of this operation as the creation of a new root node for the state tree.

![localImage](./resources/pt2-fig-1.png)

[fig 1] The root node of the state tree being mutated after `reducer` computation

## Visualizing Resolver Functions

The hardest part about effective selectors is writing optimal resolver functions. It's helpful to think of a resolver function as an entity that "traverses" the state tree to access necessary nodes.

The following is a small, normalized, state tree.

```typescript
export const normalizedState = {
  docs: {
    1: {
      title: "Performant React",
      id: 1,
      updatedAt: 1668117919710,
    },
    2: {
      title: "React Presentation",
      id: 2,
      updatedAt: 1636582015583,
    },
  },
  docIds: [1, 2],
  app: {
    mounting: false,
  },
};
```

A tree representation would look like this

![localImage](./resources/pt2-fig-2.png)

## Traversing the State Tree with Selectors

A selector function's argument is the `state` tree and the return value is a node. To return the `docs` node, the selector would be:

```typescript
const getDocs = (state) => state.docs;
```

`getDocs` traverses the tree (down one level) to select the `docs` node.

![localImage](./resources/pt2-fig-3.png)


## Optimizing State Tree Mutations

State tree mutations matter. If nodes are needlessly changing, selectors cannot work their magic. Painstakingly targeting specific nodes is useless if nodes are needlessly changing.

Copying nodes with unchanged values is a common issue. This algorithm's intent is to update one node's value. But in reality, every node in `docs` updates. A cache miss occurs in every instance of `useGetDocById`. The dev tools profiler confirms this.

```typescript
const updateDate = (newDate, currId) => {
  dispatch((state) => {
    return {
      docs: Object.fromEntries(
        Object.entries(state.docs).map(([id, doc]) => ({
          ...doc,
          date: currId === id ? newDate : doc.date,
        }))
      ),
    };
  });
};
```

![localImage](./resources/pt2-fig-6.png)

### An Optimal Transformation Approach

Transforming the single node is optimal. This transformation strategy targets the minimum number of nodes that require an update.

```typescript
const updateDate = (newDate, currId) => {
  dispatch(({ docs }) => {
    const nextDocs = { ...docs };

    nextDocs[currId] = {
      ...nextDocs[currId],
      date: newDate,
    };

    return {
      docs: nextDocs,
    };
  });
};
```

![localImage](./resources/pt2-fig-7.png)
