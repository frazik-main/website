---
layout: post
title: "Java Generics: Understanding Type Erasure and Bridge Methods"
date: 2014-09-06 21:20:00
description: "An in-depth look at how Java implements generics through type erasure, including the steps involved, its compile-time nature, and the role of synthetic bridge methods in preserving polymorphism, illustrated with code examples."
tags: java, generics, type-erasure, bridge-methods, programming, compiler
categories: java-concepts
---

"Generic programming is about abstracting and classifying algorithms and data structures. Its goal is the incremental construction of systematic catalogs of useful, efficient, and abstract algorithms and data structures."
— Alexander Stepanov

Generic programming concepts are nothing new. Java did not introduce them to the world; languages like Ada, Eiffel, and C++ supported generics even before Java did. In 1988, David Musser and Alexander Stepanov introduced and defined this concept.

Java introduced Generics in 2004 with Java 5 and implemented them as **type erasure**. Type erasure consists of the following steps:

- Replace all type parameters in generic types with their bounds, or `Object` if the type parameters are unbounded. The produced bytecode, therefore, contains only ordinary classes, interfaces, and methods.
- Insert type casts if necessary to preserve type safety.
- Generate bridge methods to preserve polymorphism in extended generic types.

From this, you can conclude that generics in Java are purely a compile-time feature. Because of this, generics in Java incur no run-time overhead, which is an important point. It is suspected that they implemented generics as a compile-time correctness feature because of a focus on backward compatibility.

### Demonstrating Type Erasure

Here is a simple demonstration of replacing generic types with their bounds. In this case, the bound is `Object`. While there are better ways to copy an array to a collection (like the `Collections.addAll` method), this example is purely for demonstration purposes.

```java
public static <T> void array2Coll(T[] a, Collection<T> c) {
  for (T o : a) {
    c.add(o);
  }
}
```

After type erasure, the code will look like this:

```java
public static void array2Coll(Object[] a, Collection c) {
  for (Object o : a) {
    c.add(o);
  }
}
```

As you can see, the generic type `T` has been replaced with the `Object` type (its upper bound). If the bound were something else (for example, `<T extends Comparable>`), then the generic type would be replaced by `Comparable`.

### Understanding Bridge Methods

Sometimes the compiler creates a synthetic method, called a bridge method, as part of the type erasure process. The next example will explain why and when the compiler creates these methods.

Consider the following generic class and its subclass:

```java
public class Node<T> {
  private T data;

  public Node(T data) {
    this.data = data;
  }

  public void setData(T data) {
    System.out.println("Node.setData");
    this.data = data;
  }
}

public class MyNode extends Node<Integer> {
  public MyNode(Integer data) {
    super(data);
  }

  public void setData(Integer data) {
    System.out.println("MyNode.setData");
    super.setData(data);
  }
}
```

After type erasure, the compiler will create one synthetic bridge method for the `MyNode` class:

```java
public class Node {
  private Object data;

  public void setData(Object data) {
    System.out.println("Node.setData");
    this.data = data;
  }
}

public class MyNode extends Node {
  public MyNode(Integer data) {
    super(data);
  }

  // synthetic bridge method
  public void setData(Object data) {
    setData((Integer) data);
  }

  public void setData(Integer data) {
    System.out.println("MyNode.setData (Integer)");
    super.setData(data);
  }
}
```

In this example, a bridge method was created because the `MyNode` class was missing a `setData` method that accepts an `Object` parameter, which is required for proper inheritance after type erasure. Without this bridge method, we would not have proper polymorphic behavior, and the following example would throw a `ClassCastException`:

```java
MyNode mn = new MyNode(5);
Node n = mn;
n.setData("Hello"); // This would throw a ClassCastException
```

The bridge method `public void setData(Object data)` ensures that when `n.setData("Hello")` is called, it correctly dispatches to `MyNode`'s specialized `setData(Integer data)` method, after casting, which then fails with `ClassCastException` because "Hello" cannot be cast to `Integer`. This preserves the runtime type safety and polymorphism expected from the generic declaration, even though the underlying bytecode uses `Object`.
