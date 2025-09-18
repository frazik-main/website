---
layout: post
title: Why Learn Scheme? Understanding Functional Programming for JavaScript
date: 2011-07-30 23:08:00
description: An introduction to Scheme, highlighting its benefits for understanding JavaScript, its core functional programming concepts, and basic syntax with illustrative examples.
tags: scheme, lisp, functional-programming, javascript, sicp, programming, education
categories: functional-programming-concepts
---

## Why Learn Scheme?

The main goal of learning functional programming is to better understand JavaScript and to have fun! We will be using **Scheme** (a dialect of **LISP**) as a tool to aid this learning process. Scheme is not as popular a programming language as JavaScript. It is mainly well known within university circles, where it is typically used for research in artificial intelligence. It is a pure functional language, which JavaScript, of course, is not, but it _can_ be. That is the beauty of the JavaScript language. It can behave similarly to an object-oriented language with code reuse patterns like inheritance and composition, and at the same time, also as a functional language. If you truly want to master JavaScript, then prior knowledge of a functional language cannot hurt!

So, anyway, I'm starting to read [Structure and Interpretation of Computer Programs](http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html#%_toc_start). This is one of the "must-read" books for programmers. So, let's see what this masterpiece has to offer.

And right in the foreword to this book, I found a great comparison: "Pascal is for building pyramids—imposing, breathtaking, static structures built by armies pushing heavy blocks into place. Lisp is for building organisms—imposing, breathtaking, dynamic structures built by squads fitting fluctuating myriads of simpler organisms into place." Wow! Now I _must_ read this book!

I did use Scheme at my university, but as years passed, I could only remember basic concepts. This will be a great opportunity to refresh some of my knowledge.

Did you know that JavaScript has much in common with Scheme? This might seem odd; please see this link: [The Little JavaScripter](http://javascript.crockford.com/little.html). **Douglas Crockford** is one of the old gurus of JavaScript. Why did they choose to build parts of the JavaScript language similar to Scheme? My opinion is that Scheme is simple, and its concepts are natural. There isn't much to remember (like data types, pffff). So, if you know Scheme, it can be easier to understand some core JavaScript concepts. And I hear voices that this language (JavaScript, that is) is becoming increasingly important!

You can download the MIT Scheme interpreter, compiler, source-code debugger, and more from [here](http://www.gnu.org/software/mit-scheme/). You can also download another Scheme editor/interpreter named [Racket](http://racket-lang.org/) (recommended because it is simpler than the MIT Emacs environment; formerly known as DrScheme).

## Language Basics

In a functional language, you type an **expression**, and the interpreter/compiler provides an **evaluation** of that expression. Here are examples of rudimentary expressions in Scheme:

```scheme
; expression
1586
; Output: 1586

; combination
(+ 15 7)
; Output: 22

(/ 12 3 4)
; Output: 1
```

**Combinations** are expressions enclosed within parentheses to denote procedure application. You may notice that Scheme uses **prefix notation**, which can look somewhat odd. However, it has several advantages over normal mathematical notation (operand-operator-operand). Firstly, it enables procedures to accept an arbitrary number of arguments. Secondly, it extends in a straightforward way by allowing combinations to be **nested**, like in this example:

```scheme
(+ 3
   (* 2 3 5
      (+ 2 1)
      (- 8 1))
   (+ 3 1))
```

It is quite interesting that it is not necessary to explicitly instruct the interpreter to print the value of an expression. Unlike in Java, where you must explicitly use `System.out.println` to print the value of a variable, here you know the value of the expression at every point. Okay, this isn't a perfect comparison, but hopefully, you get the point. :) In a functional language, any output from a function can be input to another or printed to standard output.

For a simple form of abstraction, we use the `define` keyword. It provides a means for using names to refer to computational objects (variables). For example (a semicolon represents a comment):

```scheme
; Use 'define' to identify the variable PI and give it a value.
(define PI 3.14)

; Identify a procedure for calculating the area of a circle.
(define (area r)
  (* (* r r)
     PI))

; Run it
(area 5)
; Output: 78.5
```

You can see that `define` also enables us to identify procedures (**procedural definitions**), which is a powerful form of abstraction by which a compound operation can be given a name. We refer to this kind of abstraction as _procedural abstraction_, and it helps us suppress the details of procedure implementation, allowing us to view a procedure as a **black box**.

You can see that a procedure has parameters (these are _formal parameters_), and we say that the procedure **binds** these formal parameters. In a _procedure definition_, the variables declared as formal parameters of the procedure have the body of the procedure as their scope. This means that the names of formal parameters are "understood" only inside the procedure and are not defined outside its body.

However, not all variables are bound (i.e., bound to a concrete procedure and meaningless outside that procedure). There can also be **free variables**. Free variables are not bound (e.g., `+`, `-`, `*`, `/`, `pi`, or our defined `PI`, and so on). If we use free variable names as our procedure's formal parameters, we will then **capture** the free variable name (binding it to the current procedure we are defining), and by doing so, we will introduce unexpected behavior and errors.

Here are some self-explanatory examples of procedure and variable definitions:

```scheme
; Simple atomic operation (in this case, +).
(+ 5 8 9 7 5 1 5 15)
; Output: 55

; Nested combinations.
(+ (* 3 4) (- 4 6))
; Output: 10

; Simple abstraction of variables.
(define a 3)
(define b 8)
(+ a b (- a))
; Output: 8

; Calculate distance between two points.
(define (distance x1 y1 x2 y2)
  (sqrt (+ (* (- x2 x1) (- x2 x1))
           (* (- y2 y1) (- y2 y1)))))
(distance 2 2 4 4)
; Output: 2.8284271247461903
```

Every programming language must be able to define **conditional expressions**. In **Scheme**, we use the symbol `cond` followed by parenthesized pairs of expressions called **clauses** for conditional expressions. The first expression in each pair is a **predicate**—that is, an expression whose value is interpreted as `true` or `false`.

```scheme
(define (signum x)
  (cond ((> x 0) 1)
        ((= x 0) 0)
        ((< x 0) 0))) ; Note: This implementation returns 0 for negative numbers.
(signum (- 3))
; Output: 0
```

In the previous example, you can see the definition of the `signum` (sng) function using simple conditional expressions. It is straightforward how this function works: it evaluates predicates until it finds one that evaluates to `true`.

We can also use `else` in **Scheme**, as in the following example (calculation of absolute value):

```scheme
(define (absolute1 x)
  (cond ((< x 0) (- x))
        (else x)))
(absolute1 456)
; Output: 456

(define (absolute2 x)
  (if (< x 0)
      (- x)
      x))
(absolute2 456)
; Output: 456
```

Here, I also include an example using the special `if` form, which is a restricted type of conditional expression that can be used when there are precisely two cases in the analysis.
