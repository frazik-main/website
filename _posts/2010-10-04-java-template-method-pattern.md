---
layout: post
title: Template Method Design Pattern in Java
date: 2010-10-04 10:00:00 # Replace with actual date
description: An explanation of the Template Method design pattern with a Java example.
tags: design-patterns, java, template-method, oop
categories: java, design-patterns
---

# Template Method Design Pattern in Java

## Introduction

This article introduces the Template Method design pattern, a powerful tool for code reuse and separation of concerns. We'll explore its benefits and demonstrate its implementation with a Java example. The Template Method pattern leverages concrete inheritance effectively, often providing a superior approach to code reuse compared to simple concrete inheritance. While object composition can achieve similar results, the Template Method pattern offers a clean and structured way to accomplish this.

You can find the example Java code in this [repository](https://github.com/yourusername/yourrepo/blob/main/DecorateData.java). _(Replace with actual repository link)_

## Usage

The Template Method pattern addresses a common problem: we know the steps of an algorithm and their order, but some steps' implementations are unknown or irrelevant at the abstract level. The pattern encapsulates these unknown steps as abstract methods within an abstract superclass. Concrete subclasses then implement these abstract methods, filling in the gaps of the superclass algorithm. The superclass controls the algorithm's workflow, while subclasses provide the specific implementations.

This centralized workflow logic exemplifies _inversion of control_. The superclass calls methods defined in its subclasses, a fundamental approach for clean, reusable code.

## Example

This example can be placed in a single file for easy testing.

```java
/**
 * Abstract implementation -- class that controls the workflow.
 * Describes the algorithm for generic object creation.
 */
abstract class CreateObject {

    protected Object[] datas = {"Kimmi", "Zuco", 1, 21};

    public void setData(Object[] data) {
        CreateObject.this.datas = data;
    }

    /**
     * Algorithm controlling the workflow (IOC - Inversion of Control).
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
 */
class JSONObject extends CreateObject {

    protected void objectStart(StringBuilder sb) {
        sb.append("\"Object\":").append("\n{");
    }

    protected void objectEnd(StringBuilder sb) {
        sb.append("\n}");
    }

    protected void stringValue(StringBuilder sb, Object value, int indx) {
        sb.append("prop")
                .append("\"").append(indx).append("\":")
                .append("\"").append(value).append("\",")
                .append("\n");

    }

    protected void numberValue(StringBuilder sb, Object value, int indx) {
        sb.append("prop")
                .append("\"").append(indx).append("\":")
                .append(value).append(",")
                .append("\n");
    }
}

/**
 * Object creation for XML objects.
 */
class XmlObject extends CreateObject {

    protected void objectStart(StringBuilder sb) {
        sb.append("<object>").append("\n");
    }

    protected void objectEnd(StringBuilder sb) {
        sb.append("</object>");
    }

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
        CreateObject xml = new JSONObject();
        System.out.println(xml.decorate());
    }
}
```

**Explanation:**

- Lines 6-32: Define the abstract `CreateObject` class, encapsulating the workflow for creating a string representation of an object.
- Lines 18-32: Implement the core algorithm's workflow using abstract methods (lines 35-42). These abstract methods are implemented by subclasses, demonstrating the Inversion of Control paradigm.
- Lines 49-73: A concrete subclass (`JSONObject`) implements the abstract methods to create a JSON string representation.
- Lines 79-111: Another concrete subclass (`XmlObject`) creates an XML string representation.
- Lines 112-120: Simple testing code.

## Conclusion

The Template Method pattern provides a clean way to separate concerns. You can create a superclass focusing on business logic and workflow, leaving subclasses to handle specific, often lower-level, operations. This approach helps avoid bugs by centralizing complex algorithms while simplifying the code in subclasses. See this [post](http://codingwithpassion.blogspot.com/2010/10/object-oriented-design-patterns-in-java.html) for a comparison with the Strategy pattern.
