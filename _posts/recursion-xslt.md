---
layout: post
title: Recursion in XSLT
date: 2010-12-16 14:43:00
description: A guide to using recursion in XSLT for XML document processing, covering templates, XPath, and an example of transforming F1 season data.
tags: xslt, recursion, xml, xpath, functional-programming, templates
categories: xslt-concepts, programming-techniques
---

## Introduction

I like recursion! It is pure and formal. When you solve problems using recursion, your code looks cleaner, leaner, and more concise! However, the problem with recursion is that it can be hard to visualize. While you can easily imagine how a `for` loop works, when solving complex artificial intelligence algorithms using trees (like min-max algorithms), recursion can become quite complex and error-prone. I prefer to use recursion only when it provides a substantially more elegant solution than other methods, and when the recursive flow can be made as easy to follow as possible (e.g., by refactoring it into a dedicated method).

This is all well and good, but in XSLT (as in any functional language), we are often compelled to use recursion in situations where we need to create custom functions (templates) that are not part of the XSLT 1.0 or 2.0 specifications. Furthermore, recursion is a natural way to traverse XML (or any other tree-like structured document) in XSLT.

To work effectively with recursion in XSLT, you need to be familiar with a couple of key concepts. First are, of course, *templates*. Templates are analogous (or at least similar) to functions in functional languages (e.g., Scheme, LISP, F#). They can have parameters and variables. Variables in XSLT are immutable; their state cannot be changed after the initial value assignment. For example, the `String` object in Java is also immutable. Templates can call themselves for recursive operations. There are no traditional loops in XSLT (don't try to find them). While `xsl:for-each` exists, it behaves differently than loops in imperative languages.

The second crucial concept is [XPath](http://codingwithpassion.blogspot.com/2010/10/xpath-tutorial-for-busy-programmer.html). **XPath** is a syntax used to describe parts of an XML document. XPath is designed to be used within an attribute in an XML document. Its syntax is a blend of basic programming language expressions and *Unix-like* path expressions.

## Example

To demonstrate how to process an XML document using XSLT and recursion, we will use an example XML document. This document provides an overview of the F1 2010 season for four races. It includes the name of the Grand Prix (race), race date, winning driver's name, winning team's name, number of laps, and winning time.

```xml
<season>
 <race>
  <name>Bahrain</name>
  <date>14/03/2010</date>
  <winnigdriver>Fernando Alonso</winnigdriver>
  <team>Ferrari</team>
  <laps>49</laps>
  <time>1:39:20.396</time>
 </race>
 <race>
  <name>Australia</name>
  <date>28/03/2010</date>
  <winnigdriver>Jenson Button</winnigdriver>
  <team>McLaren-Mercedes</team>
  <laps>58</laps>
  <time>1:33:36.531</time>
 </race>
 <race>
  <name>Malaysia</name>
  <date>04/04/2010</date>
  <winnigdriver>Sebastian Vettel</winnigdriver>
  <team>RBR-Renault</team>
  <laps>56</laps>
  <time>1:33:48.412</time>
 </race>
 <race>
  <name>China</name>
  <date>18/04/2010</date>
  <winnigdriver>Jenson Button</winnigdriver>
  <team>McLaren-Mercedes</team>
  <laps>56</laps>
  <time>1:46:42.163</time>
 </race>
</season>
```

We will transform this XML document into a different structure. The requirement is to combine data from elements with the same name into a single XML element, separated by commas. While this might seem like an unusual request, it's designed specifically to illustrate how recursion is used in XSLT.

Example of transformed XML:

```xml
<seasonraces>
 <allnames>Bahrain, Australia, Malaysia, China</allnames>
 <alldates>14/03/2010, 28/03/2010, 04/04/2010, 18/04/2010</alldates>
 ...
 <alltimes>1:39:20.396, 1:33:36.531, 1:33:48.412, 1:46:42.163</alltimes>
</seasonraces>
```

## Solution

You can download the full XSLT file from [my Google Code repository](http://codingwithpassionblog.googlecode.com/files/season-teams.xsl). Below is an image of the XSLT solution:

![XSLT Recursion Solution](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9zzYtICaIrn2bTIe6VM0S1IJPChqu8FzJ23wDmROLIRJ368haFBWlGFkjiy-UgJNWtJOcX2gaCYZMb_siBjYMC-1nThSyNBIIdiVtaMpeKeo2gubddurHhNZOpWmdJsMW9YL6H4SaCQpf/s1600/2.GIF)

The recursion starts at line 34. Here, we create a template with two parameters. The first parameter is a sequence (in XPath 2.0) or node-set (in XPath 1.0) of values that will be traversed and concatenated with a delimiter. The second parameter is the resulting string, which is printed at the end of the template (line 48) (at the conclusion of the recursion).

Line 38 checks if the recursion should stop. It terminates if there are no values left (or if there were no values initially) in the sequence. If the sequence is not empty, we proceed with recursion and call the template (line 40) again with the following parameters:

*   Line 41: The rest of the values in the sequence (everything after the first item, i.e., `position() > 1`).
*   Line 42: Concatenate the first value from the sequence into the resulting string (we handle the first value differently).

Finished!