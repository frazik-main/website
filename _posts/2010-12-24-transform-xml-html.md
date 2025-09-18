---
layout: post
title: XSLT Tutorial - Transforming XML to HTML
date: 2010-12-24 15:39:00
description: An introduction to XSLT for XML document transformation, covering core concepts, functional programming influences, and a practical example of transforming weather XML into HTML.
tags: xslt, xml, html, transformation, xpath, programming, functional-programming
categories: xslt-tutorials
---

## Introduction

XSLT stands for Extensible Stylesheet Language for Transformations. As you can see, there is no XML in the name, which is quite strange if you think about it, because XSLT is primarily used for XML document transformation (to transform an input XML document into an output document, which is not necessarily XML). One of the advantages of parsing and handling XML documents with XSLT is that XSLT is a W3C recommendation. This means you have a standard toolset and concepts that are transferable.

Please download the example files from my Google Code repository:

- XSLT: [download](http://codingwithpassionblog.googlecode.com/files/weather.xsl)
- XML example file: [download](http://codingwithpassionblog.googlecode.com/files/weather.xml)

## Concepts

XSLT is based on pattern matching. Most of your stylesheet consists of rules (called **templates**) used to transform XML documents. Each rule specifies, "When you see a part of a document that looks like this (e.g., a specific tag in an XML document), here's how you convert it into something else." XSLT is heavily influenced by the design of _functional programming languages_ (Lisp, Scheme, F#, Haskell, etc.).

You can think of templates as equivalent to functions in functional languages. In XSLT, you do everything with [recursion](http://codingwithpassion.blogspot.com/2010/12/recursion-in-xslt.html), just as in any other functional language.

In order to follow this tutorial, you need to understand what XML is all about. XML is basically a document that holds data and describes the meaning of that data. You can describe data by defining schemas (similar to database schemas).

When we create XML stylesheets, we use two standards: XSLT and XPath. You can refer to my short [XPath tutorial](http://codingwithpassion.blogspot.com/2010/10/xpath-tutorial-for-busy-programmer.html) if you are not familiar with this standard. There is also XQuery, which is more similar to SQL, but we will not use it here.

There are a number of free XSLT processors available (Xalan, Saxon, Microsoft XSLT Processor, Altova XSLT Engine). We will use the Altova XSLT Engine, which is integrated into their XML Spy program.

## Example

This tutorial will demonstrate how to transform an XML file into an HTML file. We will use XML files from the [US National Weather Service](http://www.weather.gov/xml/current_obs/seek.php?state=ak&Find=Find).

They already include XSLT in their XML files, so you need to remove that file name and assign the XSL file we will create here.

We will transform the weather XML file into a rather simple HTML file.

Here's what the XML file looks like (refer to the [XML example file](http://codingwithpassionblog.googlecode.com/files/weather.xml) for the full content):

![Example XML File Structure](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhxozmA7IOAa4XpZBq-H1G4Y7_wQaeFdQwZsT8UizzGWuD7AfRRTrVBSw-R5LQlEY4oon9zw15NAsGpkZm_b2vAMFcuZZiBk9yXL1MXCrM0LbUNplW_hdF0uK85advyC2sKccoAHF9TPoLA/s320/2.GIF)
You can see that this XML file is quite simple, featuring only one root element and a bunch of child elements.

From this XML file, we will create an HTML page that looks like this:

![Example HTML Output](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggMruZmOIfHfY1LCmBRUI9bMdVBbukDXbWlWmAKsCsg-A9HU9PXaKiCXy84KLZjSkmwviWMRvuketDFWrx2QXBS5NAmufzdynYEb2-_Qh666aa5e7jxR_CvYA_Uau5q4ixzZHCnaT_9srQ/s320/1.GIF)
As you can see, the page is also pretty simple, with only a subset of elements shown.

The XSLT file for this transformation looks like this (refer to the [XSLT file](http://codingwithpassionblog.googlecode.com/files/weather.xsl) for the full content):

![Example XSLT Code Structure](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-JcNhchgA3qwz2hjYgV7I0LBQ9FA_KZJEJqaxT9tGV6f_Ql8fnjESR_N2k402nh8AH2ft_0DD3cAfJgnCcPAw59Wg_du_2Fp7n6GVlIrVpEsmpFiDmFbjHuTTB_mTckiMWeE6BbzNKu_1/s320/3.GIF)
As you can see, we are using XSLT 1.0 for browser compatibility reasons.

### Line-by-Line Review:

- **Lines 4-6:** We match the root of the element and then apply templates for all other child elements.
- **Lines 8-17:** Create the HTML `<head>` element and fill it with some styles.
- **Line 18:** Start filling the `<body>` element.
- **Lines 20 and 24:** Set some `<div>`s (not important for core logic).
- **Line 21:** Construct an `<img>` element by combining two elements from the XML.
- **Line 25:** We will not show all elements; we are interested only in `"location"`, `"observation_time"`, `"pressure_string"`, and `"wind_string"`.
- **Lines 30-34:** For the temperature element, we will use a special template.
- **Lines 35-37:** For all other elements, we will use the same template. In this template, we use another template for extracting sensible names from XML element tag names (as they are mostly acceptable).
- **Lines 38-52:** If an element's tag name contains the string `"string"`, then we will remove it. If an element's tag name contains only the `_` character, then replace that character with a space `' '`. If this is not the case, then simply return the tag name. In this way, we can use a single template for processing all elements.

Okay, that's it! Let's move on to another tutorial...

```

```
