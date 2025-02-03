---
layout: post
title: Strategy Pattern in Java
date: 2010-10-04 10:00:00 # Replace with actual date
description: A comparison of the Strategy pattern with the Template Method pattern in Java, showing differences and providing a code example.
tags: java, design-patterns, strategy-pattern, template-method-pattern
categories: java, design-patterns
---

# Strategy Pattern in Java

The **Strategy** pattern offers an alternative to the [Template Method](http://codingwithpassion.blogspot.com/2010/10/template-method-design-pattern.html) pattern. Unlike the Template Method pattern which uses an abstract class, the Strategy pattern utilizes an interface. For a deeper understanding of encapsulating logic, refer to the post on the [Template Method](http://codingwithpassion.blogspot.com/2010/10/template-method-design-pattern.html) pattern. This example highlights the key differences.

You can download an example of this Java code from [this Google Code repository](https://code.google.com/p/codingwithpassionblog/source/browse/trunk/src/org/codingwithpassion/patterns/strategyMethod/DecorateData.java). _(Note: Google Code is archived; this link may not be functional.)_

## Example

In this case, the class containing the algorithm isn't an abstract superclass but a concrete class using a helper that implements an interface defining individual steps. This pattern is useful when concrete inheritance is needed for other purposes (since Java doesn't support multiple inheritance) or if you prefer this approach over inheriting from an abstract class. Here's an example:

```java
/**
 * Concrete Object implementation.
 * Here we implement workflow.
 */
class CreateObject {

    protected Object[] datas = {"Kimmi", "Zuco", 1, 21};

    public void setData(Object[] data) {
        CreateObject.this.datas = data;
    }

    /**
     * Algorithm that controls flow (IOC - Inversion of Control).
     * @return Object String representation.
     */
    public String decorate(DecoratorHelper helper) {
        StringBuilder sb = new StringBuilder();
        helper.objectStart(sb);

        for (int i = 0; i < datas.length; i++) {
            Object data = datas[i];
            if (data instanceof String) {
                helper.stringValue(sb, data, i);
            } else if (data instanceof Integer) {
                helper.numberValue(sb, data, i);
            }
        }
        helper.objectEnd(sb);
        return sb.toString();
    }
}

/**
 * Helper interface to which we defer individual steps.
 */
interface DecoratorHelper {

    void objectStart(StringBuilder sb);

    void objectEnd(StringBuilder sb);

    void stringValue(StringBuilder sb, Object value, int indx);

    void numberValue(StringBuilder sb, Object value, int indx);
}

/**
 * Object creation for JSON objects.
 */
class JSONObject implements DecoratorHelper {

    public void objectStart(StringBuilder sb) {
        sb.append("\"Object\":").append("\n{");
    }

    public void objectEnd(StringBuilder sb) {
        sb.append("\n}");
    }

    public void stringValue(StringBuilder sb, Object value, int indx) {
        sb.append("prop")
                .append("\"").append(indx).append("\":")
                .append("\"").append(value).append("\",")
                .append("\n");

    }

    public void numberValue(StringBuilder sb, Object value, int indx) {
        sb.append("prop")
                .append("\"").append(indx).append("\":")
                .append(value).append(",")
                .append("\n");
    }
}

/**
 * Object creation for XML objects.
 */
class XmlObject implements DecoratorHelper {

    public void objectStart(StringBuilder sb) {
        sb.append("<Object>").append("\n");
    }

    public void objectEnd(StringBuilder sb) {
        sb.append("</Object>");
    }

    public void stringValue(StringBuilder sb, Object value, int indx) {
        sb.append("<property><key>")
                .append("prop")
                .append(indx)
                .append("</key><string>")
                .append(value)
                .append("</string>")
                .append("</property>")
                .append("\n");
    }

    public void numberValue(StringBuilder sb, Object value, int indx) {
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

/**
 * Testing...
 */
public class DecorateData {

    public static void main(String[] args) {
        CreateObject xml = new CreateObject();

        System.out.println(xml.decorate(new XmlObject()));
    }
}
```

**Explanation:**

- **Lines 37-46:** The template methods are moved into an interface. The definition remains similar to the previous example.
- **Lines 52-76, 82-114:** In the interface implementation, subclassing is no longer necessary. Note that the access modifier of the methods must be `public` because they are accessed from outside the class hierarchy.
- **Line 17:** The interface type must be provided to the template method. This type will be substituted with a concrete class instance at runtime (polymorphism). The method remains the same as in the Template Method example.

## Which to Choose?

The Strategy pattern, while more complex, offers greater flexibility. It represents a trade-off between concrete inheritance and delegation to an interface. The choice depends on factors such as whether the class implementing the steps needs its own inheritance hierarchy, the number of steps involved, and the number of different implementations required.
