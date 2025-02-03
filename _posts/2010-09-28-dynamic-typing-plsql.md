---
layout: post
title: Using PL/SQL's ANY Types for Dynamic Typing
date: 2010-09-28 10:00:00 # Replace with actual date
description: Exploring PL/SQL's ANY types for handling data of unknown type at runtime.
tags: plsql, anytype, anydata, dynamic-typing, oracle
categories: database, plsql
---

PL/SQL is a statically-typed language. Data types must be declared and checked at compile time. However, situations arise where dynamic typing is necessary. For these cases, PL/SQL introduced `ANY` types (starting in Oracle 9i). These dynamic data types allow manipulation of data whose type isn't known until runtime. The type is determined at runtime using introspection (e.g., the `gettype` function).

You cannot directly manipulate the internal structure of `ANY` types; procedures and functions are required. The main `ANY` type family members are:

- `AnyData` (holds a single value of any type, including built-in scalar datatypes and user-defined object types).
- `AnyType` (holds a type description).

The following example demonstrates a heterogeneous array of transport means using `SYS.AnyType`. Three user-defined types represent different transport types:

```sql
CREATE OR REPLACE TYPE airplane_o AS OBJECT (
    engine_type VARCHAR2(35),
    lift NUMBER
) /

CREATE OR REPLACE TYPE car_o AS OBJECT (
    engine_power NUMBER,
    color VARCHAR2(35)
) /

CREATE OR REPLACE TYPE train_o AS OBJECT (
    engine_type VARCHAR2(35),
    speed NUMBER
) /

SET SERVEROUTPUT ON;

DECLARE
    TYPE transports_t IS VARRAY(6) OF SYS.AnyData;
    transports transports_t;
    airplane airplane_o;
    car car_o;
    train train_o;
    ret_val NUMBER;
BEGIN
    transports := transports_t(
        AnyData.ConvertObject(airplane_o('turboprop', 2300)),
        AnyData.ConvertObject(airplane_o('jet', 3500)),
        AnyData.ConvertObject(car_o(55, 'red')),
        AnyData.ConvertObject(train_o('electric', 80)),
        AnyData.ConvertObject(train_o('steam', 45)),
        AnyData.ConvertObject(airplane_o('ramjet', 9000))
    );

    FOR i IN 1 .. transports.COUNT LOOP
        IF transports(i).GetTypeName = 'HR.AIRPLANE_O' THEN
            ret_val := transports(i).GetObject(airplane);
            DBMS_OUTPUT.put_line('Airplane: ' || 'engine type: ' ||
                                 airplane.engine_type || ', lift: ' || airplane.lift || 'lbs');
        ELSIF transports(i).GetTypeName = 'HR.CAR_O' THEN
            ret_val := transports(i).GetObject(car);
            DBMS_OUTPUT.put_line('Car: ' || 'engine power: ' ||
                                 car.engine_power || 'KW, color: ' || car.color);
        ELSIF transports(i).GetTypeName = 'HR.TRAIN_O' THEN
            ret_val := transports(i).GetObject(train);
            DBMS_OUTPUT.put_line('Train: ' || 'engine type: ' ||
                                 train.engine_type || ', speed: ' || train.speed || 'KMh');
        END IF;
    END LOOP;
END;
/
```

**Code Explanation:**

- **Lines 1-9:** Define the object types `airplane_o`, `car_o`, and `train_o`.
- **Lines 12-16:** Declare variables: a VARRAY `transports_t` to hold `AnyData` objects, and variables for each transport type.
- **Lines 19-27:** Populate the `transports` VARRAY with instances of the object types, converting them to `AnyData` using `AnyData.ConvertObject`.
- **Lines 29-48:** Loop through the `transports` array. `transports(i).GetTypeName` retrieves the type name. Based on the type, the appropriate object is retrieved using `GetObject`, and its properties are printed to the console.

Running this code (after replacing `HR` with your schema name if necessary) will output information about each transport, demonstrating the dynamic handling of different object types using `ANY` types. Note that error handling (checking the return value of `GetObject`) has been omitted for brevity. In a production environment, proper error handling should be included.
