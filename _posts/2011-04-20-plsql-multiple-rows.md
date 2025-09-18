---
layout: post
title: Passing Structured Data to Oracle PL/SQL Stored Procedures with Java
date: 2011-04-20 22:38:00
description: Learn how to pass structured data, including multiple rows and columns, from Java to Oracle PL/SQL stored procedures using Oracle-specific ARRAY and STRUCT objects.
tags: java, oracle, plsql, stored-procedure, jdbc, adf, array, struct, database
categories: java, database, oracle
---

## Introduction

Oracle, of course, uses standard Java Database Connectivity (JDBC) interfaces for communication with its database. While standard JDBC is sufficient, if you know you will _only_ be using an Oracle database for your project, it can be beneficial to leverage some Oracle-specific Java libraries.

In this tutorial, I will demonstrate some specific Oracle Java libraries that can help you pass structured data into PL/SQL stored procedures. This structured data can contain multiple rows, with each row containing multiple columns. So, how can you achieve this?

## Implementation

We will use two Oracle-specific classes:

- `oracle.sql.ARRAY`
- `oracle.sql.STRUCT`

The `ARRAY` class helps us create an array of `STRUCT` objects. A `STRUCT` object is created using the static `oracle.sql.StructDescriptor.createDescriptor` method. This method utilizes an existing database object type.

An `ARRAY` object is created using the `oracle.sql.ArrayDescriptor.createDescriptor` method. This method requires an existing collection type from the database. The elements of this collection must be of the same type as our database object type (essentially, an "array of our object type" as defined by the database collection type).

I've created a simple helper class to manage the creation of the structure and the PL/SQL procedure call. Here it is:

```java
import java.sql.Connection;

import oracle.jbo.client.Configuration;
import oracle.jbo.server.DBTransaction;

import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.STRUCT;
import oracle.sql.StructDescriptor;

public class TransferStructure {

    private StructDescriptor structureDescriptor;
    private ArrayDescriptor arrayDescriptor;
    private Object[] structValues;
    private int fieldsCount;
    private Connection connection;
    private STRUCT[] allRows;
    private String[] structDescColumnNames;
    private DBTransaction dbTransaction;
    private int currentRowIndx = 0;

    public TransferStructure(String objectTypeName, String arrayTypeName,
                             int numberOfRows,
                             DBTransaction dbTransaction) throws Exception {
        this.dbTransaction = dbTransaction;
        this.connection =
                Call_Pl_SqlCodeUtil.getCurrentConnection(dbTransaction);
        allRows = new STRUCT[numberOfRows];

        structureDescriptor =
                StructDescriptor.createDescriptor(objectTypeName, this.connection);
        arrayDescriptor =
                ArrayDescriptor.createDescriptor(arrayTypeName, this.connection);
        // Corrected order: fieldsCount must be initialized before using it to size structValues
        fieldsCount = structureDescriptor.getMetaData().getColumnCount();
        structValues = new Object[fieldsCount];
        structDescColumnNames = new String[fieldsCount];

    }

    public void initializeRow() throws Exception {
        structValues = new Object[fieldsCount];
    }

    public void setFiledValue(String fieldName,
                              Object value) throws Exception {
        structValues[fieldPos(fieldName)] = value;
    }

    /**
     * Unfortunately, you need to call this at the end of row population.
     * @throws Exception
     */
    public void finalizeRow() throws Exception {
      STRUCT struct =
          new STRUCT(structureDescriptor, this.connection, structValues);
      allRows[currentRowIndx++] = struct;
    }

    /**
     * Finds the field position within the structure.
     * @param fieldName
     * @return
     * @throws Exception
     */
    private int fieldPos(String fieldName) throws Exception {
        int fieldPosition = -1;

        for (int i = 1; i < fieldsCount + 1; i++) {
            String currentField =
                structureDescriptor.getMetaData().getColumnName(i);
            if (currentField.equals(fieldName)) {
                fieldPosition = i - 1;
                break;
            }
        }
        return fieldPosition;
    }

    private ARRAY getArrayStructure() throws Exception {
        return new ARRAY(arrayDescriptor, this.connection, allRows);
    }

    public void makeProcedureCall(String procedureName) throws Exception {
        Call_Pl_SqlCodeUtil.callStoredProcedure(dbTransaction, procedureName,
                                                new Object[] { getArrayStructure() });
    }
}
```

You can use this helper class as follows:

```java
public static void main(String[] args) throws Exception {

        TransferStructure ts =
            new TransferStructure("YOUR_OBJECT_TYPE", "YOUR_ARRAY_TYPE_OF_OBJECTS",
                                  2, /* Assuming this is a DBTransaction object, not a String: */ getDatabaseConnection());
        ts.initializeRow();
        ts.setFiledValue("YOUR_FIRST_ATTRIBUTE", "value1");
        ts.finalizeRow();
        ts.initializeRow();
        ts.setFiledValue("YOUR_SECOND_ATTRIBUTE", new oracle.jbo.domain.Number(1234));
        ts.finalizeRow();
        ts.makeProcedureCall("YOUR_PACKAGE.your_procedure_with_in_parameter(?)");

}
```

You will also need a method to call a stored procedure from Java. Such methods are readily available online.

It's important to note that this example is primarily implemented for the Oracle ADF framework. However, it should also function in other non-Oracle development environments, provided you acquire the necessary Oracle JDBC and SQL libraries.
