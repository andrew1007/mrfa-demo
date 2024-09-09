# Normalized State Trees

## Introduction

The complexity of modern frontend applications are immense, making data design more important than ever before. As your understanding of optimization matures, data design and management becomes more important than component design. The way data is structured, managed, transformed, and computed will be the central point of interest. React apps are easier to maintain and optimize with a well-designed schema.

## Normalized State Data

Normalization is imperative for a maintainable SSOT (single source of truth) data model. Do not duplicate stored data. In the same way data normalization is respected on the backend, similar attitudes apply to frontend data management. It may be helpful to think of a state tree as a server-side database.

Duplication becomes less alluring when data is designed to be easily accessible. This is commonly done by storing data as records (key-value pairs). This also provides the benefit of O(1) key access. If order matters in a part of an application (that cannot be inferred), retain an array of `ids`.

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

## Ignore data's current use cases

To get an array of documents, this would be computed.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
```

This may seem like useless effort and computational resources if the only use case of this data is rendering a list of documents. For example, this could be stored as an array with no consequence. This is technically true, but multiple use cases inevitably occur as enterprise applications mature. Convenience-oriented data design create future liabilities and headaches. Agnostic design makes future development as painless as possible. Also, a spoiler for the future: normalized state trees unlock a powerful and straightforward memoization framework.

## Derive values instead of storing them

Store minimal information in state and compute the data.

Saving computed values is duplication in disguise. Storing computed values requires permanent maintenance for the lifespan of the app. When the data origin changes, the computed value needs to be updated in conjunction.

Never denormalize a state tree for speculative optimization. Assume an algorithm is fast until proven otherwise. On top of this, algorithms become a vanishing concern when computed values are cached. Powerful, functional, and robust memoization strategies will be covered (in part 3).
