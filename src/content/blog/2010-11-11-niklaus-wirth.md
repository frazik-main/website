---
layout: post
title: "Niklaus Wirth on Programming Languages and Verification"
date: 2010-11-11 00:45:00
description: "Exploring Niklaus Wirth's profound insights on programming languages, the hardware-software gap, program verification, and his critiques of modern software development practices."
tags: niklaus wirth, programming languages, modula-2, pascal, oberon, program verification, software engineering, compilers, computer science
categories: programming-philosophy, software-engineering
---

I first heard of **Niklaus Wirth**'s name during my freshman year at college. I didn't know who he was, but my professor kept repeating his name in correlation with the MODULA-2 language that we used in our classes. At first, I didn't like the MODULA-2 language because it looked very simple and not very modern (at the time, it was all about C++ and Java). But as time passed, I realized that the simplicity of this language and its shortage of libraries (compared to Java, for instance) was really beneficial because it didn't divert our attention to less important matters. Of course, most people will recognize Wirth as the father of the PASCAL language.

**Niklaus Wirth**'s name is also associated with programming languages such as Euler, PASCAL, Algol, Oberon, and PL/0. Oracle's PL/SQL, for example, is very similar to MODULA-2 and Oberon. You can learn more about him on [Wikipedia](http://en.wikipedia.org/wiki/Niklaus_Wirth).

## Insights from a Niklaus Wirth Interview

I recently watched an interview with Niklaus Wirth on YouTube and want to highlight the most important and useful notes from this video. One can truly appreciate how he understands the problems of old and modern programming languages and programming concepts, and offers solutions to these issues.

The interview is divided into three parts, but the first part seems to be missing. Therefore, I will refer to the available [second part](http://www.youtube.com/watch?v=Cck53cQgFQg) and [third part](http://www.youtube.com/watch?v=wrGytM2YTQY). I decided to provide overviews of these videos because I believe they contain valuable and insightful observations worth repeating.

The second (available as the first) video is less focused on conceptual insights but offers an interesting historical overview of the PASCAL language.

### The Hardware-Software Gap

In the third (available as the second) video, Wirth discusses the widening gap between hardware and high-level languages (like Java, C#) and how compilers need to bridge this gap. He states that as this gap widens, bridging it becomes increasingly difficult.

He also mentions that hardware designers often prioritize speed without adequately considering software aspects, thus making programmers' lives more challenging. _He argues that new hardware creates difficulties for compilers, making them unnecessarily complex. Ideally, compilers should become simpler even as CPUs become more complex._

### Program Verification and Language Design

The most interesting part of the interview is when he discusses program verification. **He defines program verification as an exercise in formalism, stating that verification can be achieved using only basic language axioms and derivation rules inherent in the language's definition.** This, in my opinion, is truly what it's all about: clear, formal programs and programming concepts. **He emphasizes the need for formal, precise, and unambiguously defined languages for this purpose** (languages based on clear rules and without access to low-level hardware details; pointer-based languages, for instance, do not fit this description, whereas Oberon does).

### Critiques of Modern Practices

**He stated that Java is a beautiful language, but criticized it as being long, lengthy, and unnecessarily complicated.** **He added that if a language is designed in an ad-hoc manner, with the expectation that the compiler will handle all difficulties, then it cannot be a good language.** _(One might think of C++ here.)_ **He argues that using languages that are neither clear nor formal leads to unnecessary complexities and potential disasters.** **He also criticized universities for merely purchasing software from companies instead of fostering the creation of new values and ideas.**

**As a final statement, he observed that modern systems (and contemporary programmers) face numerous challenges because they often rely on libraries with improperly specified interfaces. A significant amount of effort then goes into linking programs with these libraries.** This often leads to buggy programs, and debugging, as he stated, is not a science or even engineering, but merely a try-and-error principle.

## Additional Resources

You can also find great [quotes](http://en.wikiquote.org/wiki/Niklaus_Wirth) on Wiki from this great scientist and engineer.

I also recommend reading his book, _[Algorithms and Data Structures](http://www-old.oberon.ethz.ch/WirthPubl/AD.pdf)_. This book was considered a 'holy grail' at our university (translated into our native language), and reading it will teach you the basic principles of good programming: `algorithms + data structures = program`.
