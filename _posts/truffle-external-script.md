```
---
layout: post
title: Truffle Contract Execution Errors and Solutions
date: 2018-03-27 21:26:00
description: Common errors encountered when executing contract functions from Truffle scripts and how to resolve them.
tags: truffle, ethereum, smart-contracts, errors, javascript
categories: ethereum-development
---

When working with Truffle, you might encounter several common errors when attempting to execute contract functions from your scripts. This post outlines some of these errors and provides guidance on how to approach their resolution.

### Common Errors

Here are some of the errors you might encounter:

*   `Error: VM Exception while processing transaction: out of gas`
*   `Error: Cannot create instance of YourContract; no code at address`
*   `Error: sender account not recognized`
*   `Error: invalid address`

### Solution

If you encounter any of these errors while attempting to execute a contract function from a Truffle script, the proper way to handle them is demonstrated in the following Gist:

[View Solution on Gist.github.com](https://gist.github.com/spookysleeper/1e6ab0733df4fa4ee2840cdbbe27780e.js)
```