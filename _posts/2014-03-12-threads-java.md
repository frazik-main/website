---
layout: post
title: How to Create Threads in Java
date: 2014-03-12 09:08:00
description: Explore two common methods for creating new threads in Java: implementing the Runnable interface or extending the Thread class and overriding its run() method.
tags: java, threads, concurrency, programming
categories: java-programming
---

There are two primary ways to create new threads in Java. The first, and more common, approach is to implement the `Runnable` interface. If you examine the `Thread` class's source code, you'll see that a `Thread` essentially calls the `run()` method on a `Runnable` object. The second method, which can be simpler in some cases, involves extending the `Thread` class directly and overriding its `run()` method.

## Using Runnable

When using the `Runnable` interface, you typically create an anonymous inner class (or a separate class) that implements `Runnable`, and then pass an instance of it to the `Thread` constructor.

```java
Thread secondMethod = new Thread(new Runnable() {
    int index = 0;
    @Override
    public void run() {
        try {
            while (index < 100) {
                int interval = (int) ((Math.random() * 500) + 500);
                Thread.sleep(interval);
                System.out.print("*");
                index++;
            }
        } catch (InterruptedException exc) {
            // Thread was interrupted; handle gracefully if needed.
        }
    }
});
```

## Without Runnable (Extending Thread)

Alternatively, you can create a new thread by extending the `Thread` class itself and overriding its `run()` method. This approach can be more concise for simple thread implementations.

```java
Thread firstMethod = new Thread() {
    int index = 0;
    @Override
    public void run() {
        try {
            while (index < 100) {
                int interval = (int) ((Math.random() * 500) + 500);
                sleep(interval); // 'sleep' can be called directly as this is a Thread instance
                System.out.print(".");
                index++;
            }
        } catch (InterruptedException exc) {
            // Thread was interrupted; handle gracefully if needed.
        }
    }
};
```
