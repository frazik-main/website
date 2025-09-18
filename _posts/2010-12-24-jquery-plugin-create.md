---
layout: post
title: "jQuery Plugin Development Guidelines"
date: 2010-12-24 22:48:00
description: "This article provides a simple guide for writing jQuery plugins, covering best practices such as naming conventions, handling the $ alias, complex parameter lists, and wrapper methods."
tags: jquery, plugins, javascript, development, best-practices
categories: jquery-development
---

## Introduction

jQuery promotes writing reusable components as jQuery plugins. This is a good practice and a smart way of working. jQuery also promotes a certain style for writing these plugins. This short example provides simple guidelines on how to do this.

## Example

You can download a simple example (which includes a complete Java web application and a jQuery plugin that uses Ajax) from my [Google Code repository](http://codingwithpassionblog.googlecode.com/files/jQueryPluginCWP.zip).

This example consists of a single JSP page that displays programming language names. By clicking on a language, its description is fetched from the server using Ajax and displayed at the bottom of the page.

## 1. Naming Conventions

The recommendation is simple: prefix the filename with `jQuery`, then follow that with the name of the plugin, optionally include the plugin's version number, and conclude it with `.js`.

We named our plugin "details" (because it shows details about a programming language, I know it's a simple name!) and named the file `jquery.cwp.details.js`. Here, we added a unique plugin name for ourselves (`cwp` stands for "coding with passion"), which helps limit name conflict problems.

Similar considerations need to be taken with the _names_ we give to our functions. In our case, we did not bother with that because there is a 100% chance that this plugin will be used only by me, and I probably will never use it again (outside of this example)... so there you go.

## 2. Handle $ Alias Properly

We have no way of knowing _whether_ a web developer (using _our_ plugin) will use the `$.noConflict()` function to allow `$` to be used by another library. Therefore, we need to guard against such situations. We can use the following trick:

```javascript
(function ($) {
  // plugin implementation
})(jQuery);
```

By passing `jQuery` to a function that defines its parameters as `$`, `$` is guaranteed to reference `jQuery` within the body of the function.

## 3. Complex Parameter Lists

Most plugins tend to be simple affairs that require few, if any, parameters. Intelligent defaults are supplied when optional parameters are omitted. The `bind` method is a good example; if the optional parameters are omitted, the listener function, which is normally specified as the third parameter, can be supplied as the second.

We can use the handy `$.extend` function to merge default parameters with optional ones. Consider the following example:

```javascript
function complex(p1, options) {
  var settings = $.extend(
    {
      option1: defaultVal1,
      option2: defaultVal2,
      option3: defaultVal3,
    },
    options || {}
  );
  // "meat" of the function.
}
```

By merging the values passed by the web developer in the `options` parameter with an object containing all available options and their default values, the `settings` variable ends up with the default values superseded by any explicit values specified by the developer.

**Note:** With `options || {}`, we guard against the `options` object being `null` or `undefined`.

## 4. Wrapper Methods

The true power of `jQuery` lies in its ability to easily and quickly select and operate on DOM elements. Luckily, we can extend that power by adding our own wrapper methods. The general pattern for doing so is:

```javascript
$.fn.functionName = function (params) {
  // function implementation
};
```

That's almost it; just remember to **always** return `this` for chaining support. With that said, here is our function in all its glory:

```javascript
(function ($) {
  $.fn.details = function (url, options) {
    var settings = $.extend(
      {
        customClass: null,
        paramName: "language",
        url: url,
      },
      options || {}
    );

    this.click(function (event) {
      $("div.details").remove();
      // Substitute '<' with appropriate start tag and '>' with end tag...
      $("<div/>")
        .addClass("details" + (settings.customClass ?  " + settings.customClass : "))
        .css({
          display: "none",
        })
        .appendTo("body")
        .load(settings.url, encodeURIComponent(settings.paramName) + "=" + encodeURIComponent($(event.target).text()), function () {
          $(this).closest(".details").fadeIn("slow");
        });
    });
    this.addClass("details");
    return this;
  };
})(jQuery);
```
