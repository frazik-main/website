```markdown
---
layout: post
title: ADF Faces Generator - Automating ADF View Creation
date: 2012-04-10 20:02:00
description: An alpha version of a JDeveloper extension that automatically generates the view part of an ADF Fusion Web Application from its model, including installation instructions and usage examples.
tags: adf, jdeveloper, faces, generator, automation, fusion-web-application, extension, oracle
categories: adf-development, jdeveloper-extensions
---

# Introduction

Previously, I discussed this [ADF generator](http://codingwithpassion.blogspot.com/2011/04/faces-generator-for-oracle-adf-ver-05.html). It is currently in a working state (to some extent), so I've decided to publish it to gauge interest among ADF developers.

The basic idea is the automatic creation of the view part of an ADF Fusion Web Application, using the model part as its foundation. I suggest watching the videos I prepared first to understand its capabilities. If you find it interesting, installation instructions are provided below. Please note that this is an alpha version and is therefore unstable.

This extension works with all JDeveloper versions greater than 11.1.1.2.0. However, I recommend using it with JDeveloper version 11.1.1.4.0 and newer, as previous versions had issues with the "Oracle Dynamic Tabs Shell" page template. These issues manifest as instability (random exceptions) when running the Fusion Web Application. JDeveloper 11.1.2.1.0 is not supported at this time.

# Video Examples

## First Example

This video shows how the generator can create an almost complete view for an ADF Web application.

[Watch First Example on YouTube](http://www.youtube.com/watch?v=Z8DGLHhlJv8)

## Second Example

This video demonstrates how the generator's view changes when you introduce Lists of Values (LOVs) into the model.

[Watch Second Example on YouTube](http://www.youtube.com/watch?v=yWh3Zy585fM)

## Third Example

This video illustrates how changes to the model, such as removing or adding view instances from an application module, are reflected in the view.

[Watch Third Example on YouTube](http://www.youtube.com/watch?v=I7Dy0iEuMBs)

# Installation and Usage

If you wish to download and try the generator, here are the steps:

## Download and Installation

First and most importantly, the generator can be downloaded from [here](http://codingwithpassionblog.googlecode.com/files/com.dukesoft.facesgenerator.jar). Installation is very simple: just copy this JAR file into your `<Middleware Home>/jdeveloper/jdev/extensions` directory.

## Generation Steps

Generation consists of four parts:

1.  **Create Fusion Web Application and Model**: Create a Fusion Web Application and its complete model. This involves basic ADF setup. I suggest adhering to the default project names and packages (e.g., `view` for the ViewController project and `model` for the Model project) when prompted by the wizard.

2.  **Initialize ADF View Project**: This is necessary because JDeveloper needs to add specific libraries to the view project. To do this, create a JSF page using the "Oracle Dynamic Tabs Shell" page template. Then, drag and drop a random data control (one is sufficient to initialize its application module in the view project) from *each* application module you plan to use onto this page. While you could create multiple JSF pages for each application module, it is not necessary.

3.  **Copy Required Files**: You need to copy some files to this newly created view project, as this plugin depends on certain Java classes and predefined bindings. You can download these files from [here](http://codingwithpassionblog.googlecode.com/files/generator_files.zip). When you unpack them, please copy them according to the following pattern:

    *   `public_html/images/*` -> `ViewController/public_html/images/`
    *   `public_html/js/*` -> `ViewController/public_html/js/`
    *   `public_html/WEB-INF/adfc-config.xml` -> `ViewController/WEB-INF/adfc-config.xml` (You can also just edit your `adfc-config.xml` file and add necessary definitions).
    *   `adfmscr/view/AdfFacesUtil.java` -> `ViewController/adfmscr/view/AdfFacesUtil.java`
    *   `adfmscr/view/Launcher.java` -> `ViewController/adfmscr/view/Launcher.java`
    *   `adfmscr/view/pageDefs/NavigationPageDef.xml` -> `ViewController/adfmscr/view/pageDefs/NavigationPageDef.xml`

4.  **Run the Generator**: The final step is to run the generator by right-clicking on either the Model or ViewController project and selecting `Generate ADF Faces`. Subsequently, if you make any changes to your model, simply repeat step 4; there's no need to rerun steps 1-3.

# Sample Application

Finally, I will [share](http://codingwithpassionblog.googlecode.com/files/Application1.zip) the complete application I used in the videos, which might prove useful.

Thank you.
```