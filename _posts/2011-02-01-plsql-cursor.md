---
layout: post
title: "PL/SQL Cursors - Implicit vs. Explicit"
date: 2011-02-01 11:58:00
description: "An introduction to PL/SQL cursors, differentiating between implicit and explicit cursors, their usage, and best practices with code examples."
tags: plsql, oracle, cursors, database, programming, sql
categories: oracle-plsql
---

## Introduction

PL/SQL provides a number of different ways for data retrieval, all of which involve working with **cursors**. You can think of a **cursor** as a pointer to the results of a query run against one or more tables in the current database. PL/SQL cursors and Java Database Connectivity (JDBC) cursors also share some similarities. Now that Oracle has acquired Sun, it's only a matter of time before we see a natural mapping between JDBC cursors and PL/SQL cursors!

This is, of course, a joke. These concepts should never be mixed, as the JDBC specification is designed to be vendor-independent, aiming to _prevent_ vendor lock-in. The core principle of Java involves clever interfaces and delegating vendor-specific functionalities to the vendor.

Let's return to the main point of this tutorial.

Why use cursors? When you retrieve a subset of data from a table (or even an entire table), that data remains stored in the SGA (Shared Global Area) until the cursor is closed. This mechanism effectively caches data, and database-level caching is generally a good practice.

## Choosing Explicit or Implicit Cursors in PL/SQL

**Implicit cursors** are used when you have a simple `SELECT ... INTO` statement retrieving a single row of data into local program variables. It's the easiest path to your data, but it can often lead to coding the same or similar `SELECT` statements in multiple places in your code.

**Explicit cursors** are defined in the declaration section (of a package or block). With an explicit cursor, you can open and fetch from the cursor in one or more places.

An implicit cursor will run more efficiently than an equivalent explicit cursor (from Oracle 8 Database onwards). So, are there reasons to use explicit cursors at all? Of course. Explicit cursors can still be more efficient in certain scenarios, and they also offer significantly more programmatic control.

## Implicit Cursors

Implicit cursors are used when you need to retrieve a single row from the database. If you want to retrieve more than one row, then you must use either an explicit cursor or **bulk collect**.

Here is an example of implicit cursor usage:

```plsql
SET serveroutput on;

DECLARE

   PROCEDURE find_employee (employee_id_v employees.employee_id%TYPE)
   IS
      -- Record into which we will fetch the entire row.
      emp_rec   employees%ROWTYPE;
   BEGIN
      -- Beginning of implicit cursor statement.
      SELECT *
        INTO emp_rec -- Fetch into record.
        FROM employees
       WHERE employee_id = employee_id_v;
       -- Write result.
      DBMS_OUTPUT.put_line (emp_rec.employee_id || ' ' || emp_rec.first_name);
   -- Catch exception when there is no such employee.
   EXCEPTION
      WHEN NO_DATA_FOUND
      THEN
         DBMS_OUTPUT.put_line ('Unknown employee with id: ' || employee_id_v);
   END find_employee;
BEGIN
   find_employee (101);
   find_employee (102);
   -- This will produce an exception (assuming an employee with ID 1021 does not exist).
   find_employee (1021);
END;
```

We encapsulate the query within a procedure (this is _always_ a good idea). This procedure prints employee information from the database to the _output_. We also introduce some exception handling (for cases where no employee is found).

Because PL/SQL is so tightly integrated with the Oracle database, you can easily retrieve complex data types (such as an entire row, as demonstrated in our example).

You can see that using an implicit cursor is quite simple: with a basic understanding of SQL, we merely create a simple `SELECT` statement and insert the rowset into a record (which we declared as a local variable).

## Explicit Cursors

An explicit cursor is explicitly defined in the declaration section. With an explicit cursor, you have complete control over the different PL/SQL steps involved in retrieving information from the database. You decide when to **open**, when to **fetch**, how many records to fetch, and when to **close** the cursor. Information about the cursor's current state is available by examining its attributes.

Example:

```plsql
SET SERVEROUTPUT on;

DECLARE
   PROCEDURE get_all_employees
   IS
      -- Employee record variable.
      employee_rec   employees%ROWTYPE;
      -- Cursor variable for explicit use.
      CURSOR employee_cur
      IS
         SELECT *
           FROM employees;
   BEGIN
      -- Open cursor so you can use it.
      OPEN employee_cur;
      -- Iterate through all employees.
      LOOP
         -- Load current row from cursor into employee record.
         FETCH employee_cur
          INTO employee_rec;
         -- Loop until the cursor attribute signals that no more rows are found.
         EXIT WHEN employee_cur%NOTFOUND;
         DBMS_OUTPUT.put_line (   employee_rec.employee_id
                               || ', '
                               || employee_rec.first_name
                              );
      END LOOP;

      CLOSE employee_cur;
   EXCEPTION
      -- Remember to close the cursor even if an error occurs.
      WHEN OTHERS
      THEN
         IF employee_cur%ISOPEN
         THEN
            CLOSE employee_cur;
         END IF;
   END get_all_employees;
BEGIN
   get_all_employees ();
END;
```

This PL/SQL block performs the following:

- Declares the cursor.
- Declares a record based on that cursor.
- Opens the cursor.
- Fetches rows until no more rows are left.
- Closes the cursor.
- Handles exceptions and closes the cursor if it is not already closed.

You can see that in this way, we have complete control over the _cursor_ variable, its initialization, fetching, and so on.
