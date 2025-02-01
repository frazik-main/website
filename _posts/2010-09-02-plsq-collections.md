---
layout: post
title: Understanding PL/SQL Collections - Types and Usage
date: 2010-09-02 12:00:00
description: A comprehensive guide to different types of collections in PL/SQL
tags: plsql oracle database programming
categories: technical-posts
---

It's surprising how few database programmers truly understand or utilize collections in PL/SQL. Many tend to program in a SQL-centric way, potentially missing opportunities to improve performance and code readability.

Collections in PL/SQL offer several advantages:

- Cache frequently queried data within a single program
- Process data more efficiently without relying on relational tables or global temporary tables
- Improve code organization and maintainability

While PL/SQL collections might seem cumbersome compared to collections in languages like Java, understanding their types and use cases is crucial. Let's explore the three different types of collections.

### 1. Associative Arrays

Associative arrays are single-dimensional, unbounded, sparse collections of homogeneous elements. They don't need to be filled sequentially, offering flexibility in index usage.

Here's an example demonstrating declaration, population, and iteration:

```plsql
SET SERVEROUTPUT ON

DECLARE
    TYPE names_list_t IS TABLE OF VARCHAR2(255)
        INDEX BY PLS_INTEGER;
    people names_list_t;
    l_row PLS_INTEGER; -- Same type as index

BEGIN
    people(1)       := 'Bob';
    people(33)      := 'Bruce';
    people(43)      := 'Rocky';
    people(-12)     := 'Grozni';
    people(1555555) := 'Ivan';

    l_row := people.FIRST;
    WHILE (l_row IS NOT NULL)
    LOOP
        DBMS_OUTPUT.put_line(people(l_row));
        l_row := people.NEXT(l_row);
    END LOOP;
END;
```

Associative arrays are the most efficient collection type but cannot be stored in database tables. They're ideal for sparse collections or when negative index subscripts are needed.

### 2. Nested Tables

Nested tables are single-dimensional, unbounded collections that start dense but can become sparse through deletions. They are multisets, meaning elements have no inherent order.

Example of nested table usage with set operations:

```plsql
CREATE OR REPLACE TYPE car_names_list_t IS TABLE OF VARCHAR2(100);

DECLARE
    great_cars        car_names_list_t := car_names_list_t();
    not_so_great_cars car_names_list_t := car_names_list_t();
    all_these_cars    car_names_list_t := car_names_list_t();
BEGIN
    great_cars.EXTEND(3);
    great_cars(1) := 'Golf';
    great_cars(2) := 'Impreza';
    great_cars(3) := 'Focus';

    not_so_great_cars.EXTEND(2);
    not_so_great_cars(1) := 'Zastava';
    not_so_great_cars(2) := 'Dacia';

    all_these_cars := great_cars MULTISET UNION not_so_great_cars;

    FOR l_row IN all_these_cars.FIRST .. all_these_cars.LAST
    LOOP
        DBMS_OUTPUT.put_line(all_these_cars(l_row));
    END LOOP;
END;
```

Nested tables are particularly useful for:

- High-level set operations (especially in Oracle versions ≤10g)
- Storing large amounts of persistent data in column collections

### 3. VARRAYs (Variable-Sized Arrays)

VARRAYs are bounded, never-sparse collections that require a maximum size specification during declaration. Unlike nested tables, VARRAYs preserve element order when stored in database columns.

Example of VARRAY usage:

```plsql
SET SERVEROUTPUT ON

DECLARE
    TYPE anime_movies_t IS VARRAY(3) OF VARCHAR2(100);
    anime_movies anime_movies_t := anime_movies_t();
BEGIN
    -- Extend for first element
    anime_movies.EXTEND(1);
    anime_movies(1) := 'Akira';
    -- Extend for remaining elements
    anime_movies.EXTEND(2);
    anime_movies(2) := 'Castle in the Sky';
    anime_movies(3) := 'My Neighbor Totoro';
END;
```

VARRAYs are best suited when:

- Element order preservation is important
- Working with relatively small amounts of data
- The collection has a natural upper bound
- You need to retrieve the entire collection simultaneously

### Best Practice Tip

Consider creating a package to encapsulate collection management operations. This approach can:

- Standardize collection handling across your application
- Improve code maintainability
- Abstract implementation details when needed

While hiding the specific collection type might not always be the best approach, having a dedicated collection management package is generally beneficial.

<hr>

Understanding these collection types and their appropriate use cases can significantly improve your PL/SQL programming efficiency and code quality.
