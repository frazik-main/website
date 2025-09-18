---
layout: post
title: "Effective Java - The Builder Pattern"
date: 2013-05-19 10:38:00
description: "Explore the Builder Pattern as an elegant solution for handling a large number of optional parameters in constructors, addressing limitations of telescopic constructors and JavaBeans."
tags: java, builder-pattern, design-patterns, effective-java, programming
categories: java-programming, design-patterns
---

Static factories and constructors share a limitation: they do not scale well to a large number of optional parameters.

Consider the case of a computer configuration builder. Some parts are essential in this build, while others are optional.

There are a number of ways that developers usually try to approach this problem. The first is **telescopic constructors**, where you need to create a constructor for each set of optional parameters. This approach has obvious disadvantages (ugly code, a lot of work). The second approach is to use **JavaBeans**, in which you call a parameterless constructor to create the object and then call setter methods to set each required and optional parameter. There are two problems with this approach:

1.  A JavaBean may be in an inconsistent state partway through its construction.
2.  This pattern precludes the possibility of making a class immutable.

However, there is a third approach that is very elegant and can create immutable objects. It is a form of the Builder pattern. Instead of making the desired object directly, the client calls a constructor (or static factory) with all the required parameters and gets a builder object. Here is what it looks like:

```java
public class ComputerConfigurator {
    private final int sizeOfRam;
    private final int sizeOfHdd;
    private final int processorSpeed;
    private final int dedicatedGpuSpeed;
    private final boolean waterCooling;

    public static class Builder {
        // Required params
        private final int sizeOfRam;
        private final int sizeOfHdd;
        private final int processorSpeed;
        // Optional params
        private int dedicatedGpuSpeed;
        private boolean waterCooling;

        public Builder(int sizeOfRam, int sizeOfHdd, int processorSpeed) {
            this.sizeOfRam = sizeOfRam;
            this.sizeOfHdd = sizeOfHdd;
            this.processorSpeed = processorSpeed;
        }

        public Builder dedicatedGpuSpeed(int val) {
            dedicatedGpuSpeed = val;
            return this;
        }

        public Builder waterCooling(boolean val) {
            waterCooling = val;
            return this;
        }

        public ComputerConfigurator build() {
            return new ComputerConfigurator(this);
        }
    }

    private ComputerConfigurator(Builder builder) {
        sizeOfRam = builder.sizeOfRam;
        sizeOfHdd = builder.sizeOfHdd;
        processorSpeed = builder.processorSpeed;
        dedicatedGpuSpeed = builder.dedicatedGpuSpeed;
        waterCooling = builder.waterCooling;
    }
}
```

The builder's setter methods return the builder itself, allowing invocations to be chained. Here's how the client code looks:

```java
public class Main {

  public static void main(String[] args) {
    ComputerConfigurator firstComputerConfigurator = new ComputerConfigurator.
            Builder(2, 40, 3000).
            dedicatedGpuSpeed(1000).build();

    ComputerConfigurator secondComputerConfigurator = new ComputerConfigurator.
            Builder(2, 40, 3000).
            dedicatedGpuSpeed(1000).waterCooling(true).build();
  }
}
```
