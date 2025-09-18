---
layout: post
title: Groovy Memoization with .memoize()
date: 2014-06-13 16:50:00
description: An explanation and example of Groovy's memoize() method for caching closure results to improve performance, particularly in computationally intensive or recursive scenarios.
tags: groovy, memoization, performance, caching, closures, programming
categories: groovy, programming
---

Memoization is a technique that Groovy closures can use to remember the result of their invocation for a specific set of inputs. It achieves this by internally caching the results. This is a common technique to speed up recursive algorithms, often implemented using maps.

Groovy supports memoization through its `.memoize()` method. The first invocation performs the actual computation, while subsequent invocations with the same inputs retrieve the result directly from the cache.

If you run this program, you will see output similar to this:

```text
Test without memoization:
Adding 1 and 3 took 1540 msec with result 4.
Adding 1 and 3 took 1500 msec with result 4.
Adding 1 and 3 took 1501 msec with result 4.
Adding 1 and 3 took 1500 msec with result 4.
Adding 1 and 3 took 1500 msec with result 4.
Test with memoization:
Adding 1 and 3 took 1500 msec with result 4.
Adding 1 and 3 took 0 msec with result 4.
Adding 1 and 3 took 0 msec with result 4.
Adding 1 and 3 took 1 msec with result 4.
Adding 1 and 3 took 0 msec with result 4.
```

As you can see, there is quite a difference between the two tests. It goes without saying that your closures should return the same result for the same parameters to ensure correctness when using memoization.

```groovy
addTwoNumbers = { int a, b ->
    // Simulate some lengthy calculation
    Thread.sleep(1500)
    a + b
}

println("Test without memoization:")
def testItWithoutMemoization(a, b) {
    long start = System.currentTimeMillis()
    long result = addTwoNumbers(a, b)

    println("Adding $a and $b took " +
            "${System.currentTimeMillis() - start} " +
            "msec with result $result.")
}

testItWithoutMemoization(1, 3)
testItWithoutMemoization(1, 3)
testItWithoutMemoization(1, 3)
testItWithoutMemoization(1, 3)
testItWithoutMemoization(1, 3)

addTwoNumbersWithMem = addTwoNumbers.memoize()

println("Test with memoization:")
def testItWithMemoization(a, b) {
    long start = System.currentTimeMillis()
    long result = addTwoNumbersWithMem(a, b)

    println("Adding $a and $b took " +
            "${System.currentTimeMillis() - start} " +
            "msec with result $result.")
}

testItWithMemoization(1, 3)
testItWithMemoization(1, 3)
testItWithMemoization(1, 3)
testItWithMemoization(1, 3)
testItWithMemoization(1, 3)
```
