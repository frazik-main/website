---
layout: post
title: JavaScript Concepts - Understanding Objects
date: 2010-03-03 12:00:00
description: A deep dive into JavaScript objects and their fundamental concepts
tags: javascript programming objects
categories: tutorials
---

# Introduction

JavaScript is a language that's widely used across the web, but it's often not _deeply_ understood by many developers writing it. In this "JavaScript Concepts Series", we'll explore some of the deeper concepts of the JavaScript language. This is the first article in the series.

## Why Objects?

The most important concept in JavaScript is that functions are _first-class objects_, which is a result of how JavaScript defines and deals with functions. To understand what it means for a function to be an object, we must first understand what JavaScript objects are all about.

In JavaScript, when an object is created, it initially holds no data and exposes little in terms of semantics. JavaScript objects don't support "classical" object-oriented programming, at least not in the obvious and familiar way that developers from other languages might expect.

We can create objects using the `new` operator (though there are other ways to create objects, as we'll see shortly).

Objects can contain properties and possess "methods". Unlike classical object-oriented statically typed languages (like Java), properties and methods aren't predeclared for an object; we create them dynamically as needed. However, this flexibility comes with trade-offs!

Let's look at some examples:

```javascript
var house = new Object();
house.noOfDoors = 5;
house.address = "Main Road 51";
house.yearBuilt = new Date(2001, 2, 11);
```

Properties are not limited to primitive types. An object property can be another Object instance. Let's add a new property called `owner` to our `house` instance:

```javascript
var owner = new Object();
owner.name = "Kimi Raikkonen";
owner.occupation = "Rally driver";
owner.previousOccupation = "F1 driver";

// Add to house
house.owner = owner;
```

To access nested properties, we use dot notation:

```javascript
var homeOwnerName = house.owner.name;
```

## JSON (JavaScript Object Notation)

We can use a more compact notation for creating objects, known as JSON (JavaScript Object Notation). This format is widely preferred by developers. For more information, visit [json.org](http://www.json.org).

```javascript
var house = {
  noOfDoors: 5,
  address: "Main Road 51",
  yearBuilt: new Date(2001, 2, 11),
  owner: {
    name: "Kimi Raikkonen",
    occupation: "Rally driver",
    previousOccupation: "F1 driver",
  },
};

console.log("House owner:", house.owner.name); // Works fine
```

## The Window Object

When you use the `var` keyword for declaring variables at the top-level scope (global or window scope), you're creating top-level properties of the `window` object. Additionally, when you don't use the `var` keyword inside a function, you're also creating a top-level property on the `window` object.

```javascript
var name = "Simon"; // Global variable, property of window object
console.log(window.name); // Works fine

function calculatePi() {
  result = 3.14; // Without var keyword, this becomes a window property
}
calculatePi();
console.log(window.result); // Works fine
```
