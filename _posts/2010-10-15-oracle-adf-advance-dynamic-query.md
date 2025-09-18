---
layout: post
title: "Dynamically Changing SQL WHERE Clause in ADF View Objects"
date: 2010-10-15 12:12:00
description: "This post describes how to dynamically modify the SQL WHERE clause in an ADF View Object by overriding the `buildWhereClause` method, which is particularly useful for optimizing queries without creating new database indexes."
tags: adf, view-object, sql, where-clause, dynamic-sql, java, override
categories: adf-development
---

## Introduction

Sometimes, you may encounter requirements that necessitate dynamically changing the SQL query's `WHERE` clause within an ADF View Object. I faced such a requirement when a customer prohibited the creation of additional indexes on a table. I overcame this problem by dynamically modifying the SQL query's `WHERE` clause to leverage existing indexes.

## Overriding buildWhereClause

To implement this functionality, you need to override the `buildWhereClause(StringBuffer sqlBuffer, int noBindVars)` method in your View Object's implementation class.

You use the `sqlBuffer` parameter within this method (which contains the SQL query's `WHERE` clause as a `StringBuffer`) to modify the SQL according to your needs. Simply replace, remove, or add strings within this parameter.

Remember to use the same bind variable names that will be used in the View Object's SQL call (generic bind variable names typically follow the pattern `:vc_temp_1, :vc_temp_2, ...`).

## Example Code

Here's an example of how to override the method:

```java
@Override
protected boolean buildWhereClause(StringBuffer sqlBuffer, int noBindVars) {

    // Call super and see if there is an existing WHERE clause.
    boolean hasWhereClause = super.buildWhereClause(sqlBuffer, noBindVars);

    if (hasWhereClause) {
        // Modify the existing WHERE query.
        // Example: sqlBuffer.append(" AND some_column = :vc_temp_3");
    } else {
        // If you add a new WHERE clause, ensure to return true.
        // Example: sqlBuffer.append(" some_column = :vc_temp_1");
        hasWhereClause = true; // Set to true if a new clause is added
    }

    return hasWhereClause;
}
```
