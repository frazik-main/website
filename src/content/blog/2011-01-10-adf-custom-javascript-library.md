---
layout: post
title: "Why jQuery and ADF Faces?"
date: 2011-01-10 14:15:00
description: "This post explores how to integrate the jQuery JavaScript library with Oracle ADF Faces applications, providing steps for including jQuery globally or on specific pages, and tips for locating ADF components."
tags: jquery, adf-faces, jsf, javascript, oracle
categories: web-development, javascript, oracle-adf
---

jQuery, as we all know, is a powerful JavaScript library capable of amazing things. Oracle ADF Faces, which is based on the Apache MyFaces Trinidad JSF library, offers a very useful and feature-rich JSF implementation. However, there are times when you might prefer not to follow all ADF framework conventions and instead solve your problem by programming solutions directly on the client-side using JavaScript and jQuery.

## Steps

Of course, first [download jQuery](http://code.jquery.com/jquery-1.4.4.js) from the jQuery site. I personally prefer the uncompressed version, especially when using ADF Faces for applications primarily within firewalls and with high bandwidth connections.

Next, create a `lib` folder in your ADF application (specifically, inside the `Web Content` folder of your `View Controller Project`). Place the jQuery library there.

If you want to have access to the jQuery library in all your JSPX pages, add the following tag to your template (before `af:pageTemplateDef`):

```xml
<trh:script id="jQueryJs" source="#{pageContext.request.contextPath}/js/jquery-1.4.2.min.js">
</trh:script>
```

In this way, you can load the jQuery JavaScript library from its absolute path (using the request object).

If you want to include jQuery in a single page (JSPX), then use `af:resource` (inside `af:document`) as follows:

```xml
<f:facet name="metaContainer">
  <af:group>
    <af:resource type="javascript" source="/js/jquery-1.4.2.min.js"/>
  </af:group>
</f:facet>
```

Using the `metaContainer` facet and `af:group` is the recommended Oracle method for loading JavaScript libraries.

## Finding Components

To find specific ADF components (or standard HTML components), you can use either the `id` property of ADF components or the class attributes defined by ADF Faces.

It can be a little tricky to find a specific component (because ADF Faces can be complex on the browser side), but tools like Firebug can help by identifying specific components and displaying their name or ID value.
