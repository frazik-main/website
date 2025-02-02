---
layout: post
title: PL/SQL Collections: A Comprehensive Guide
date: 2010-03-03 10:00:00 # Replace with actual date
description: A detailed explanation of associative arrays, nested tables, and VARRAYs in PL/SQL, including examples and best practices.
tags: PL/SQL, collections, associative arrays, nested tables, VARRAY, Oracle
categories: Database, Programming
---

It's surprising how few database programmers truly understand and utilize collections in PL/SQL.  They often favor a more SQL-like approach, overlooking potential performance gains and improvements in code readability.

With collections, you can significantly enhance performance by caching frequently accessed data within a single program.  Data processing can also be sped up, eliminating the need for relational tables or global temporary tables.

While PL/SQL collections might seem cumbersome and confusing (especially compared to collections in languages like Java), they offer powerful capabilities.  There are three main types:

**Associative Arrays**

These are single-dimensional, unbounded, and sparse collections of homogeneous elements.  They don't need to be filled sequentially.  The following example demonstrates declaration, population, and iteration:

```sql
SET SERVEROUTPUT ON

DECLARE
    TYPE names_list_t IS TABLE OF VARCHAR2(255)
        INDEX BY PLS_INTEGER;
    people names_list_t;

    l_row PLS_INTEGER; -- Same type as index.

BEGIN

    people(1)         := 'Bob';
    people(33)        := 'Bruce';
    people(43)        := 'Rocky';
    people(-12)        := 'Grozni';
    people(1555555)   := 'Ivan';

    l_row := people.FIRST;

    WHILE (l_row IS NOT NULL)
    LOOP
        DBMS_OUTPUT.put_line(people(l_row));
        l_row := people.NEXT(l_row);
    END LOOP;
END;
/
```

Associative arrays are the most efficient type. However, they cannot be stored directly in database tables (use nested tables or VARRAYs for that).  They are the only practical choice for sparse collections or when negative index subscripts are required.


**Nested Tables**

These are also single-dimensional and unbounded collections of homogeneous elements.  They start dense but can become sparse through deletions.  Nested tables are *multisets*, meaning element order isn't inherent. This can be problematic if order needs to be preserved (use VARRAYs for that). While you can use keys and indexes, VARRAYs provide a more straightforward solution for maintaining order.

The following example shows how to declare a nested table type at the schema level, declare nested tables based on that type, create their union, and display the result:

```sql
CREATE OR REPLACE TYPE car_names_list_t IS TABLE OF VARCHAR2(100);

DECLARE
    great_cars          car_names_list_t := car_names_list_t();
    not_so_great_cars   car_names_list_t := car_names_list_t();

    all_this_cars       car_names_list_t := car_names_list_t();

BEGIN
    great_cars.EXTEND(3);
    great_cars(1) := 'Golf';
    great_cars(2) := 'Impreza';
    great_cars(3) := 'Focus';

    not_so_great_cars.EXTEND(2);
    not_so_great_cars(1) := 'Zastava';
    not_so_great_cars(2) := 'Dacia';

    all_this_cars := great_cars MULTISET UNION not_so_great_cars;

    FOR l_row IN all_this_cars.FIRST .. all_this_cars.LAST
    LOOP
        DBMS_OUTPUT.put_line(all_this_cars(l_row));
    END LOOP;

END;
/
```

`EXTEND` is used to increase the size of nested tables.  `MULTISET UNION` (and others like `MULTISET EXCEPT`) are used for high-level set operations.  In such cases, `EXTEND` is often unnecessary.

Nested tables are beneficial for high-level set operations, especially in older Oracle databases (<= 10g). They are also the only option for storing large amounts of persistent data in a collection column because the database creates an underlying table.


**VARRAYs (Variable-Size Arrays)**

Similar to the other two, VARRAYs are single-dimensional collections of homogeneous elements. However, they are always bounded (have a maximum size) and never sparse.  When declaring a VARRAY type, you must specify the maximum number of elements.  A key difference from nested tables is that VARRAYs preserve element order when stored as database columns.

This example demonstrates basic VARRAY usage:

```sql
SET SERVEROUTPUT ON

DECLARE
    TYPE anime_movies_t IS VARRAY (3) OF VARCHAR2(100);

    anime_movies anime_movies_t := anime_movies_t();

BEGIN
    -- Extend to accommodate the first element
    anime_movies.EXTEND(1);
    anime_movies(1) := 'Akira';
    -- Extend to the full length
    anime_movies.EXTEND(2);
    anime_movies(2) := 'Castle in the sky';
    anime_movies(3) := 'My neighbour Totoro';

    -- Loop or perform other operations here
END;
/
```

Remember to use `EXTEND` to make room for elements.

Use VARRAYs when you need to preserve element order in a database column, have a relatively small amount of data, don't need to worry about deletions in the middle, have an intrinsic upper bound, or need to retrieve the entire collection at once.

As a final tip, when working with PL/SQL collections, consider creating a package of procedures and functions to encapsulate collection management.  This might even hide the underlying collection type, but that's not always necessary or beneficial.
