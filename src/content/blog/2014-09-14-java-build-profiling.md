---
layout: post
title: "Java Profiling - Built-in Tools"
date: 2014-09-14 15:15:00
description: "An introduction to Java profiling, covering common performance issues and essential built-in JDK tools like jmap, jstack, jconsole, and VisualVM, along with mentions of specialized profilers."
tags: java, profiling, jvm, performance, debugging, jmap, jstack, jconsole, visualvm, memory-leaks, deadlocks
categories: java-performance, programming-tools
---

Java profiling is a very useful technique for finding performance bottlenecks and/or solving complete system failures. Common bugs that can occur in Java systems of any size include slow services, JVM crashes, hangs, deadlocks, frequent JVM pauses, sudden or persistent high CPU usage, or even the dreaded OutOfMemoryError (OOME).

Finding these kinds of bugs is like an art and requires a lot of experience to master. That's why some programmers specialize in Java profiling. In some cases, finding a bug is impossible if you don't understand how the system works. Every Java programmer should know at least the basic profiling tools, because you can't always pay an external specialist to fix memory leaks or deadlocks for you.

Java comes with built-in tools for profiling and monitoring. Some of these tools are:

## jmap

This is an internal Java tool and not a profiling tool as such, but it is very useful. Oracle describes `jmap` as an application that “prints shared object memory maps or heap memory details of a given process or core file or remote debug server.” And it is exactly that. Its most useful option is to print a memory histogram report. The resulting report shows a row for each class type currently on the heap, with its count of allocated instances and total bytes consumed. Using this report, you can easily identify memory leaks if you have any.

## jstack

`jstack` is also not a profiling tool, but it can help you identify thread deadlocks. The output of `jstack` is very useful for debugging. It shows how many deadlocks exist in this JVM process and provides stack traces of waiting threads with source code line numbers, if source codes were compiled with debug options.

## jconsole

`JConsole` is a graphical monitoring tool used to monitor Java Virtual Machine (JVM) and Java applications, both on a local or remote machine. It is used for monitoring, not profiling, so you are better off using `VisualVM`, described below.

## VisualVM

Another tool currently built into the JVM is `VisualVM`, described by its creators as “a visual tool integrating several command-line JDK tools and lightweight profiling capabilities.” This tool can generate a memory graph that will show you how your application is consuming memory over time. `VisualVM` also provides a _sampler_ and a lightweight _profiler_. The sampler lets you periodically sample your application for CPU and memory usage. It's possible to get statistics similar to those available through `jmap`, with the additional capability to sample your method calls' CPU usage. The `VisualVM` Profiler will give you the same information as the sampler but, rather than sampling your application for information at regular intervals, it works by instrumenting the application to collect data.

For me, these built-in tools work quite well, but if you want more specialized and powerful tools for profiling, you can check out: **BTrace**, **EurekaJ**, and **Eclipse Memory Analyzer (MAT)**.
