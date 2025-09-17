---
layout: post
title: Dynamically Loading JavaScript Files with jQuery.getScript()
date: 2010-11-20 21:21:00
description: Learn how to dynamically load JavaScript files using jQuery's $.getScript() function, including practical examples.
tags: javascript, jquery, dynamic-loading, ajax
categories: javascript-concepts
---

We typically load external script files into our web pages using the `<script src>` tag. However, there are scenarios where we need to load JavaScript files dynamically, under programmatic control. Some common use cases for this include:

*   Not wanting to load a file at initial page load (due to restrictions or file size).
*   Needing to execute some condition before deciding which file to load.

jQuery provides the `$.getScript()` utility function to enable this functionality. This function leverages jQuery's AJAX capabilities to fetch the script file.

Let's explore how it works!

The following code represents an external JavaScript file (named: `new_script.js`).

```javascript
$('#console').html("Script is loaded...");
function dragonBallFunction(value) {
    alert(value);
}
```

On the main page, we've defined two buttons. The first button loads the script file dynamically, and the second button executes a function (`dragonBallFunction`) from the external file once it has been loaded.

As you can see, the implementation is quite straightforward:

```javascript
$(function() {
    $('#loadButton').click(function() {
        $.getScript("new_script.js");
    });
    $("#executeButton").click(function() {
        dragonBallFunction('Piccolo is not saiyan!\n::Goku:: is!');
    });
});
```

Here's the accompanying HTML for context:

```html
<button type="button" id="loadButton">Load Script</button>
<button type="button" id="executeButton">Execute Handler</button>
<div id="console"></div>
```