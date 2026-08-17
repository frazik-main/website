---
layout: post
title: "Object-Oriented Design Patterns in Java - Template Method"
date: 2010-10-04 23:32:00
description: "An introduction to the Template Method design pattern in Java, illustrating its use for controlling algorithm flow with abstract superclasses and concrete subclasses, including an example for JSON and XML object creation."
tags: java, design-patterns, template-method, oop, inversion-of-control
categories: design-patterns
---

## Introduction

This is the first article about Object-Oriented (OO) design patterns, and we will begin with one of the most useful: the **Template Method** pattern. The Template Method (GoF - Gang Of Four) presents a good example of using concrete inheritance effectively.

In my opinion, using inheritance in this way is far more productive than solely relying on concrete inheritance for code reuse. While object composition can often achieve similar results, the Template Method pattern offers a distinct advantage for defining algorithmic skeletons. Nevertheless, let's dive into the **Template Method pattern**.

You can download an [example of this Java code from my repository on Google Code](https://code.google.com/p/codingwithpassionblog/source/browse/trunk/src/org/codingwithpassion/patterns/templateMethod/DecorateData.java).

## Usage

This pattern addresses a common problem: we know the steps of an algorithm and their desired execution order, but we don't know (or don't want to specify) how to perform all of the individual steps. The Template Method encapsulates individual steps that are unknown or vary into **abstract methods** within an **abstract superclass**. Concrete subclasses then implement these abstract methods, which represent the individual steps of the algorithm.

In this manner, the abstract superclass controls the overall flow (workflow) of the algorithm, while subclasses merely fill in the specific details. In this example, this centralized workflow logic demonstrates **Inversion of Control (IoC)**. With IoC, the superclass calls methods from its subclass, a fundamental approach for creating lean, clean, and reusable code.

Let's look at an example (this code can be placed in a single file for easy testing, as it contains only one public class):

```java
/**
 * Abstract implementation -- class that control flow.
 * Describe algorithm for generic object creation.
 *
 */
abstract class CreateObject {

    protected Object[] datas = {"Kimmi", "Zuco", 1, 21};

    public void setData(Object[] data) {
        CreateObject.this.datas = data;
    }

    /**
     * Algorithm that control flow (IOC - Inversion of Control).
     * @return Object String representation.
     */
    public String decorate() {
        StringBuilder sb = new StringBuilder();
        objectStart(sb);

        for (int i = 0; i < datas.length; i++) {
            Object data = datas[i];
            if (data instanceof String) {
                stringValue(sb, data, i);
            } else if (data instanceof Integer) {
                numberValue(sb, data, i);
            }
        }
        objectEnd(sb);
        return sb.toString();
    }

    // These methods need to be implemented in subclasses.
    abstract void objectStart(StringBuilder sb);

    abstract void objectEnd(StringBuilder sb);

    abstract void stringValue(StringBuilder sb, Object value, int indx);

    abstract void numberValue(StringBuilder sb, Object value, int indx);

}

/**
 * Object creation for JSON objects.
 *
 */
class JSONObject extends CreateObject {

    @Override
    protected void objectStart(StringBuilder sb) {
        sb.append("\"Object\":").append("\n{");
    }

    @Override
    protected void objectEnd(StringBuilder sb) {
        sb.append("\n}");
    }

    @Override
    protected void stringValue(StringBuilder sb, Object value, int indx) {
        sb.append("\"prop") // Start key quote and "prop"
          .append(indx)     // Append index to key
          .append("\":")    // End key quote and append colon
          .append("\").append(value).append("\",") // Value with quotes and comma
          .append("\n");
    }

    @Override
    protected void numberValue(StringBuilder sb, Object value, int indx) {
        sb.append("\"prop") // Start key quote and "prop"
          .append(indx)     // Append index to key
          .append("\":")    // End key quote and append colon
          .append(value).append(",") // Value without quotes and comma
          .append("\n");
    }
}

/**
 * Object creation for XML objects.
 *
 */
class XmlObject extends CreateObject {

    @Override
    protected void objectStart(StringBuilder sb) {
        sb.append("<object>").append("\n");
    }

    @Override
    protected void objectEnd(StringBuilder sb) {
        sb.append("</Object>");
    }

    @Override
    protected void stringValue(StringBuilder sb, Object value, int indx) {
        sb.append("<property><key>")
          .append("prop")
          .append(indx)
          .append("</key><string>")
          .append(value)
          .append("</string>")
          .append("</property>")
          .append("\n");
    }

    @Override
    protected void numberValue(StringBuilder sb, Object value, int indx) {
        sb.append("<property><key>")
          .append("prop")
          .append(indx)
          .append("</key><number>")
          .append(value)
          .append("</number>")
          .append("</property>")
          .append("\n");
    }

}

public class DecorateData {

    public static void main(String[] args) {
        // Example usage for JSON
        System.out.println("--- JSON Output ---");
        CreateObject json = new JSONObject();
        System.out.println(json.decorate());

        // Example usage for XML
        System.out.println("\n--- XML Output ---");
        CreateObject xml = new XmlObject();
        System.out.println(xml.decorate());
    }

}
```

There's a lot going on here, but don't worry. The main things to understand are as follows:

- **The `CreateObject` abstract class (lines 1-46):** This section declares the abstract class that encapsulates the workflow for creating string representations of objects.
- **The `decorate()` method (lines 19-36):** This method implements the algorithm's workflow. It utilizes abstract methods (lines 39-46) that must be implemented by subclasses, demonstrating the Inversion of Control paradigm.
- **The `JSONObject` implementation (lines 50-78):** This section provides the first concrete implementation, creating a JSON string representation.
- **The `XmlObject` implementation (lines 84-118):** This section does the same, but for an XML object representation.
- **Testing (lines 124-135):** The `main` method shows how to test both implementations.

## Conclusion

Patterns like the Template Method offer a good paradigm for **separation of concerns**. For example, we can create a superclass that concentrates on the business logic and its flow, delegating primitive operations (technical concerns like JPA, servlets, parsing, JDBC, etc.) to subclasses.

It is useful to use the **Template Method pattern** to capture an algorithm in one place, deferring the implementation of simpler, varying steps to subclasses. This approach has the potential to avoid bugs by ensuring tricky operations are handled correctly once in the superclass, thereby simplifying user code in the subclasses.

Please check the [post about the Strategy design pattern](http://codingwithpassion.blogspot.com/2010/10/object-oriented-design-patterns-in-java.html), which is very similar to Template, but uses an interface instead of an abstract class.

```

```
