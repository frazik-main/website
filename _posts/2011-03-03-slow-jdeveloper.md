---
layout: post
title: Speed up JDeveloper
date: 2011-03-03 11:57:00
description: Tips to improve JDeveloper performance, focusing on memory management, component binding, and page complexity.
tags: jdeveloper, performance, memory, optimisation, development
categories: jdeveloper-tips
---

There are times when JDeveloper slows down so much that it becomes unusable. For example, you might wait 5-30 seconds for a simple text change or for the structure window to refresh. This can happen when you have complex `.jspx` pages and when all your components are bound to a backing bean.

There seem to be some serious issues with JDeveloper's memory management. This might be due to the Java Swing API, but this is just a wild guess, and I don't know much about the specifics.

Either way, to solve this problem, you have two choices:

1.  Use an external editor (this is not a great solution).
2.  A much better option is to disable automatic component binding by removing the `binding` line from your JSPX page. This will raise performance to an acceptable level (though nothing spectacular).

A general tip is to avoid having overly complex Java backing bean pages and JSPX pages. Consider using fragments to simplify the layout.
