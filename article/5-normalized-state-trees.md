# Normalized State Trees


## Introduction

The complexity of modern frontend applications are immense. The way data is structured, managed, transformed, and computed will be the central point of interest. The better the data is designed, the simpler it is to maintain and optimize a React app.The principles of designing backend systems

Design decisions are easier when the application is treated like a server with a thin UI layer on top of it. In a server, data is king and is always treated with respect.

## Normalized State Data

Normalization is imperative for a maintainable SSOT (single source of truth) data model. Do not duplicate stored data. It may be helpful to think of a state tree as a server-side database.

In the same way data (and its normalization) is respected on the backend, similar attitudes should apply to how the frontend manages data.

Duplication becomes less alluring when data is easily accessible. This is commonly done by storing data as records in key-value pairs. This also provides the benefit of O(1) key access. An array of records can be converted using a simple one-liner.

If order matters in a part of an application (that cannot computed), retain an array of `ids`.

```typescript
const normalizedState = {
  docs: {
    1: {
      title: "Performant React",
      id: 1,
      updatedAt: 1668117919710, // 11-10-2022
    },
    2: {
      title: "React Presentation",
      id: 2,
      updatedAt: 1636582015583, // 11-10-2021
    },
  },
  docIds: [1, 2],
};
```

## Derive values instead of storing them

Store minimal information in state and compute the data.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
```

Saving computed values is duplication in disguise. Storing computed values requires permanent maintenance for the lifespan of the app. When the data origin changes, the computed value needs to be updated in conjunction.

Never denormalize a state tree for speculative optimization. Assume an algorithm is fast until proven otherwise. On top of this, algorithms become a vanishing concern when computed values are cached. Powerful, functional, and robust memoization strategies will be covered (in part 3).
