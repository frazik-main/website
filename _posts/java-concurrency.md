```
---
layout: post
title: Java Concurrency Strategies
date: 2012-08-13 16:26:00
description: Exploring various concurrent programming strategies in Java, including single-threaded, simple multi-threaded, thread pooling, and the Future and Callable mechanisms, along with a performance comparison.
tags: java, concurrency, multithreading, threads, programming
categories: java-concepts, programming
---

## Introduction

A thread is similar to a lightweight OS process, except that it can access shared memory. Every thread has its own memory cache. Java runs in its own process, and threads in Java run within this process. Java has native support for multithreaded programming, which is one of many reasons why Java currently holds its status as one of the best overall programming languages.

Multithreaded programming is about speed and handling deadlocks (due to concurrent access) and safety issues (such as incorrect data resulting from threads reading old or inconsistent data).

Java provides several locking mechanisms that enforce exclusivity (ensuring only one thread accesses certain parts of the code at a time).

Let's explore some strategies for concurrent programming in Java.

First, we need a sufficiently long task to demonstrate performance differences across strategies. For this purpose, I created a `FibonaciCalculator` that generates an array of Fibonacci numbers. Generating a Fibonacci array is not inherently a CPU-intensive task, so I added `Thread.sleep` between iterations to simulate a longer workload.

```java
public class FibonaciCalculator {

    public static final int LONG_TASK_SIMULATED_DELAY = 150;

    public static int calculateFibonaciNumber(int n) {
        int previous = 0;
        int result = 1;
        for (int i = 0; i <= n; i++) {
            simulateCostlyTask();
            int sum = result + previous;
            previous = result;
            result = sum;
        }
        return result;
    }

    private static void simulateCostlyTask() {
        try {
            Thread.sleep(LONG_TASK_SIMULATED_DELAY);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
```

## Single-threaded Strategy

First, we'll examine a simple single-threaded model. This is a standard non-recursive implementation of the Fibonacci number algorithm in Java.

```java
public class SingleThreadedFibonaciArrayConstructor extends FibonaciArrayConstructor{

    protected int[] constructFibonaciNumbersArray(int size) {
        int[] fibonaciNumbers = new int[size];
        for (int i = 0; i < fibonaciNumbers.length; i++) {
            fibonaciNumbers[i] = FibonaciCalculator.calculateFibonaciNumber(i);
        }
        return fibonaciNumbers;
    }

}
```

## Simple Multi-threaded Strategy

Our second strategy is a simple, brute-force multi-threaded implementation. In this example, we will use the fundamental concurrency mechanisms in Java: `java.lang.Thread`. We will implement the `Runnable` interface and create a new thread for each `Runnable` instance (in our case, for each Fibonacci number calculation in the array). Since each thread accesses the `currentIndex` field, we need to synchronize its modification (incrementation) and retrieval. To achieve this, we use the `synchronized` keyword. Synchronization is the simplest way to lock a certain part of code. This keyword ensures that only a single thread can access the marked section of code.

```java
public class SimpleMultiThreadedFibonaciArrayConstructor extends FibonaciArrayConstructor{

    private int[] fibonaciNumbers;
    private int currentIndex = 0;

    protected int[] constructFibonaciNumbersArray(int size) {
        fibonaciNumbers = new int[size];

        List<Thread> threads = new ArrayList<Thread>();

        for (int i = 0; i < size; i++) {
            Runnable task = new MyRunnable();
            Thread worker = new Thread(task);
            worker.setName(String.valueOf(i));
            worker.start();
            threads.add(worker);
        }

        int running;
        do {
            running = 0;
            for (Thread thread : threads) {
                if (thread.isAlive()) {
                    running ++;
                }
            }
        } while (running > 0);


        return fibonaciNumbers;
    }

    private synchronized int getNextIndex() {
        return currentIndex++;
    }

    private class MyRunnable implements Runnable {

        public void run(){
            int nextIndex = getNextIndex();
            int calculatedFibonaci = FibonaciCalculator.calculateFibonaciNumber(nextIndex);
            fibonaciNumbers[nextIndex] = calculatedFibonaci;
        }

    }
}
```

## Thread Pool Strategy

In the previous example, we used a maximum number of threads (equal to the array size) for calculating the Fibonacci array. This approach can have disadvantages, as it may cause performance overhead due to creating and switching between numerous threads. The `java.util.concurrent` package offers improved support for concurrent programming. When using this package, we create a pool of worker threads. A thread pool contains a work queue that holds tasks waiting to be executed. This thread pool can be described as a collection of `Runnable` tasks (the work queue) and a collection of running threads. These threads are constantly running and check the work queue for new tasks. If new work is available, they execute the `Runnable`. The `Executor` framework itself provides methods, such as `execute(Runnable r)`, to add `Runnable` tasks to the work queue. The `Executor` framework provides example implementations of the `java.util.concurrent.Executor` interface, such as `Executors.newFixedThreadPool(int n)`, which creates `n` worker threads.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadPooledMultiThreadedFibonaciArrayConstructor extends FibonaciArrayConstructor {

    private int[] fibonaciNumbers;
    private AtomicInteger currentIndex = new AtomicInteger(0);

    protected int[] constructFibonaciNumbersArray(int size) {
        fibonaciNumbers = new int[size];

        ExecutorService executor = Executors.newFixedThreadPool(5);

        for (int i = 0; i < size; i++) {
            Runnable worker = new MyRunnable();
            executor.execute(worker);
        }

        executor.shutdown();

        while (!executor.isTerminated()) {
            // Wait for all tasks to complete
        }

        return fibonaciNumbers;
    }

    private class MyRunnable implements Runnable {

        public void run(){
            int nextIndex = currentIndex.getAndAdd(1);
            int calculatedFibonaci = FibonaciCalculator.calculateFibonaciNumber(nextIndex);
            fibonaciNumbers[nextIndex] = calculatedFibonaci;
        }

    }
}
```

Note that we are no longer using a synchronized method; instead, we are using the `AtomicInteger` type. This is part of Java's non-blocking algorithm support, which is based on low-level atomic hardware primitives. The `getAndAdd(1)` method retrieves the current value and increments it by one as a single, atomic operation, eliminating the need for explicit synchronization and the danger of dirty reads or deadlocks.

## Future and Callables Strategy

If you expect your threads to return a computed result, you can use `java.util.concurrent.Callable`. `Callable` tasks allow values to be returned after completion. If you submit a `Callable` to an `Executor`, the framework returns a `java.util.concurrent.Future`. This `Future` can be used to check the status of a `Callable` and to retrieve its result.

In both previous examples, we were compelled to use mechanisms like non-blocking algorithm support (`AtomicInteger`) or method synchronization due to the shared `currentIndex` variable. Threads also share the Fibonacci array, but there are no synchronization issues with it as each thread writes to a unique index. Wouldn't it be better if we could remove the dependency on this `currentIndex` variable? Yes, of course it would. We can achieve this by creating defensive copies for our thread execution algorithm.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FeaturesAndCallablesMultiThreadedFibonaciArrayConstructor extends FibonaciArrayConstructor{

    protected int[] constructFibonaciNumbersArray(int size) {

        int[] fibonaciNumbers = new int[size];

        ExecutorService executor = Executors.newFixedThreadPool(5);
        List<Future<Integer>> list = new ArrayList<Future<Integer>>();

        for (int i = 0; i < size; i++) {
            Callable<Integer> worker = new MyCallable(i);
            Future<Integer> submit = executor.submit(worker);
            list.add(submit);
        }

        for (int i = 0; i < list.size(); i++) {
            try {
                Future<Integer> future = list.get(i);
                int futureResult = future.get();
                fibonaciNumbers[i] = futureResult;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        executor.shutdown();

        return fibonaciNumbers;
    }

    private class MyCallable implements Callable<Integer> {

        int currentIndex;

        public MyCallable(int currentIndex) {
            this.currentIndex = currentIndex;
        }

        public Integer call() throws Exception {
            return FibonaciCalculator.calculateFibonaciNumber(currentIndex);
        }
    }
}
```

## Testing and Conclusion

### Test Result Summary:

*   **SingleThreadedFibonaciArrayConstructor:** 48 seconds (1 thread)
*   **SimpleMultiThreadedFibonaciArrayConstructor:** 3 seconds (25 threads)
*   **ThreadPooledMultiThreadedFibonaciArrayConstructor:** 11 seconds (5 threads)
*   **FeaturesAndCallablesMultiThreadedFibonaciArrayConstructor:** 11 seconds (5 threads)

When running all these implementations through tests, we observed the following results. Naturally, it can be seen that more threads generally lead to faster execution. In the third and fourth implementations, we used 5 threads, as opposed to the second implementation where we used 25 threads.

### Java 7 Fork-Join Mechanism

Java 7 introduced a new parallel mechanism for compute-intensive tasks: the Fork/Join Framework. The Fork/Join Framework allows you to distribute a given task among several workers and then wait for the results. However, as I haven't installed Java 7 yet (and many others haven't), it will not be described in this post.

The complete implementation (with tests) can be found [here](http://codingwithpassionblog.googlecode.com/files/java-concurrency.zip).
```