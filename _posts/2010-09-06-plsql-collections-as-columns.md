---
layout: post
title: Storing Collections in Database Columns
date: 2010-09-06 10:00:00 # Replace with actual date
description: Demonstrates how to store collections in database columns using Oracle's VARRAY.
tags: oracle, plsql, database, collections, varray, nested table
categories: database-design
---

This post demonstrates how to store collections in database columns within a relational table. This technique is useful for persisting collection data without creating additional detail tables. While common in object databases like Google App Engine Bigtable, this approach is also applicable to relational databases.

### Simple Example

This example uses a `VARRAY` (you can also use a nested table � see [this article](http://codingwithpassion.blogspot.com/2010/09/oracle-plsql-collections.html) about PL/SQL collections) as a column in a relational table.

First, a schema-level collection type `varchar_collection_t` is declared, capable of holding up to four `VARCHAR2` elements. Then, a table `animes` is created with a column `characters` of this collection type. Finally, a collection is populated and inserted into the `animes` table.

```sql
CREATE TYPE varchar_collection_t IS VARRAY(4) OF VARCHAR2(100);
/

CREATE TABLE animes (
    name VARCHAR2(255),
    characters varchar_collection_t
);

DECLARE
    anime_characters varchar_collection_t := varchar_collection_t();
BEGIN
    anime_characters.EXTEND(4);

    anime_characters(1) := 'Satsuki';
    anime_characters(2) := 'Mei';
    anime_characters(3) := 'Totoro';
    anime_characters(4) := 'Kanta';

    INSERT INTO animes (name, characters)
    VALUES ('My Neighbor Totoro', anime_characters);

END;
/
```

As shown, a simple `INSERT` statement is used to insert the collection into the table. `VARRAY` columns store collection data inline (similar to comma-separated values), while nested tables create a separate database table behind the scenes. Oracle recommends `VARRAY` for smaller arrays and nested tables for larger ones.

One important note: you cannot directly manipulate data within a stored collection. You need to use `CAST` and `TABLE` syntax. This example shows how to filter using data from the collection:

```sql
SELECT * FROM animes a
WHERE 'Mei' IN (SELECT * FROM TABLE(a.characters));
```

Notice the use of the `TABLE` syntax. Even with only one row in the table, this demonstrates the concept effectively.
