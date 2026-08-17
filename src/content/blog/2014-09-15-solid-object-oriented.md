---
layout: post
title: "Introduction to SOLID Principles in Object-Oriented Design"
date: 2014-09-15 21:14:00
description: "An introduction to the SOLID principles of object-oriented design, outlining what the acronym stands for and common pitfalls to avoid."
tags: solid, object-oriented-design, oop, design-principles
categories: design-principles
---

Do you know what SOLID (not "solid," but S.O.L.I.D) object-oriented design stands for? It stands for: **Single Responsibility**, **Open/Closed**, **Liskov Substitution**, **Interface Segregation**, and **Dependency Inversion**.

This acronym was coined by _Robert C. Martin_ (also known as Uncle Bob). According to him, these principles form the backbone of robust object-oriented design. You can read more about these principles in his book, _\"Agile Software Development: Principles, Patterns, and Practices\"_. I will describe these principles in detail in following posts, of course, in a timely manner. :)

Before diving into the SOLID principles, it's helpful to understand the negative characteristics of poor object-oriented design that these principles aim to mitigate. Robert C. Martin outlines these "bad smells" in design as:

- **Rigidity:** The system is difficult to change because a single modification affects too many other parts.
- **Fragility:** When a change is made, unexpected parts of the system break.
- **Immobility:** Components are hard to reuse in another application because they are too tightly coupled to the current application.
