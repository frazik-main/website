---
layout: post
title: Caching Static Data in PL/SQL for Performance Improvement
date: 2010-09-03 10:00:00 # Replace with actual date
description: Optimize PL/SQL performance by caching static data in a collection stored in the session's PGA.
tags: plsql, oracle, performance, caching, collections
categories: database, performance-tuning
---

In many applications, PL/SQL programs repeatedly access the same data from a database. If this data is static (rarely or never changes), repeatedly querying it is inefficient. A better approach is to cache this data in a collection stored within the session's PGA. This method uses the collection's index as an "intelligent key," retrieving data quickly without repeated database queries.

Consider the following example:

```sql
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
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL; -- Handle case where employee ID is not found
    END;

    FUNCTION get_name(employee_id_in IN employees.employee_id%TYPE)
        RETURN employees.first_name%TYPE
    IS
        return_value employees.first_name%TYPE;
    BEGIN
        RETURN names(employee_id_in);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            names(employee_id_in) := name_from_database(employee_id_in);
            RETURN names(employee_id_in);
    END;

END onlyonce;
/

SET SERVEROUTPUT ON

BEGIN
    FOR j IN 1..10 LOOP
        FOR i IN 100..150 LOOP
            DBMS_OUTPUT.put_line(onlyonce.get_name(i));
        END LOOP;
    END LOOP;
END;
/
```

Let's break down the code:

**Lines 3-7:** Declare a collection type (`names_t`) and a collection (`names`) to hold cached data.

**Lines 16-26:** `name_from_database` function retrieves data from the database one by one. Improved to handle `NO_DATA_FOUND` exception gracefully by returning `NULL`.

**Line 28:** Declaration of the main retrieval function (`get_name`). This function returns data either from the database or the collection, depending on whether the key exists in the collection. The only parameter is the employee ID.

**Lines 32-40:** The core caching logic. If an element with the given ID isn't in the collection, it's fetched from the database and added to the collection. The exception handling is improved to return `NULL` if the employee ID is not found in the database.

**Lines 46-52:** The code iterates through a range of employee IDs. The first iteration fetches data from the database; subsequent iterations retrieve data from the collection.

**Performance Comparison:** In testing, executing 10,000 queries against a table took approximately 2 seconds, while retrieving the same data from the collection took only 0.1 seconds�a significant performance improvement (an order of magnitude faster). Caching static data also improves code quality by implicitly documenting static structures within the program.
