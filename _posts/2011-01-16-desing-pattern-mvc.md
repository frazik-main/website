---
layout: post
title: MVC Concept
date: 2011-01-16 20:51:00
description: An in-depth look at the Model-View-Controller (MVC) architectural pattern, its core components, application in web development, particularly with JSP and Servlets, and a discussion on related frameworks.
tags: mvc, java, jsp, servlets, web-development, design-patterns, programming, java-ee
categories: java-ee, design-patterns
---

## MVC Concept

The MVC pattern is a simple and highly useful pattern for context representation. Representation can be of any kind, from text-based consoles (e.g., [OBERON OS](<http://en.wikipedia.org/wiki/Oberon_(operating_system)>)) to modern GWT-based applications.

You can download sample code from [my Google Code repository](http://codingwithpassionblog.googlecode.com/files/MVCPatternCWP.zip).

The MVC approach divides components into three kinds:

- **Model**: This holds the data we wish to represent and encapsulates the business logic of an application. It bundles business rules into components (e.g., JavaBeans in JSP/Servlets MVC applications).
- **View**: This presents data on the screen (renders the model). The model is rendered in a way that enables interaction with its data and operations.
- **Controller**: This reacts to user input. Based on the selected input, it makes decisions for invoking specific calls on model components (e.g., updating the model) and selecting the appropriate view for displaying updated or existing data.

Due to the limitations of web architecture (pages are refreshed only when users request them), we cannot fully utilize the **push** model of MVC. With this model, data would have the "power" to update views. For example, if you have two simultaneous users accessing the same web page and data, and one of them updates part of the data, that update would ideally be available immediately to the other user. We all know this doesn't happen by default, but there are some techniques (please see [this Oracle description](http://download.oracle.com/docs/cd/E15523_01/web.1111/b31974/adv_ads.htm) for methods that enable this, such as long polling).

So, what can we do to achieve a fully functional MVC design in our JEE application? We can (as many frameworks do) use the **pull** model design concept. With this model, the **view** _pulls_ data from the model as the user initiates a request. Alternatively, we can wait for WebSockets to be properly implemented by all browser vendors, complying with the HTML5 specification. As we know, all browsers are beautifully aligned with W3C specs, so no problem there! :)

Note: If you still want to use some cutting-edge HTML5 features, please use libraries (like jQuery, Prototype) right away. This way, when the HTML5 spec changes (and it will!), you just need to upgrade your library. :) I will also do some tutorials later on jQuery (maybe jQuery Mobile?) and full-fat client JavaScript applications that can leverage HTML5 features.

Whatever strategy we use, MVC architecture still delivers its key benefits. These are:

- Each component has clear responsibility.
- Models contain no view-specific code.
- Views contain no control code or data-access code and concentrate on data display.
- Controllers create and update models; they do not depend on particular view implementations.

## MVC Using JSP and Servlets

Servlets are good at data _processing_ (reading data, communicating with databases, invoking business services). JSPs, on the other hand, are good at _presentation_ of data (building HTML to present the results of a request). So, it is natural to combine these two Java EE core concepts for MVC implementation.

The original request is handled by a servlet. The servlet invokes the business services (we could use Spring for initializing business service objects, but it would be overkill for this example) components, which perform data access and create beans to represent the result (this is the _model_). Then, the servlet decides which JSP page is appropriate to present those particular results and forwards the request there (this is where JSP pages play their part - the _view_). The servlet decides what business logic code applies and which JSP page should present it (so the servlet is the _controller_).

## Simple (but Really Simple) MVC Example

In this example, a user will choose a product to buy on the first page. When a user selects (or submits without selecting) a product, the _servlet RequestDispatcher_ (controller) will determine which JSP page (view) to forward the request to, and place the product Data Transfer Object (DTO) (model) into the request scope attribute.

Here are a couple of images:

The first image shows a list of products. The second image shows the JSP page that is displayed after the controller decides which view to show (you can see here that we do not have a sufficient amount of that product in stock, so we suggest the customer buy another product).

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi036PkWWvVkY9pSmzD83pn3A-RNK4T8U_50YdFIfy0KBUd-b31VlK0WpGrr0nlU_uxOmYhOtskCBFmU_vpYhGSbb7uXuVGCLYMx3dAD19CwbPJSAFy_bl4cvUiPBFbUv9d5xDFAUmT_rxV/s1600/1.GIF" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="158" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi036PkWWvVkY9pSmzD83pn3A-RNK4T8U_50YdFIfy0KBUd-b31VlK0WpGrr0nlU_uxOmYhOtskCBFmU_vpYhGSbb7uXuVGCLYMx3dAD19CwbPJSAFy_bl4cvUiPBFbUv9d5xDFAUmT_rxV/s320/1.GIF" width="320" /></a></div>
<br />
<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1cDOI5CNlHXnaAM18-043rgzu7rLp9ksxv9fTGDsNRTxzs0xs8tCuw7z01NXY5JcaNNaiqM7oH6UA2I-flD1m4SIGeXhhOEmaEXyp6PlynNiYwI0X6PU2tSrK9jyQ-l2aZF7vh8uiUsqs/s1600/2.GIF" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="59" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1cDOI5CNlHXnaAM18-043rgzu7rLp9ksxv9fTGDsNRTxzs0xs8tCuw7z01NXY5JcaNNaiqM7oH6UA2I-flD1m4SIGeXhhOEmaEXyp6PlynNiYwI0X6PU2tSrK9jyQ-l2aZF7vh8uiUsqs/s320/2.GIF" width="320" /></a></div>
<br />

Here is the controller servlet code:

```java
protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        //get parameter
        String param = request.getParameter("productId");
        //check if null
        int productId = param != null ? Integer.parseInt(param) : 0;

        Product product = Product.findProduct(productId);

        String forwardAddress = "/NoProduct.jsp";

        if (product != null) {
            request.setAttribute("currentProduct", product);

            if (product.getAmount() < 10) {
                forwardAddress = "/LowAmount.jsp";
            } else if (product.getAmount() > 10) {
                forwardAddress = "/SufficientAmount.jsp";
            }
        }
        RequestDispatcher dispatcher =
                request.getRequestDispatcher(forwardAddress);
        dispatcher.forward(request, response);
    }
```

As you can see, first, we get the chosen product ID (if any), and then we choose the appropriate JSP page for that product based on its amount. If the user does not choose any product, the "NoProduct.jsp" page will be displayed.

The `Product` class is quite simple (it's a DTO with a static initialization block):

```java
package org.codingwithpassion.model;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author jan.krizan
 */
public class Product {

    private static Map products;

    /*
     * Executes on class load (only once).
     */
    static {
        products = new HashMap();

        products.put(1, new Product(1, "Square ball", 12, 122));
        products.put(2, new Product(2, "Invisible cup", 1223, 12234));
        products.put(3, new Product(2, "Vitamins", 1, 2));

    }
    private int id;
    private String name;
    private int price; // Changed 'age' to 'price' for consistency
    private int amount;

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Product(int id, String name, int price, int amount) { // Changed 'age' to 'price'
        this.id = id;
        this.name = name;
        this.price = price;
        this.amount = amount;
    }

    /*
     * Required no-argument constructor.
     */
    public Product() {
    }

    public int getPrice() { // Changed 'getAge' to 'getPrice'
        return price;
    }

    public void setPrice(int price) { // Changed 'setAge' to 'setPrice'
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public static Product findProduct(int id) {
        return (Product) products.get(id);
    }
}
```

## Final Remarks

It is not necessary to use MVC throughout the entire web application (a "GOD servlet" is generally not a good idea). You can apply MVC in places where you think you will gain the most benefit from this pattern, and use simple JSPs elsewhere.

A controller servlet in MVC _does not_ create any output; the output should be handled only by JSP pages (or any other view technology). So remember, servlets do not call `response.setContentType`, `response.getWriter`, etc.

You can **forward** (using a dispatcher) or you can **redirect** (using `response.sendRedirect`) to transfer control from a controller servlet to a view (JSP page).

When you use **forward**, control is transferred entirely on the server (no network traffic), and the user does not see the address of the destination JSP page. You should place JSP pages into the WEB-INF directory if they are meant to be accessed only via a controller servlet.

When you use **redirect**, control is transferred by sending the client a `302` status code together with a `Location` response header. This requires additional network traffic, and the user sees the address of the destination JSP page.

A final remark (of final remarks) is about pointing out that you are not limited to using _request scope_; you can also use _session or application scope_. However, remember to synchronize scope usage declarations in the servlet and JSP page.

## Out of the Box MVC Frameworks

I must admit that I'm not a big fan of Java web frameworks. I understand that they help in organization and workload distribution in complex development endeavors, but for small projects, they are often overkill. They add complexity, but on the other hand, they introduce good patterns and common-sense guidelines.

This Model-2 MVC architecture is quite powerful and serves as a good core pattern for most simple to mid-sized projects. If you are developing a reasonably complex Java web application, consider Struts 2 or Spring MVC (the most popular action-based frameworks).

```

```
