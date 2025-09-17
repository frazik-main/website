---
layout: post
title: A Custom Blocking Queue Implementation in Java
date: 2014-05-05 17:14:00
description: Explore a custom implementation of a blocking queue in Java, complete with worker threads and the 'poison pill' termination technique. This article demonstrates fundamental concurrency concepts and serves as a learning exercise compared to using Java's built-in `BlockingQueue`.
tags: java, concurrency, blocking-queue, multithreading, custom-implementation, programming, tutorial
categories: java-programming
---

I found a very interesting and well-implemented blocking queue example. Of course, you can use Java's built-in `BlockingQueue` implementation (refer to the [official Java documentation](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/BlockingQueue.html)), but if you want to learn something new, why not try implementing it yourself?

I've preserved some of the original comments and added a few of my own for clarity. Enjoy the code!

```java
public class BlockingQueueTest {
    private final BlockingQ bq = new BlockingQ();

    /**
     * The Worker thread is not very robust. If a RuntimeException
     * occurs in the run method, the thread will stop.
     */
    private class Worker extends Thread {
        public Worker(String name) {
            super(name);
            start();
        }

        public void run() {
            try {
                // This loop will continue to take the next runnable task from the queue,
                // or it will block on the pop() method if the queue is empty.
                while (!isInterrupted()) {
                    ((Runnable) bq.pop()).run();
                }
                // This will execute when the "poison pill" interrupts the thread.
            } catch (InterruptedException ex) {
                // The thread was interrupted, so we can exit gracefully.
            }
            System.out.println(getName() + " finished");
        }
    }

    public BlockingQueueTest() {
        // We create 10 worker threads.
        Thread[] workers = new Thread[10];
        for (int i = 0; i < workers.length; i++)
            workers[i] = new Worker("Worker Thread " + i);

        // We then push 100 commands onto the queue.
        for (int i = 0; i < 100; i++) {
            final String msg = "Task " + i + " completed";
            bq.push(new Runnable() {
                public void run() {
                    System.out.println(msg);
                    // Sleep a random amount of time, up to 1 second.
                    try {
                        Thread.sleep((long) (Math.random() * 1000));
                    } catch (InterruptedException ex) {
                        Thread.currentThread().interrupt(); // Restore interrupt status
                    }
                }
            });
        }

        // We then push one "poison pill" onto the queue for each
        // worker thread. These pills will only be processed once all
        // other tasks are completed. A poison pill is a task that signals
        // a worker to terminate by interrupting itself.
        for (int i = 0; i < workers.length; i++) {
            bq.push(new Runnable() {
                public void run() {
                    Thread.currentThread().interrupt();
                }
            });
        }

        // Lastly, we join the main thread to each of the Worker threads,
        // so that the main thread only continues once all worker threads
        // have finished their execution.
        for (int i = 0; i < workers.length; i++) {
            try {
                workers[i].join();
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt(); // Restore interrupt status
            }
        }
        System.out.println("BlockingQueueTest finished");
    }

    public static void main(String[] args) {
        new BlockingQueueTest();
    }
}

class BlockingQ {
    /**
     * It makes logical sense to use a linked list for a FIFO queue,
     * although an ArrayList is usually more efficient for a short
     * queue (on most VMs).
     */
    private final java.util.LinkedList queue = new java.util.LinkedList();

    /**
     * This method pushes an object onto the end of the queue and
     * then notifies one of the waiting threads.
     *
     * @param o The object to be added to the queue.
     */
    public void push(Object o) {
        synchronized (queue) {
            queue.add(o);
            // This will notify one blocked thread (waiting on queue.wait() below) to continue.
            queue.notify();
        }
    }

    /**
     * The pop operation blocks until either an object is returned
     * or the thread is interrupted, in which case it throws an
     * InterruptedException.
     *
     * @return The first object in the queue.
     * @throws InterruptedException If the thread is interrupted while waiting.
     */
    public Object pop() throws InterruptedException {
        // The critical section begins here to prevent race conditions.
        synchronized (queue) {
            // Thread will wait if the queue is empty.
            // Using a while loop to guard against spurious wakeups.
            while (queue.isEmpty()) {
                queue.wait();
            }
            return queue.removeFirst();
        }
    }
}
```

This implementation was taken and adapted from: [The Java Specialists' Newsletter - Issue 016](http://www.javaspecialists.eu/archive/Issue016.html)