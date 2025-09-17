---
layout: post
title: Groovy and Java - Closures and Dynamic Programming
date: 2011-09-27 22:16:00
description: This post explores key differences between Groovy and Java, focusing on Groovy's closures and its dynamic programming capabilities, with practical code examples.
tags: groovy, java, closures, dynamic-programming, programming
categories: groovy-concepts
---

This post continues our discussion on the differences between Groovy and Java. In this part, we will delve into two more important concepts that distinguish Groovy from Java: **closures** and Groovy's **dynamic nature**.

## Closures

Closures are a concept you'll encounter in many functional languages (e.g., Scheme, LISP, and even JavaScript). In functional programming, everything can be treated as a function. This allows you to pass functions as arguments to other functions, or assign them names for later reference and reuse.

You might ask, why would you want to do this? Consider the [Template Method design pattern](http://codingwithpassion.blogspot.com/2010/10/template-method-design-pattern.html). This pattern allows you to defer the implementation details of certain steps to subclasses, dynamically choosing the most suitable implementation at runtime. You are essentially "injecting" code into another piece of code. This is precisely what closures facilitate: they "capture" a block of code, which can then be reused in various contexts. This might sound a bit confusing, so let's look at how Groovy implements it:

You are likely familiar with the `sort()` method in Java. Here’s an example demonstrating how to sort a list in both Java and Groovy:

```groovy
// We will define some list.
List cars = ["Skoda", "Honda", "Toyota", "Audi"]

// This is how Groovy sorts this list.
// The block of code within the curly braces passed to the `sort` function is a closure.
// It effectively inserts custom sorting logic (in this example, a.compareTo(b))
// directly into the `sort` method. Closures encapsulate code.
// 'a' and 'b' are the arguments to the closure, and the part after '->' is the closure's body.
cars.sort {String a, String b -> a.compareTo(b) }

println cars
// [Audi, Honda, Skoda, Toyota]
```

```java
// In Java, you must implement the Comparator interface and override its compare method.
// This is typically done using anonymous inner classes, which should be familiar to Java developers.
List<String> carsJava = new ArrayList<>(Arrays.asList("Skoda", "Honda", "Toyota", "Audi"));
Collections.sort(carsJava, new Comparator<String>() {
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});

System.out.println(carsJava);
// [Audi, Honda, Skoda, Toyota]
```

```groovy
// Another common use of closures in Groovy is with the `.each` method,
// which iterates through elements in lists, maps, and other collections.
// If a closure takes only one argument, it can omit the explicit argument
// declaration and implicitly refer to the current element as the special variable "it".
int sum = 0
[2, 3, 4].each { sum += it }
println sum
// 9
```

In Groovy, you can also assign a closure to a variable and then pass it around, much like functions in functional languages.

```groovy
Closure comparator = {Integer a, Integer b ->
    a.compareTo(b)
}
// Passing a closure to a method looks like a normal method call.
[7, 1, 6, 7].sort(comparator)
// [1, 6, 7, 7]
```

Closures are effectively anonymous functions, but with enhanced capabilities.

## Dynamic Programming

In Java, all variables, properties, method arguments, and method return types must have declared types. While true dynamic behavior can be achieved through reflection, it's often not the most elegant approach.

Groovy addresses this issue by bringing dynamic behavior into the Java ecosystem. But what exactly does this "dynamic" aspect entail?

Imagine you have a `Person` class with properties like `firstName` and `lastName`. You can easily sort a list of `Person` objects using the following Java code:

```java
// This is the standard Java approach for sorting, by implementing Comparator...
public void sortPeopleByGivenName(List<Person> personList) {
    Collections.sort(personList, new Comparator<Person>() {
        public int compare(Person p1, Person p2) {
            return p1.getFirstName().compareTo(p2.getFirstName());
        }
    });
}
```

But what if the property to be used for sorting isn't known until runtime? You could attempt some reflection magic, but that often leads to less readable and maintainable code. Alternatively, you could use a series of `if-else` statements, but this quickly becomes cumbersome if your domain class has, say, 20 properties.

This is where Groovy's dynamism shines. You can define the property to be sorted by as a `String`, which will then be resolved to a concrete property at runtime. This concept is known as **dynamic dispatch**, meaning Groovy will "find" the appropriate property at runtime (similar to how dynamic binding resolves methods at runtime).

For example, consider the following Groovy code:

```groovy
// Accessing a property by its string name.
// This is a core feature of dynamic languages, where properties and methods are
// resolved at runtime (often referred to as Duck Typing).
def sortPeople(people, property) {
    people.sort { p1, p2 ->
        p1."${property}" <=> p2."${property}"
    }
}
```

Groovy uses the `def` keyword to declare **untyped** methods and variables. It's important to note, however, that Groovy also supports declared types (a benefit of its Java heritage). This flexibility, combined with its Java compatibility, is one of Groovy's main strengths.