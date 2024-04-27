# Make React Fast Again Part 3: State tree mutations and algorithm memoization

## Introduction

In part 2, it may have seemed strange that selector functions, regardless of complexity, were decoupled from `useSelector`. This is for two reasons:

1. Pure functions are dead-easy to test
2. Memoization is easier to implement

Memoizing operations in data structures in (essentially) is the last piece of the puzzle for highly optimized applications that are fast and maintainable. But memoizing operations that are derived from (essentially) a mini database requires an intuitive understanding of how the state tree changes as data is mutated, added, and removed from it.