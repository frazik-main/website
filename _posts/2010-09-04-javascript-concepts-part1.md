---
layout: post
title: JavaScript Concepts - Objects
date: 2010-09-04 10:00:00 # Replace with actual date from HTML
description: An introduction to objects in JavaScript, including object creation, properties, JSON notation, and the window object.
tags: javascript, objects, json, programming
categories: javascript-concepts
---

# JavaScript Concepts: Objects

## Introduction

JavaScript is a widely used web language, but many page authors don't utilize its deeper concepts. This "JavaScript Concepts series" aims to introduce some of these advanced features. This is the first article in the series.

## Why Objects?

The most important concept in JavaScript is that functions are _first-class objects_. To understand this, we must first grasp JavaScript objects.

In JavaScript, newly created objects hold no data and offer minimal semantics. JavaScript objects don't support "classic" object-oriented programming in the way programmers familiar with languages like Java might expect.

We can create objects using the `new` operator (other methods exist, as we'll see later).

Objects contain properties and "methods." Unlike statically-typed languages, properties and methods aren't predeclared; we create them dynamically. This flexibility comes with a cost!

In the following example, we create a new `Object` instance and assign it to a variable named `house`:

```javascript
var house = new Object();
house.noOfdoors = 5;
house.address = "Main road 51";
house.yearBuild = new Date(2001, 2, 11);
```

Properties aren't limited to primitive types; an object property can be another object instance. Let's add an `owner` property to our `house` instance:

```javascript
var owner = new Object();
owner.name = "Kimi Raikkonen";
owner.occupation = "Rally driver";
owner.previousOccupation = "F1 driver";
house.owner = owner;
```

To access a nested property:

```javascript
var homeOwnerName = house.owner.name;
```

## JSON

A more concise notation for creating objects is JSON (JavaScript Object Notation), preferred by many developers. See [http://www.json.org](http://www.json.org) for more information.

```javascript
var house = {
  noOfdoors: 5,
  address: "Main road 51",
  yearBuild: new Date(2001, 2, 11),
  owner: {
    name: "Kimi Raikkonen",
    occupation: "Rally driver", //Corrected duplicate 'name' property
  },
};
alert("House owner: " + house.owner.name); // Works fine.
```

## Window Object

When you declare a variable at the top level (global or window scope) using `var`, you're creating a top-level property of the `window` object. Omitting `var` inside a function also creates a top-level `window` property.

```javascript
var name = "Simon"; // Global variable, property of window object.
alert(window.name); // Works fine.

function calculatePi() {
  // something...
  result = 3.14; // Without var, this is a window property.
}

calculatePi();
alert(window.result); // Works fine.
```

This concludes our introduction to objects. To learn more, read about [JavaScript functions](http://codingwithpassion.blogspot.com/2010/09/javascript-concepts-part-1-functions.html).
