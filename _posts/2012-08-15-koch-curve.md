---
layout: post
title: Koch Snowflake Animation with HTML5 Canvas
date: 2012-08-15 22:45:00
description: An exploration of the Koch snowflake fractal, demonstrating its recursive implementation through an animation using HTML5 Canvas and JavaScript.
tags: javascript, canvas, fractal, recursion, koch-snowflake, animation, html5
categories: javascript-concepts, html5
---

## Introduction

The Koch snowflake is a fascinating fractal, renowned for its simple yet elegant recursive definition. Its implementation, particularly for visualization, is remarkably straightforward. This article demonstrates how to animate the generation of a Koch snowflake using an HTML5 canvas element, showcasing the inherent beauty and power of recursive algorithms.

## Koch Snowflake Implementation

This section details the structure and logic behind creating the interactive Koch snowflake animation using JavaScript and the HTML5 Canvas API.

### HTML Structure

To begin, we need an HTML page with a `<canvas>` element to draw on and include the necessary JavaScript files. jQuery is used here for DOM manipulation, though it's not strictly required for the core drawing logic.

```html
<canvas width="640" height="380" id="mycanvas">
    Your browser doesn't support the canvas element.
</canvas>

<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<!-- The main animation script will go here -->
```

### Core Recursive Logic

The heart of the Koch snowflake generation lies in two main functions: `drawKochSnowflake` and the recursive `drawKochCurve`.

The `drawKochSnowflake` function orchestrates the drawing of the three main curves that form the snowflake. Each curve is drawn by calling `drawKochCurve`, followed by rotating the drawing angle.

```javascript
var drawKochSnowflake = function() {
    drawKochCurve(level, 150);
    angle += 120;
    drawKochCurve(level, 150);
    angle += 120;
    drawKochCurve(level, 150);
};
```

The `drawKochCurve` function is where the recursion happens. It determines whether to draw a straight line segment (base case, `level < 1`) or to break down the current segment into four smaller segments, each rotated appropriately, effectively creating the fractal pattern.

```javascript
var drawKochCurve = function(level, sideLength) {
    if (level < 1) {
        draw(sideLength); // Base case: draw a straight line
    } else {
        // Recursive step: break down into four smaller curves
        drawKochCurve(level - 1, sideLength / 3);
        angle -= 45;
        drawKochCurve(level - 1, sideLength / 3);
        angle += 90;
        drawKochCurve(level - 1, sideLength / 3);
        angle -= 45;
        drawKochCurve(level - 1, sideLength / 3);
    }
};
```

### Animation and Canvas Operations

The animation is managed by the `animateKochSnowflake` function, which is repeatedly called by `setInterval`. It initializes the drawing state, saves the canvas context, draws the snowflake, flushes the drawing, and then increments the fractal's detail level.

```javascript
var animateKochSnowflake = function() {
    initialize();
    save();
    drawKochSnowflake();
    flush();
    level++;
};
```

Several helper functions manage the canvas state and drawing operations:
- `initialize()`: Sets the initial drawing position and angle, resetting the level if it exceeds a certain threshold (here, 5).
- `save()`: Stores the current canvas state, clears the canvas, translates the origin for the animation effect, and sets the starting point for drawing.
- `draw(sideLength)`: Calculates the next `x` and `y` coordinates based on the current `angle` and `sideLength`, then adds a line segment to the current path.
- `flush()`: Closes the path, fills it with the specified color, and restores the canvas to its previous state.

These functions are crucial for managing the canvas context and providing the visual feedback of the animation.

```javascript
// Initialization
var initialize = function() {
    angle = 90;
    x = 170;
    y = 100;
    if (level > 5) { // Reset level for continuous animation
        level = 0;
    }
};

// Canvas state management and clearing
var save = function() {
    context.save();
    context.beginPath();
    context.clearRect(0, 0, 640, 380); // Clear the canvas area
    context.translate(-level * 10, 0); // Translate for animation effect

    context.moveTo(x, y); // Set starting point for the new drawing
};

// Draws a single line segment
var draw = function(sideLength) {
    x += sideLength * Math.sin(angle * Math.PI / 180);
    y -= sideLength * Math.cos(angle * Math.PI / 180);
    context.lineTo(x, y);
};

// Finalizes and renders the path
var flush = function() {
    context.closePath(); // Close the path to form a shape
    context.fill();      // Fill the shape with the current fillStyle
    context.restore();   // Restore the canvas state
};
```

### Animation Setup

The animation is initiated by calling the `animate()` function, which sets up an `setInterval` to repeatedly call `animateKochSnowflake` every 1000 milliseconds (1 second).

```javascript
var animate = function() {
    setInterval(animateKochSnowflake, 1000);
};

// Start the animation when the DOM is ready
animate();
```

## Full Code Example

Here is the complete JavaScript code for the Koch snowflake animation, ready to be placed in your HTML file after the jQuery script include.

```javascript
$(function() {
    var canvas = $("#mycanvas");
    var context = canvas.get(0).getContext("2d");
    context.fillStyle = "rgb(63, 169, 245)";
    var x;
    var y;
    var angle;
    var level = 0;

    var animateKochSnowflake = function() {
        initialize();
        save();
        drawKochSnowflake();
        flush();
        level++;
    }

    // Create snowflake
    var drawKochSnowflake = function() {
        drawKochCurve(level, 150);
        angle += 120;
        drawKochCurve(level, 150);
        angle += 120;
        drawKochCurve(level, 150);
    };

    // Recursive implementation
    var drawKochCurve = function(level, sideLength) {
        if (level < 1) {
            draw(sideLength);
        } else {
            drawKochCurve(level - 1, sideLength / 3);
            angle -= 45;
            drawKochCurve(level - 1, sideLength / 3);
            angle += 90;
            drawKochCurve(level - 1, sideLength / 3);
            angle -= 45;
            drawKochCurve(level - 1, sideLength / 3);
        }
    };

    var draw = function(sideLength) {
        x += sideLength * Math.sin(angle * Math.PI / 180);
        y -= sideLength * Math.cos(angle * Math.PI / 180);
        context.lineTo(x, y);
    };

    var initialize = function() {
        angle = 90;
        x = 170;
        y = 100;
        if (level > 5) {
            level = 0;
        }
    };

    var save = function() {
        context.save();
        context.beginPath();
        // Note: The original full code block used 480 height here,
        // while the canvas element is 380. For full code integrity,
        // we keep 480 as in the original 'Code:' section.
        context.clearRect(0, 0, 640, 480);
        context.translate(-level * 10, 0);

        context.moveTo(x, y);
    };

    var flush = function() {
        context.closePath();
        context.fill();
        context.restore();
    };

    var animate = function() {
        setInterval(animateKochSnowflake, 1000);
    };

    animate();
});
```

## Conclusion

The Koch snowflake serves as an excellent example of how complex and visually appealing patterns can emerge from simple recursive rules. Implementing this fractal using HTML5 Canvas and JavaScript not only provides a captivating animation but also reinforces the fundamental concepts of recursion and graphical programming. This demonstration highlights the power of these web technologies for visualizing mathematical concepts.