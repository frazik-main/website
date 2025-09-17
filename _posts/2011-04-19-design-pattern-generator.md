---
layout: post
title: Java Design Patterns - Decorator (Wrapper)
date: 2011-04-19 19:00:00
description: An explanation of the Decorator design pattern in Java, including its definition, implementation examples, and a demonstration of how it adds functionality to objects dynamically.
tags: java, design-patterns, decorator, wrapper, programming, oo
categories: java-design-patterns
---

## Introduction

As "The holy grail of Java OO design book" (GoF - *Elements of Reusable OO Software*) says: "**Decorator** design pattern is intended to add additional responsibility to an object dynamically. This design pattern is also known as **Wrapper**."

In other words, this design pattern enables object inheritance at runtime. It achieves this by using interface inheritance and class composition.

## Implementation

The `java.io` package in Java also uses the **Decorator design pattern**. For example:

```java
File f = new File("d:\\something.txt");
// Here FileInputStream "inherits" File class.
FileInputStream is = new FileInputStream(f);
// Here we add buffering capability to FileInputStream using decorator.
BufferedInputStream bis = new BufferedInputStream(is);
```

It's worth noting that the **Decorator design pattern** can also be used to remove responsibility from an object (though this example will not demonstrate that).

The following code represents a simple implementation of this pattern in Java.

First, an interface that defines our basic "object" functionality. This object will later be decorated (extended).

```java
/**
 * Basic phone that can do only basic ringing.
 */
public interface IPhone {

    void announceCall();

    void announceMessage();

}
```

Next, a decorator interface that extends our basic "object" interface. This demonstrates interface inheritance, moving beyond static class inheritance.

```java
/**
 * Decorator that adds additional functionality to basic Phone.
 */
public interface IPhoneDecorator extends IPhone {

    void vibrate(int milliseconds);

    void flashLED();
}
```

Here's a concrete implementation of our basic "default" object (a straightforward interface implementation).

```java
public class Phone implements IPhone {

    /*
     * This Phone announces calls only by ringing.
     */
    public void announceCall() {
        System.out.println("Ring!");
    }

    /*
     * A Phone announces messages by making some sound.
     */
    public void announceMessage() {
        System.out.println("Make a sound!");
    }
}
```

This concrete decorator implementation handles all operations. It delegates part of the functionality to our "default" object and adds its own additional features. It includes a field named `phone` which represents the "default" object implementation to which tasks will be delegated.

```java
/**
 * Concrete decorator class that adds additional functionality.
 * @author jan.krizan
 */
public class UpgradePhoneDecorator implements IPhoneDecorator {

    private IPhone phone;

    /**
     * Constructor through which the client provides
     * the instance that will be decorated.
     * @param phone
     */
    public UpgradePhoneDecorator(IPhone phone) {
        super();
        this.phone = phone;
    }

    public void vibrate(int milliseconds) {
        System.out.println("Vibrating for " + milliseconds + " milliseconds.");
    }

    public void flashLED() {
        System.out.println("Make a LED flash!");
    }

    public void announceCall() {
        // Delegate basic functionality to Phone class.
        phone.announceCall();
        // Add additional functionality.
        vibrate(1500);
    }

    public void announceMessage() {
        // Delegate basic functionality to Phone class.
        phone.announceMessage();
        // Add additional functionality.
        flashLED();
    }
}
```

Now, let's observe what our basic "default" object can do *before* and *after* it has been decorated. Notice how we provide the `Phone` instance to the decorator's constructor, and by leveraging polymorphism (dynamic binding), we delegate basic tasks back to our "default" object.

```java
public static void main(String[] args) {
        IPhone oldPhone = new Phone();
        System.out.println("What can old phone do!");
        oldPhone.announceCall();
        oldPhone.announceMessage();
        System.out.println();
        IPhoneDecorator decoratedPhone = new UpgradePhoneDecorator(oldPhone);
        System.out.println("What can new phone do!");
        decoratedPhone.announceCall();
        decoratedPhone.announceMessage();
    }
```

Hope you liked this!

Here is the output from running the example (using ANT):

```text
run:
What can old phone do!
Ring!
Make a sound!

What can new phone do!
Ring!
Vibrating for 1500 milliseconds.
Make a sound!
Make a LED flash!
BUILD SUCCESSFUL (total time: 0 seconds)
```