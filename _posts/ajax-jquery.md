---
layout: post
title: Implementing AJAX with jQuery's load() Method
date: 2010-12-13 22:13:00
description: A comprehensive guide to AJAX, comparing plain JavaScript with jQuery, and demonstrating how to use jQuery's powerful load() method for dynamic content updates. Includes cross-browser XMLHttpRequest handling, jQuery load() examples, and best practices for GET vs. POST requests.
tags: ajax, jquery, javascript, web-development, front-end, programming
categories: javascript, web-development
---

## Introduction

AJAX is a simple technique for refreshing a browser's DOM with data acquired from some kind of server (Servlet/JSP, PHP, ASP.NET, etc.). There is nothing especially clever about this technique.

AJAX is a less recent addition to the web toolbox than many people may realize. In 1998, Microsoft introduced the ability to perform asynchronous requests as an ActiveX control (part of Outlook Web Access).

A few years later, Microsoft browsers introduced the standardized `XMLHttpRequest` object (though at the time, everything was flavored with XML!). These days, XML is rarely used with AJAX requests; instead, JSON or simple HTML are preferred. Google coined the term AJAX (Asynchronous JavaScript and XML), and the rest, as they say, is history.

You can download an example from this tutorial from my Google Code [SVN repository](http://codingwithpassionblog.googlecode.com/files/AjaxExampleCWP.zip).

## Plain JavaScript VS jQuery

Implementing AJAX using plain JavaScript (especially cross-browser solutions) is not straightforward. In a perfect world, code written for one browser would work in all commonly used browsers. However, we do not live in a perfect world, and Internet Explorer, in particular, handled AJAX differently. The main problem lies in creating an instance of the `XMLHttpRequest` object.

Let me provide some quick insight into what you need to do to simply get an instance of this object in plain (cross-browser) JavaScript:

```javascript
var xhr;
if (window.ActiveXObject) {
  xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
else if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
}
else {
  throw new Error("This browser is not AJAX enabled.");
}
```

There are a couple of other things you need to consider when you handle AJAX using plain JavaScript. One is encoding, another is creating a handler for the response, and so on.

Now, the jQuery code for an AJAX request and getting a response is as follows:

```javascript
$('#driverSelectionControl').load('/AjaxExampleCWP/actions/driversList.jsp');
```

I think we have a winner! So, we will be using jQuery from now on and leveraging its great capabilities.

## jQuery load() method

Perhaps one of the most common uses of AJAX is to grab a chunk of content from the server and insert it into the DOM at a strategic location. jQuery does just that, loading HTML code into a wrapper set using its `load()` method. It sounds simple, and it is simple!

Let's go straight to the example:

We have a page select component populated with F1 race driver names. When you select a different driver, their details will be pulled from the server and appended to the DOM without a page refresh. An interesting detail in this example is that the HTML select component itself is also populated using AJAX.

Code for initial page DOM:

![Initial Page DOM](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghVm38gyYMRX6pome72zKtZwdS8z1SXanIsO_mWVfDQIBBc71Ep79v-0RmI84gKRUF8o2rPBb62W2GzWkcMfUsCpHuGygm4qMJTPF9P-siiZM2ICOGOwPcIotWJ3IryW60_puLvIDjFaZ/s320/1.GIF)

Now I will show you the code for the AJAX functionality and explain it afterwards.

```javascript
$(function() {
  $('#driverSelectionControl').load('/AjaxExampleCWP/actions/driversList.jsp');

    $('#driverSelectionControl').change(function(event) {
      $('#driverDetailPanel').
        load('/AjaxExampleCWP/actions/driversDetails.jsp',
             {driverId : $(event.target).val()});
    });
});
```

**Line 02:** Loads HTML option components into the select component. You see how easy it is to use AJAX with jQuery! We just need to provide the URL to the JSP page.

Here is the JSP page for the driver list:

```html
<option value=""></option>
<option value="001">Lewis Hamilton</option>
<option value="002">Fernando Alonso</option>
<option value="003">Michael Schumacher</option>
```

That's it. All this JSP page does is render the option components.

**Lines 04-08 (from the previous example):** Here, we handle the change event. When the user selects another driver (i.e., the value changes), we then load their details from `driversDetails.jsp`. We identify the user by passing a parameter (`driverId`) to the JSP page.

Here's what the JSP page looks like:

```html
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:usebean class="java.util.HashMap" id="item">
<c:choose>
    <c:when test="${param.driverId == '001'}">
        <c:set property="name" target="${item}" value="Lewis Hamilton"></c:set>
        <c:set property="team" target="${item}" value="McLaren"></c:set>
        <c:set property="podiums" target="${item}" value="36"></c:set>
        <c:set property="points" target="${item}" value="496"></c:set>
        <c:set property="birth" target="${item}" value="07/01/1985"></c:set>
    </c:when>
    <c:when test="${param.driverId == '002'}">
        <c:set property="name" target="${item}" value="Fernando Alonso"></c:set>
        <c:set property="team" target="${item}" value="Ferrari"></c:set>
        <c:set property="podiums" target="${item}" value="63"></c:set>
        <c:set property="points" target="${item}" value="829"></c:set>
        <c:set property="birth" target="${item}" value="29/07/1981"></c:set>
    </c:when>
    <c:when test="${param.driverId == '003'}">
        <c:set property="name" target="${item}" value="Michael Schumacher"></c:set>
        <c:set property="team" target="${item}" value="Mercedes GP"></c:set>
        <c:set property="podiums" target="${item}" value="154"></c:set>
        <c:set property="points" target="${item}" value="1441"></c:set>
        <c:set property="birth" target="${item}" value="03/01/1969"></c:set>
    </c:when>
</c:choose>
<c:if test="${param.driverId != ''}">
<table><tbody>
<tr>         <th>Driver name</th>         <td>${item.name}</td>     </tr>
<tr>         <th>Team name</th>         <td>${item.team}</td>     </tr>
<tr>         <th>Podiums</th>         <td>${item.podiums}</td>     </tr>
<tr>         <th>Points</th>         <td>${item.points}</td>     </tr>
<tr>         <th>Date of Birth</th>         <td>${item.birth}</td>     </tr>
</tbody></table></c:if>
</jsp:usebean>
```

You can use POST (the default) or GET HTTP request methods with the `load()` method. If you want to use POST (as in this example), you send an object hash as a parameter to `load()` (for example: `{driverId: 205}`). If you want to initiate a GET request, you need to pass a query string. If you use GET, you must ensure that your string is properly formatted (names and values are URI-encoded).

If you are wondering when to use POST and when to use GET, then follow these recommendations:

Use a GET request when the operation, even if performed multiple times, makes no change to the state of the server (for example, when you are simply pulling data from the server). This means that our example contradicts this recommendation!
Use a POST request when the operation your request is initiating is *non-idempotent* (as opposed to *idempotent*, like in GET requests). This means you should use POST when you change some state on the server (e.g., changing or updating data).

## Other jQuery AJAX methods

jQuery includes other methods for AJAX functionality, such as `$.get()` and `$.post()` for explicit GET or POST request operations.

jQuery also provides a general utility function for making AJAX requests, named `$.ajax()`. Under the hood, all other jQuery AJAX features use this function. It is quite powerful, but also complex. Feel free to [investigate](http://api.jquery.com/jQuery.ajax/) this function if you are interested.
```