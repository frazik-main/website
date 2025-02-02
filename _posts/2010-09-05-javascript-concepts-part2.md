---
layout: post
title: JavaScript Functions - A Deep Dive
date: 2010-09-05
description: Exploring the deeper concepts of JavaScript functions, including their object nature and first-class status.
tags: javascript, functions, programming
categories: javascript-concepts
---

This post delves into the often-overlooked deeper aspects of JavaScript functions.

## Introduction

JavaScript, a ubiquitous language on the web, is frequently used without a thorough understanding of its underlying mechanisms. This "JavaScript Concepts" series aims to illuminate some of these deeper concepts. This article provides a concise overview of JavaScript functions.

## Functions: The Core Idea

In many traditional object-oriented languages (Java, C++, C#, etc.), objects encapsulate both data and methods. These languages treat data and methods as distinct entities. Methods modify an object's state by altering its properties (fields).

JavaScript takes a different approach.

In JavaScript, **functions are considered objects**. There's no distinction between object types like `String`, `Number`, `window` objects, custom objects, and _functions_. Functions are defined by a constructor named "Function," similar to constructors in other object-oriented languages.

A function can have parameters, and its value (being an object) can be assigned to a variable, a property of an object, returned as a function's return value, or passed as a parameter to another function. This is all possible because functions in JavaScript are treated like other objects. Therefore, we say that functions are **first-class objects** in JavaScript.

### Example Functions:

```javascript
function one() {
  alert("doStuff");
}

function two(name, value) {
  alert("calculate stuff");
}

function three() {
  return "stuff";
}
```

## Function Names

Consider this example:

```javascript
function findMatrix() {
  alert("Hello Neo, what is the Matrix?");
}
```

This does _not_ create a function named "findMatrix" in the way you might expect. While the syntax may seem familiar, it's essentially syntactic sugar (a feature JavaScript is known for) similar to using `var` to create `window` properties (as discussed in a previous article about JavaScript objects). It creates a function instance and assigns it to the `window` property using the function's name, as shown below:

```javascript
findMatrix = function () {
  alert("Hello Neo, what is the Matrix?");
};
```

When declaring a top-level named function, a `Function` instance is created and assigned to a property (with the function's name) of the `window` object.

While this might seem like a subtle detail, it's crucial to understand that `Function` instances are **values** that can be assigned to variables, properties, or parameters, just like instances of other object types. Importantly, these function instances are useless unless assigned to a variable, property, or parameter.
