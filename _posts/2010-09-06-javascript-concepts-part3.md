---
layout: post
title: JavaScript Concepts - Callbacks and Function Context
date: 2010-09-06 10:00:00 # Replace with actual date from HTML
description: A deep dive into JavaScript callbacks and function context, exploring how `this` works and how to manage function contexts using `call()`
tags: javascript, callbacks, function-context, this
categories: javascript-concepts
---

# JavaScript Concepts: Part 3 - Callbacks and Function Context

JavaScript is widely used on the web, but its deeper concepts are often overlooked. This article, the third in a series, explores how functions work in JavaScript, focusing on callbacks and function context.

## Function Callbacks

Web page code is asynchronous, and so are JavaScript functions. A crucial concept in asynchronous programming is the _callback_ function.

Consider this example:

```javascript
var myarray = [22, 21, 3, 5, 1, 105];

function sortAscending(a, b) {
  return a - b;
}

myarray.sort(sortAscending);

alert(myarray); //Alerts the sorted array: 1, 3, 5, 21, 22, 105
```

The `sort` function uses `sortAscending` as a reference. Passing a function as a parameter is like passing any other value. Because the `sort` function _calls back_ to our custom function, this is called a _callback_ function.

Callbacks are often defined as anonymous functions for brevity:

```javascript
var myarray = [22, 21, 3, 5, 1, 105];

myarray.sort(function (a, b) {
  return a - b;
});

alert(myarray); //Alerts the sorted array: 1, 3, 5, 21, 22, 105
```

I prefer declared functions because their reusability is clearer and they avoid a "hack-like" appearance.

## Function Context

Object-oriented languages use `this` to reference the current object instance. JavaScript also uses `this`, but its behavior differs subtly yet significantly.

In JavaScript, the context (`this`) of a function is the object that contains the reference used to invoke the function. This is best understood with an example:

```javascript
var desc = function () {
  alert(this.address + "," + this.yearBuild);
};

var house = {
  noOfdoors: 5,
  address: "Main road 51",
  yearBuild: new Date(2001, 2, 11),
  description: desc,
};

house.description(); // Works correctly
```

This alert box works because `this` refers to the `house` object. However, calling `desc()` in the global scope will fail unless variables `address` and `yearBuild` are also defined in the global scope:

```javascript
var desc = function () {
  alert(this.address + "," + this.yearBuild);
};

address = "Some road from Window";
yearBuild = new Date(2002, 3, 12);
desc(); //Works because 'this' refers to the window object.
```

In JavaScript, the object referenced by `this` is determined by _how_ the function is invoked, not by how it's declared. The same function can have different contexts depending on the call.

JavaScript provides ways to explicitly control the function context using the `call()` or `apply()` methods. `call()` invokes the function, specifying the context as its first parameter. The remaining parameters are passed to the function. `apply()` is similar but uses an array of parameters.

```javascript
function showMe() {
  return this.me;
}

var m1 = { me: "meFirst" };
var m2 = { me: "meSecond" };

window.me = "meWindow";

m1.whoAmI = showMe;

alert(showMe()); // meWindow (global context)
alert(m1.whoAmI()); // meFirst (m1 context)
alert(showMe.call(m2)); // meSecond (m2 context)
```

The first alert uses the global context. The second uses `m1`'s context. The third explicitly sets the context to `m2`.

In summary, understanding `this` and callback functions is essential for working effectively with asynchronous JavaScript. This is the end of Part 3; continue to [Part 4](http://codingwithpassion.blogspot.com/2010/09/javascript-concepts-part-4-closures.html) (closures) for more.
