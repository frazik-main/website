---
layout: post
title: "jQuery and Animation"
date: 2010-12-31 21:55:00
description: "This tutorial covers jQuery animation methods, from basic show/hide effects to complex custom animations using the animate() method, including practical examples and code snippets."
tags: jquery, animation, javascript, front-end
categories: jquery-tutorials
---

The most common dynamic effect we perform is simply showing or hiding elements. While these are fundamental, jQuery is capable of more complex animations. In this tutorial, we will explore more complex (yet essentially simple) animations, demonstrating the common usage of jQuery's `animate()` method.

For completeness, I've provided a complete runnable example, which you can download from my [Google Code repository](http://codingwithpassionblog.googlecode.com/files/jQueryAnimationSimpleCWP.zip).

## Basic Animations

Before diving into complex animations, let's quickly review common jQuery animation methods and their usage. The primary methods for showing and hiding elements are `show()` and `hide()`. These methods manipulate the `display` CSS property of HTML elements.

We use these methods as follows:

```javascript
$("h1").hide(); // This will hide all h1 elements.
$("h1").show(); // This will show all h1 elements.
```

It's that simple! jQuery also supports toggling the display state of elements between revealed and hidden using the `toggle()` method.

```javascript
$("div").toggle();
```

There's a bit more to these methods than just a simple show/hide. When called without parameters, these methods simply manipulate the display state of the wrapped elements. However, when parameters are provided, these effects can be animated, causing changes in the display status of the affected elements to occur over a period of time.

For example, the following code:

```javascript
$("h1").hide("slow");
```

will specify the duration of the effect, causing the element to fade out slowly. Integer values (representing milliseconds) can also be used here for duration. Additionally, there are predefined methods for fade-in and fade-out effects: `fadeIn()`, `fadeOut()`, and `fadeTo()`. We can also use `slideDown()` and `slideUp()` methods to gradually decrease or increase an element's vertical size, effectively removing or adding it to display.

## jQuery Complex Animation

The number of core effect methods included with jQuery is relatively small. This shouldn't be considered a limitation, because writing custom animations using jQuery's `animate()` method is quite simple if you have a rudimentary knowledge of CSS.

The jQuery `animate(properties, duration)` method applies an animation as specified by `properties`. The `properties` parameter is an object (or hash) that specifies the target values for supported CSS styles at the end of the animation. The animation works by smoothly adjusting the style property values from their current state to the target values specified in this object. The `duration` parameter optionally specifies the duration of the effect (similar to other simple animation methods).

Let's look at an example:

```javascript
$(function () {
  $("img[alt='arrow']").click(function (event) {
    var ball = $(this);
    var SCALE = 3;
    ball.animate(
      {
        opacity: "hide",
        width: ball.width() * SCALE,
        height: ball.height() * SCALE,
      },
      "fast"
    );
    ball.animate({ opacity: "show" }, "fast");
    ball.animate({ top: "+=300" }, 4000);
    ball.animate({ left: "+=600" }, 4000);
    ball.animate({ top: "-=300" }, 4000);
    ball.animate(
      {
        left: "-=600",
        width: "80px",
        height: "80px",
      },
      4000
    );
  });
});
```

This example is straightforward:
We have a single image element in our DOM. After a user clicks on it, we first grab its instance and name it "ball." Then, we use the `animate()` method (lines 5-11) to scale it by a factor of 3 and fade it out. Next, we show it (line 12), which creates a blinking effect. Following this, the "ball" moves through a square path: down (line 13), right (line 14), up (line 15), and finally, left while simultaneously reverting to its original size (lines 16-22). Notice that we also use integer values for animation duration.

This tutorial is not exhaustive; the `animate()` method can be further configured by passing additional parameters, such as callback functions and easing functions. However, for this short example, these were not necessary.

Here is the ball animation in action:

![Ball Animation GIF](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVW6i5Q0dwkfTdi7HaE6erFpuVkiV3Wf3PakVWaRQP8dOF5lsV_PeNPGJJtnc0kXboAM0seyMC2AgF1FYjgbiiO8ArwewZhVooP0FVtKtIUdyK2K8COxx85msCGF8IVbxJKFOFdFvLvWJJ/s320/1.GIF)
