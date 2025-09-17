---
layout: post
title: Using XPath in Java
date: 2011-03-24 12:38:00
description: A guide to using XPath for XML document parsing and querying in Java, with practical code examples.
tags: java, xpath, xml, dom, programming
categories: java, xml
---

## Introduction

XPath is supported in Java by default. To use it, you first need to parse the XML document, typically using DOM (though SAX may also be an option). Once the document is parsed, you can obtain an `XPath` instance by calling `XPathFactory.newInstance().newXPath()` and then use its `evaluate` method to execute XPath expressions.

## Code Example

Here is a static method illustrating how to perform an XPath query on an XML file:

```java
public static Object xPathQuery(String expression, File file) {
    Document document;
    DocumentBuilderFactory dBF = DocumentBuilderFactory.newInstance();
    Object result = null;
    try {
        DocumentBuilder builder = dBF.newDocumentBuilder();
        document = builder.parse(file);

        XPath xpath = XPathFactory.newInstance().newXPath();
        XPathExpression expr = xpath.compile(expression);

        result = expr.evaluate(document, XPathConstants.NODESET);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return result;
}
```

This method returns an `Object`. This object can be cast to a `Boolean`, `String`, or (most commonly) a `NodeList`. The specific type depends on the nature of your XPath query.

For example, to extract a `NodeList` from an XPath query that is expected to return multiple nodes, the code would look like this:

```java
NodeList nodes = (NodeList) xPathQuery("//employees", new File("C:/some_xml"));

int j = nodes.getLength();

for (int i = 0; i < j; i++) {
    System.out.println(nodes.item(i).getTextContent());
}
```

## Conclusion

And that's how you use XPath to query XML documents in Java!