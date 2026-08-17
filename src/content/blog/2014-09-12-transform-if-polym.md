---
layout: post
title: "Refactoring Conditional Logic with Polymorphism"
date: 2014-09-12 23:31:00
description: "This post explores refactoring complex conditional statements (like switch or if-else ladders) into a more maintainable and object-oriented polymorphic design, demonstrating how it enhances code readability and extensibility."
tags: polymorphism, refactoring, java, conditional-logic, object-oriented-programming, design-patterns
categories: programming, java-programming
---

While `switch` and consecutive `if-else` statements are not necessarily anti-patterns, you should consider using polymorphism in situations where the conditional logic is complex and lengthy. Sometimes, when you refactor your code in this way, you gain new insights into your data and make your code easier to follow. Polymorphism also offers an advantage when you have the same conditional logic in several places throughout your codebase; introducing a new branch, in the case of polymorphism, simply means adding a new type.

Let's see an example:

```java
public class ConditionalPolymorphism {

    // Smelly approach
    public int carSpeed(String car) {
        if ("Hyundai".equals(car)) {
            return 180;
        } else if ("Mazda".equals(car)) {
            return 160;
        } else if ("Nissan".equals(car)) {
            return 190;
        } else {
            throw new InvalidParameterException(
                    "Parameter not legal: " + car);
        }
    }

    // Polymorphic approach
    public int carSpeed(Car car) {
        return car.speed();
    }

    public static void main(String[] args) {
        ConditionalPolymorphism conditionalPolymorphism =
                new ConditionalPolymorphism();
        System.out.println(
                conditionalPolymorphism.carSpeed("Hyundai"));
        System.out.println(
                conditionalPolymorphism.carSpeed(new Hyundai()));
    }
}

interface Car {
    int speed();
}

class Hyundai implements Car {

    public int speed() {
        return 180;
    }
}

class Mazda implements Car {

    public int speed() {
        return 160;
    }
}

class Nissan implements Car {

    public int speed() {
        return 190;
    }
}
```

This is a fairly simple and naive example, but it demonstrates the basic mechanics behind the approach. Polymorphic code is often more elegant and is written in a more object-oriented manner. Additionally, in this specific example, you can omit the parameter check, which further reduces code complexity.
