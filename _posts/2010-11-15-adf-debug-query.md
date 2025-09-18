---
layout: post
title: Tracking SQL Queries in ADF Applications
date: 2010-11-15 12:46:00
description: Learn how to track and monitor SQL queries executed by View Objects in ADF applications by overriding the executeQueryForCollection method and extracting parameter values.
tags: adf, sql, performance, jdeveloper, java, viewobject, debugging, programming
categories: adf, programming, performance-tuning
---

## Introduction

Slow and poorly optimized `SELECT` queries are a common problem when developing ADF applications. To track SQL performance and other related issues, it's essential to be able to monitor the queries sent to the database.

## Solution

View Object performance issues are primarily connected with the execution of the `executeQueryForCollection` method, which populates the View Object with rows from the database.

To track all View Object queries that return collections, you need to override the `executeQueryForCollection` method in your View Object implementation. The best practice is to have a single global `ViewObjectImpl` at the top of your View Object hierarchy, which all other View Objects will extend.

To log these queries, you'll add the following code to your View Object implementation class:

```java
public void executeQueryForCollection(Object rowset, Object[] params, int noUserParams) {
    System.out.println("VO name: " + this.getFullName());
    System.out.println("Query is: " + this.getQuery());
    super.executeQueryForCollection(rowset, params, noUserParams);
}
```

You can use any debugging tool you prefer (e.g., Log4j); `System.out` is used here for convenience.

If you test this method, you'll notice that ADF only logs parameter names (like `:vc_temp1`, `:vc_temp2`, or similar placeholders), but the actual parameter values are missing.

To view these values, we need to inspect the second parameter of the `executeQueryForCollection` method. This parameter, populated by the framework, contains pairs of (name, value) for the parameters. It might seem a bit unusual to use an array of objects of arrays of objects (`Object[][]`) for saving parameters, but there must be a reason. We can extract these values using the following helper method:

```java
private void getParametersValues(Object[] params) {
    if (getBindingStyle() == SQLBuilder.BINDING_STYLE_ORACLE_NAME) {
        if (params != null) {
            for (Object param : params) {
                Object[] value = (Object[])param;
                System.out.println("Name=" + value[0] + "; Value=" + value[1]);
            }
        }
    }
}
```

You just need to integrate this helper method into your `executeQueryForCollection` override, and you'll have full query monitoring directly from your JDeveloper console:

```java
public void executeQueryForCollection(Object rowset, Object[] params, int noUserParams) {
    System.out.println("VO name: " + this.getFullName());
    System.out.println("Query is: " + this.getQuery());
    getParametersValues(params);
    super.executeQueryForCollection(rowset, params, noUserParams);
}
```
