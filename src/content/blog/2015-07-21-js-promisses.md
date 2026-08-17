---
layout: post
title: "JavaScript Promises - An Introduction"
date: 2015-07-21 16:04:00
description: "An introduction to JavaScript Promises, explaining their purpose in handling asynchronous operations, addressing callback hell, and demonstrating a basic implementation."
tags: javascript, promises, asynchronous, callbacks, programming
categories: javascript-concepts
---

### What Are Promises?

Promises quickly became the standard way to handle asynchronous operations in JavaScript. Everyone who codes even a little bit in JavaScript is familiar with callbacks. The essence of using callback functions in JavaScript is passing a function as an argument to another function and later executing that passed-in function or even returning it to be executed later.

There are several problems with callbacks. For example, when you need to be sure that two callbacks finish before you do something, you must introduce new variables to track the state of each callback. Callbacks also lead to another problem, which you should already be familiar with: callback hell.

### Callback Hell

I think this all started with Node.js, and callback hell got a bad rap from the **Node.js community**. This is because when you have a Node.js application with Express and Mongoose, then callbacks are all over the place.

When you need to perform a number of actions in a specific sequence in JavaScript, you must use nested functions, something like this:

```javascript
asyncCall(function (err, data1) {
  if (err) return callback(err);
  anotherAsyncCall(function (err2, data2) {
    if (err2) return callback(err2);
    oneMoreAsyncCall(function (err3, data3) {
      if (err3) return callback(err3);
      // are we done yet?
    });
  });
});
```

You can use promises to make this code prettier:

```javascript
asyncCall()
  .then(function (data1) {
    // do something...
    return anotherAsyncCall();
  })
  .then(function (data2) {
    // do something...
    return oneMoreAsyncCall();
  })
  .then(function (data3) {
    // the third and final async response
  })
  .fail(function (err) {
    // handle any error resulting from any of the above calls
  })
  .done();
```

A lot nicer, isn't it?

You can see that instead of requiring a callback, we are returning a `Promise` object. You can chain promises, so subsequent `then()` calls on the `Promise` object also return promises.

We don't need to check for errors in every callback, but only at the end of the promise chain. This is also a feature of promises.

Promises are **not the only solution** to callback hell. Sometimes callback hell is a direct consequence of **poor code organization**. In some cases, promises only hide underlying structural problems in the code. I mean, if you need 5 levels of indentation, you're probably in trouble anyway and should fix your program's structure. You can find [here](http://callbackhell.com/) some hints on how to resolve callback hell.

### Implementation

Promises have arrived natively in JavaScript, but to conclude, I want to provide a "half-baked" promise implementation with comments so you can get a feeling for how promises are (or could be) implemented:

```javascript
function Promise(fn) {
  var state = "pending";
  var value;
  var deferred;

  // When the function we passed is done, this will be called.
  // If 'then' is called before 'resolve', then the value for 'then' is deferred to a function outside the promise.
  // If 'then' is called after 'resolve', then the value is read from the internal state.
  function resolve(newValue) {
    value = newValue;
    state = "resolved";

    if (deferred) {
      handle(deferred);
    }
  }

  function handle(onResolved) {
    if (state === "pending") {
      deferred = onResolved;
      return;
    }

    onResolved(value);
  }

  // This will be invoked when the client calls it.
  this.then = function (onResolved) {
    handle(onResolved);
  };

  // Executing the function that was passed into the promise.
  // We are waiting until this function is finished.
  fn(resolve);
}

function testPromise() {
  return new Promise(function (resolve) {
    var value = readFromDatabase();
    resolve(value);
  });
}

testPromise().then(function (databaseValue) {
  log(databaseValue);
});
```
