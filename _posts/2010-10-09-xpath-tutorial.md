---
layout: post
title: XPath - Navigating and Querying XML Documents
date: 2010-10-09 19:54:00
description: An introduction to XPath, explaining how to navigate and query XML documents using path expressions, predicates, and relative node selections.
tags: xpath, xml, navigation, querying, programming
categories: xml-concepts
---

## Introduction

As the W3C standard states: *XPath is a language for addressing parts of an XML document*. That's simple enough. XPath is basically a means to traverse an XML document and perform searches on it. We can use the structure of the XML document (semantics of the data) or the data itself to perform these searches. XPath can be used in XML transformations (XSLT) and in SOA (BPEL language). jQuery also uses similar logic for its selector search operations.

## XML Document

XPath can query any part of an XML document (any node at any level). XML documents are treated as trees of nodes. As a result of a search, XPath may return `null`, a string, a number, or another XML node (which can also be queried). XPath is used to navigate through elements or attributes of an XML document.

We will use the following XML document for our examples:

```xml
<game-systems>
  <system>
    <type>Arcade</type>
    <name>MAME</name>
    <emulator usable="true">true</emulator>
  </system>
  <system>
    <type>Pocket</type>
    <name>Sony PSP</name>
    <emulator usable="false">false</emulator>
  </system>
  <system>
    <type>Console</type>
    <name>Nintendo Wii</name>
    <emulator usable="false">true</emulator>
  </system>
  <system>
    <type>Console</type>
    <name>Sony PS2</name>
    <emulator usable="false">true</emulator>
  </system>
</game-systems>
```

## Basic Node Selection

To navigate through an XML document, we use path expressions. The most common expressions we will use are slashes: single (`/`) or double (`//`).

A single slash performs a search from the root node. In our XPath search, an expression like: `/game-systems/system/type` will return the following result (in XMLSpy):

![XPath Single Slash Search Result](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfZDTT9Y1H8ypwf9hMCsXwknqc1SwBjWSmveY7ywrR3_E6tVLVW5kqqIXnX32HgaH6jcbelkxaZHq8YmtDUuaqGHx3V4OsGGWm612gY76Dodi4YUH7g7PZkF5UiJ9a37IpoQknLDwX8bSX/s320/1.GIF)

A double slash (`//`) will traverse the entire XML tree and find all nodes that match the selection, regardless of their position. So, the selection `//type` in our example will produce the same result as the previous example.

![XPath Double Slash Search Result](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEheKKLobANyh1PUEaYamePvH4eoJARmG_zmnm-w_Fn_XQbmlpNsW1o7GoAj563wIk8vOSdOzI_l58sewx33pEhFSgYooPmvuEwXSoNOgpr2urMm4YIS9tphufIY1a22Vq2Kj3TRkO_hpL4F/s320/2.GIF)

Other common path expressions to select XML nodes are `@`, `.`, and `..`.

`@` is used to select an attribute, as in: `/game-systems/system/emulator/@usable`, where we select the value of the `usable` attribute within the `emulator` node.

![XPath Attribute Selection Result](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcJH-IDi29RT6SSyQ6wM13FYkNVFNrnv6hTeqE1PhAU6J7y0wSt-8XGi_0orwGaISrQgY0YYqk7dEia8XbIy6q-0NYNb87gy8K-q4MdDgs3-oepGSWDYK7KQuGKsKRvD47_LFssPPPgVR5/s320/3.GIF)

`.` will select the current node, and `..` will select the parent node. This is similar to selecting file paths in a file system!

To select the parent of an `emulator` node (which is `system`): `/game-systems/system/emulator/..`.

![XPath Parent Node Selection Result](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidCAhKh4HXtnk6JUMm89tWlQpCQl6Kd1aXSkgWMH3dJLklNQ3GRmV0evAZhpHBSvr1QBXBHQJ2y7TkjP5UEPEsf6Z7foxGREMPZFEsA6DfS0QtfR4wwFebU0RejExDLOcnrIsX8pbP9xHL/s320/4.GIF)

## Finding Specific Nodes

To find specific nodes, we use **predicates**. With this construction, we can perform searches to find nodes with specific element or attribute values. We can also extract specific results from a node-set (if there is more than one node resulting from a previous search). Predicates are always enclosed in square brackets `[]`.

Finding the first `system/emulator` value can be done with the following search: `/game-systems/system[1]/emulator`.

To find all system names with a usable emulator, we would write: `/game-systems/system/emulator[@usable='true']/../name`. Here, we use `..` as a way to move up to the parent element in the XML tree.

![XPath Predicate Search Result](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOHG5OROmf0bKEtRQMsO-MAwGY8jUh_m43U0-EhOthPbV4OKhe8k3GFVcfj4P-2H7NNEWSWwq4s3eTLR5kFY0aYC-RodVY793YqhcCzAkYJineBcSRORpWOXxQ0ipq2wG4objPIynjvvT_/s320/5.GIF)

## Finding Node-sets Relative to the Current Node

We can also use the XML tree structure (children, parents, etc.) to find specific nodes.

For example, we can rewrite the previous example as follows: `/game-systems/system/emulator[@usable='true']/ancestor::system/name`.

This expression is somewhat longer, but it achieves the same result. Here, we are using the `ancestor` axis, which returns the ancestors of the current element (`system` in this case). You can also search for children, attributes, descendants, and perform similar searches (in most cases) using basic node selectors and predicates.
```