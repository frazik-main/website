---
layout: post
title: Caching Data in PL/SQL
date: 2010-09-03
description: How to effectively cache static data in PL/SQL using collections
tags: plsql oracle database caching performance
categories: technical-posts
---

### Introduction to Data Caching in PL/SQL

In many PL/SQL applications, you often need to retrieve the same data from the database repeatedly. Sometimes, this data is static - like codes and descriptions that rarely (if ever) change. If the data isn't changing - especially during a user session - why query the database repeatedly for the same information?

The solution is to create a collection stored in the session's PGA. By querying the static data once and storing it in a collection, you can use the collection's index as an _intelligent key_ for subsequent lookups.

Here's a practical example:

```plsql
CREATE OR REPLACE PACKAGE onlyonce AS

    TYPE names_t IS
    TABLE OF employees.first_name%TYPE
            INDEX BY PLS_INTEGER;

    names names_t;

    FUNCTION get_name(employee_id_in IN employees.employee_id%TYPE)
        RETURN employees.first_name%TYPE;

END onlyonce;
/

CREATE OR REPLACE PACKAGE BODY onlyonce AS

    FUNCTION name_from_database(employee_id_in IN employees.employee_id%TYPE)
            RETURN employees.first_name%TYPE
        IS
            local_names employees.first_name%TYPE;
     BEGIN
        SELECT first_name
            INTO local_names
            FROM employees
           WHERE employee_id = employee_id_in;
        RETURN local_names;
     END;

    FUNCTION get_name(employee_id_in IN employees.employee_id%TYPE)
        RETURN employees.first_name%TYPE
    IS
        return_value employees.first_name%TYPE;
    BEGIN
        RETURN names(employee_id_in);
    -- While this approach might seem like a hack, it's effective
    EXCEPTION
        WHEN NO_DATA_FOUND
        THEN
            names(employee_id_in) := name_from_database(employee_id_in);
            RETURN names(employee_id_in);
    END;

END onlyonce;

SET SERVEROUTPUT ON

BEGIN
    FOR j IN 1..10 LOOP
        FOR i IN 100..150 LOOP
            DBMS_OUTPUT.put_line(onlyonce.get_name(i));
        END LOOP;
    END LOOP;
END;
```

Let's break down this example (which uses the HR schema):

1. **Collection Declaration (Lines 3-7)**

   - Declares a collection type and collection to hold cached data

2. **Database Retrieval Function (Lines 16-26)**

   - Function to retrieve data from the database one record at a time

3. **Main Retrieval Function (Line 28)**

   - Returns value either from the database or from the collection
   - Takes the employee ID as its only parameter
   - Determines whether to return cached or fresh data

4. **Caching Logic (Lines 32-40)**

   - The core of the caching mechanism
   - If the element isn't found in the collection, it retrieves it from the database
   - Subsequent requests for the same ID return the cached value

5. **Test Loop (Lines 46-52)**
   - Demonstrates the caching behavior
   - First iteration of the outer loop pulls data from the database
   - All subsequent iterations retrieve data from the collection

### Performance Impact

The performance improvement from this caching approach is significant:

- Regular database queries: ~2 seconds for 10,000 queries
- Cached collection access: ~0.1 seconds for 10,000 queries

This represents an order of magnitude improvement in performance. Beyond speed, caching static data also improves code quality by implicitly documenting static structures in your program.
