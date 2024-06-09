# Make React Fast Again Part 4: Full Scale Application Analysis

## Introduction

When designed correctly, UI applications can be fast, [SOLID](https://en.wikipedia.org/wiki/SOLID), and scale to any level of complexity.

This is the last step, where I prove that this works as well as I say it does. That it scales in situations where conventional approaches crumple like paper.

A sample application that can be dynamically scaled in complexity will be benchmarked and its various architectural properties will be analyzed to help understand this approach's practicality and effectiveness.

Component Initial Render Performance

There is constant talk about *re*render suppression, because the very first render cycle, the mounting process, is fundamentally impossible to optimize these techniques. There are other tricks in the bag of tools for this (such as virtualization), but there is no structural framework or concrete rules on when to use them.

Despite this, learning these concepts is invaluable, because these performance optimizations still drastically improve the user experience because:

- The initial mounting phase of a component is usually not the only render that occurs during the startup phase of the app. Most applications rerender hundreds of times during initialization.
- THe user responsiveness increases drastically after all of the UI is fully mounted.

Whenever optimization and rerender suppression is discussed, there is always the qualifer of "useless". Because 

Benchmarks

x-axis: slowdown rate
y-axis: render speed

optimized and slow rerender scaling lines on same graph

- mounting + subsequent render cycle speed graph

As you can see from the graphs, mounting is slow and then the UI becomes fast
In the unoptimized application, mounting is slow and continues to be slow.

- keystroke searching
- switching playlists
- toggling play states

- Talk about:

- responsiveness scaling change
- objective comparison of speeds
- 


## Conclusion

UI software design with a completely new lens. With everything said and done, I hope you see things the way I do now.
