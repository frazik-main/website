---
layout: post
title: "Design Patterns - Creational: Factory Method and Abstract Factory"
date: 2010-11-04 22:35:00
description: "An introduction to creational design patterns, focusing on the Factory Method and Abstract Factory patterns, with Java examples and a comparison of their usage."
tags: design-patterns, creational-patterns, factory-method, abstract-factory, java, programming
categories: design-patterns
---

## Introduction

Factory design patterns belong to the group of patterns known as "creational." These patterns assist in the instantiation of classes, thereby separating the object creation process from its usage. (While creating new classes isn't exactly like low-level memory allocation for pointers, this analogy highlights the underlying abstraction.) The name "factory" is derived from the concept of a "factory of objects."

Instead of directly using the `new` keyword for object creation, this pattern provides an alternative. With factory patterns, you can choose which concrete class to instantiate at runtime. This also allows you to introduce new classes into your code without modifying the existing base code.

This concept largely boils down to common sense applications of polymorphism. Remember: Always program to an interface, not a concrete class!

I will use the same example to demonstrate both patterns. In this example, we need to decorate a string with special characters. For instance, "decorate me" will become "** decorate me **" by adding two asterisks at both ends. All my examples are kept simple to focus on the core concept and the problem at hand.

## Factory Method

```java
/**
 * Simple example of Factory Method pattern.
 * @author jan.krizan
 */
interface Decorator {

    String doDecorating(String str);
}

class StarDecorator implements Decorator {

    public String doDecorating(String str) {
        return "** " + str + " **";
    }
}

class OtherDecorator implements Decorator {

    public String doDecorating(String str) {
        return "<<|-- " + str + " --|>>";
    }
}

public class Factory {

    public static final int STAR_DECORATOR = 1;
    public static final int OTHER_DECORATOR = 2;

    public static Decorator createSpecificDecorator(int i) {
        if (i == STAR_DECORATOR) {
            return new StarDecorator();
        } else if (i == OTHER_DECORATOR) {
            return new OtherDecorator();
        } else {
            return null;
        }
    }

    public static void main(String[] args) {

        String nonDecoratet = "Please decorate me!";

        Decorator decorator = createSpecificDecorator(STAR_DECORATOR);

        System.out.println(decorator.doDecorating(nonDecoratet));
    }
}
```

The output of this example is: "** Please decorate me! **". Let's break down the code:

- **Lines 5-8:** We first create an interface, `Decorator`.
- **Lines 10-15 and 17-22:** Then, we implement that interface with `StarDecorator` and `OtherDecorator`. As you can see, this is straightforward so far.
- **Lines 29-37:** This section represents the factory that chooses which class to instantiate based on the input parameter.
- The `main` method then tests this functionality.

## Abstract Factory

As its name suggests, the Abstract Factory pattern operates at a higher level of abstraction. In this pattern, even the factory itself is abstract (either an interface or an abstract class), and we choose the specific factory at runtime, not the "working" class directly. This chosen factory then "knows" which classes it needs to instantiate to fulfill the task at hand.

```java
/**
 *
 * Simple example of Abstract Factory pattern.
 * @author jan.krizan
 */
interface DecoratorFactory {

    Decorator createDecorator();
}

class StarDecoratorFactory implements DecoratorFactory {

    public Decorator createDecorator() {
        return new StarDecorator();
    }
}

class OtherDecoratorFactory implements DecoratorFactory {

    public Decorator createDecorator() {
        return new OtherDecorator();
    }
}

interface Decorator {

    String doDecorating(String str);
}

class StarDecorator implements Decorator {

    public String doDecorating(String str) {
        return "** " + str + " **";
    }
}

class OtherDecorator implements Decorator {

    public String doDecorating(String str) {
        return "<<|-- " + str + " --|>>";
    }
}

public class Factory {

    public static final int STAR_DECORATOR = 1;
    public static final int OTHER_DECORATOR = 2;

    public static DecoratorFactory createSpecificDecorator(int i) {
        if (i == STAR_DECORATOR) {
            return new StarDecoratorFactory();
        } else if (i == OTHER_DECORATOR) {
            return new OtherDecoratorFactory();
        } else {
            return null;
        }
    }

    public static void main(String[] args) {

        String nonDecoratet = "Please decorate me!";

        DecoratorFactory decoratorFac = createSpecificDecorator(OTHER_DECORATOR);

        Decorator decorator = decoratorFac.createDecorator();

        System.out.println(decorator.doDecorating(nonDecoratet));
    }
}
```

You'll notice that this code is quite similar to the Factory Method example. However, there are small but important differences:

- **Lines 11-16 and 18-23:** Here, we introduce another layer of abstraction: `DecoratorFactory` and its concrete implementations. While this might seem like unnecessary code for this simple example, it can be beneficial if, for instance, you have more than one method to implement, and you don't want all concrete classes to implement all methods (only a relevant subset). In this way, your concrete classes implement only the methods required for their specific work and can ignore others. You can extend interfaces to achieve this. If this sounds a bit confusing, I recommend searching for more comprehensive examples of the Abstract Factory pattern to see its full potential, for example, [here](http://www.javacamp.org/designPattern/).

Creating class instances and testing are similar processes. The primary difference is the additional step of obtaining the `Decorator` instance through the `createDecorator` method of the `DecoratorFactory`.

While using the Abstract Factory pattern for such a simple example might seem like overkill, my intention is to clearly illustrate the differences between the two patterns.

You can download the code for these two examples from [here](http://code.google.com/p/codingwithpassionblog/source/browse/#svn/trunk/src/org/codingwithpassion/patterns%3Fstate%3Dclosed).

```

```
