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

## Normalization is important

Normalization is priority #1 when designing `state` trees. Denormalized trees tend to make memoization difficult (more on this later). Current use cases of the data should be ignored. Never structure `state` data because it is "convenient".

For example, an array of documents (commonly done in any application) in the normalized tree needs to be computed.

```typescript
const getDocList = (state) => state.docIds.map((id) => state.docs[id]);
```

It is imperative to normalize for the following reasons:

1. It is a future-proof design.
2. Normalization has simple rules, making it easy to learn.
3. It is universally compatible with all data design situations. There are no exceptions.
4. It is easier to traverse the `state` tree. The importance of this will be discussed later.

## Infer Data (via computation) instead of Flags

Flags sometimes breaks normalization. Solving a challenge usings flag can be duplication in disguise. When used, they must be vigilantly maintained over the lifespan of the feature. It is a code smell if a flag's _only_ reason to change is data-related. More likely than not, the flag can be converted into an algorithm to infer its value.

For example, a duplication flag would be zero state rendering with a flag. Updating is directly tied to document data updates and no other conditions.

```tsx
const normalizedState = {
  // ...
  docIds: [1, 2],
  loading: false,
  hasDocuments: false,
};

const ZeroState = () => <>ZeroState</>;

const DocumentList = () => <>DocumentList</>;

const Loader = () => <>Loader</>;

const Documents = (props) => {
  const { hasDocuments, loading, id } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(() => ({
      loading: true,
    }));

    fetchDocs(id).then((docs) => ({
      docs: {}, // ... empty POJO for brevity
      docIds: docs.map(doc => doc.id),
      hasDocuments: docs.length > 0,
      loading: true,
    }));
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return <>{hasDocuments ? <DocumentList /> : <ZeroState />}</>;
};
```

Using `hasDocuments` as a flag breaks normalization and increases the application's complexity. The more robust approach is inferring this, using `loading` and `docIds`.

```typescript
const getHasDocuments = (state) => !state.loading && state.docIds.length > 0
```
