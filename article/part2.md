# Make React Fast Again Part 2: Normalized State Trees and the Selector Model

## Introduction

The complexity of modern frontend applications are immense. Design decisions are easier when the application is treated like a server with a thin UI layer on top of it. In a server, data is king and is always treated with respect. 

The way data is structured, managed, transformed, and computed will be the central point of interest. The better the data is designed, the simpler it is to maintain and optimize a React app.

## Normalized State Data

Normalization is imperative for a single source of truth data modal (global state). Do not duplicate stored data. Duplication is becomes less alluring when data easily accessible. This is most commonly done by storing data as records in key-value pairs. This also provides the benefit of O(1) key access. An array of records can be converted using a simple one-liner.

If order matters in a part of an application, store the ids. In an array. This is the minimum information required to track order.

## Derive values instead of storing them

Store minimal information in state and compute the necessary data. Saving computing values is duplication in disguise. Storing computed values requires permanent maintenance for the lifespan of the app. When the data origin changes, the computed value needs to be updated in conjunction.

Assume an algorithm is fast until proven otherwise. Never denormalize a state tree for speculative optimization. Powerful, functional, and robust memoization (covered in part 3) solves virtually all performance issues.

## Selectors: consistent and predictable data computation

The selector pattern is an algorithm design philosophy. It places emphasis on consistent interfaces for algorithms, which is perfect when there is a singular source of data for (almost) all parts of the application.

The benefits are immense:
- They are pure functions
- Easy to test
- Uniform arguments make code easier to reason about
- Algorithms and UI are decoupled
- They are infinitely reusable. Inside other components and other selectors.
- Memoization is easy (discussed later)

## Selectors with only state data

Algorithms that only require state data are easy to write and composable.

## Selectors with extra parameters

Situations will occur when an algorithm needs data from state and other parameters (usually `props`). They are added as a second parameter.

## Selectors used in `applyState`

It is no coincidence that the interface of the selector matches the interface of the HOC of makeProvider, applyState.
