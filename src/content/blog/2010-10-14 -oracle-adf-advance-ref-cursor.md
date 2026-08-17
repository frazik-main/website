---
layout: post
title: "Custom View Object with Oracle Ref Cursor in ADF"
date: 2010-10-14 15:31:00
description: "This post demonstrates how to create a custom read-only view object in Oracle ADF JDeveloper, leveraging an Oracle REF CURSOR as an alternative data source. It covers initial JDeveloper setup, database package creation, and customizing the View Object implementation class."
tags: adf, jdeveloper, view object, ref cursor, oracle, plsql, java, custom data source
categories: oracle-adf
---

## Introduction

By default, view objects read data directly from the database and automate JDBC interactions. However, by overriding specific methods in a View Object's implementation class, we can define a custom mechanism for data retrieval. This allows us to source data from various origins such as web services, XML files, plain JDBC, or specific database constructs like **cursors** in Oracle databases. This example demonstrates how to create a _read-only_ view object that uses an Oracle **REF CURSOR** as an alternative data source. Let's get started!

## Initial JDeveloper Setup

1.  Create an Application Module. In our case, it's an Application Module connected to the FOD database.

2.  Next, create a read-only View Object that selects `person_id`, `first_name`, and `last_name` (just three attributes for simplicity) from the `persons` table in the FOD schema. Don't forget to generate the View Object class (`*Impl`). The query for the View Object will be simple:

    ```sql
    SELECT person_id, first_name, last_name
    FROM persons
    WHERE first_name LIKE :person_name
    ```

    And how it looks in JDeveloper:

    ![JDeveloper View Object Setup](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXCX4l9hnNfSeRx_LuhfpkYaL-0DRhipbQsU_TWRcul-7pSPTkohOObHhe_Kfd_K8OYcIvFcKnCmePhuW_LroC3gU775tjD4czdIYHL3KmNEKt4N8scb1lM5uJrcskMX7hj1fxNH-ET7HA/s320/1.GIF)

3.  Then, create a Bind Variable named "**person_name**".

    Test it:

    ![JDeveloper Bind Variable Test](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRjZUPSRTUPTB9u1OpwoeUdtY_90HPsmhUi-BcanPfTHxe8NjhQkRw5pCviecq1R26uzh_JMmWZ24Z-gRLTFxVF07109_oINdDD3-aVLsoXhDkkAZt-SDqQ1sT8oVxw73cCSRYE_nizYHV/s320/2.GIF)

    And move on...

## Initial Database Setup

To use a REF CURSOR, you need to create a PL/SQL function that returns a `REF CURSOR` type. We will create the following package in the FOD schema:

```plsql
CREATE OR REPLACE PACKAGE fod_ref_cursor
IS
   TYPE ref_cursor IS REF CURSOR;

   FUNCTION get_person_from_name (f_name VARCHAR2)
      RETURN ref_cursor;
END fod_ref_cursor;
/

SHOW errors

CREATE OR REPLACE PACKAGE BODY fod_ref_cursor
IS
   FUNCTION get_person_from_name (f_name VARCHAR2)
      RETURN ref_cursor
   IS
      the_cursor   ref_cursor;
   BEGIN
      OPEN the_cursor FOR
         SELECT person_id, first_name, last_name
           FROM persons
          WHERE first_name LIKE f_name;

      RETURN the_cursor;
   END get_person_from_name;
END fod_ref_cursor;
/

SHOW errors
```

You can test the REF CURSOR using the following PL/SQL block:

```plsql
SET serveroutput on;

DECLARE
   the_cursor     fod_ref_cursor.ref_cursor;
   p_id           persons.person_id%TYPE;
   p_first_name   persons.first_name%TYPE;
   p_last_name    persons.last_name%TYPE;
BEGIN
   the_cursor := fod_ref_cursor.get_person_from_name ('Steven');

   LOOP
      FETCH the_cursor
       INTO p_id, p_first_name, p_last_name;

      EXIT WHEN the_cursor%NOTFOUND;
      DBMS_OUTPUT.put_line (p_id);
   END LOOP;
END;
/
```

## Customizing the Framework

Next, you need to override some methods in `PersonsImpl.java`. (The code below is adapted and slightly simplified from Oracle Fusion advanced ADF examples).

```java
public class PersonImpl extends ViewObjectImpl {

    private static final String FUNCTION_NAME =
        "fod_ref_cursor.get_person_from_name(?)";
    private static final String BIND_VARIABLE_NAME = "person_name";

    private void fillAttributes(ViewRowImpl r,
                                ResultSet rs) throws SQLException {
        populateAttributeForRow(r, 0, rs.getLong(1));
        populateAttributeForRow(r, 1, rs.getString(2));
        populateAttributeForRow(r, 2, rs.getString(3));
    }


    /**
     * This is the default constructor (do not remove).
     */
    public PersonImpl() {
    }

    /**
     * Overridden framework method.
     *
     * Executed when the framework needs to issue the database query for
     * the query collection based on this view object. One view object
     * can produce many related result sets, each potentially the result
     * of different bind variable values. If the rowset in query is involved
     * in a framework-coordinated master/detail viewlink, then the params array
     * will contain one or more framework-supplied bind parameters. If there
     * are any user-supplied bind parameter values, they will *PRECEED* the
     * framework-supplied bind variable values in the params array, and the
     * number of user parameters will be indicated by the value of the
     * numUserParams argument.
     */
    protected void executeQueryForCollection(Object qc, Object[] params,
                                             int numUserParams) {
        storeNewResultSet(qc, retrieveRefCursor(qc, params));
        super.executeQueryForCollection(qc, params, numUserParams);
    }

    /**
     * Overridden framework method.
     *
     * Wipe out all traces of a built-in query for this VO
     */
    protected void create() {
        getViewDef().setQuery(null);
        getViewDef().setSelectClause(null);
        setQuery(null);
    }

    /**
     * Overridden framework method.
     *
     * The role of this method is to "fetch", populate, and return a single row
     * from the datasource by calling createNewRowForCollection() and populating
     * its attributes using populateAttributeForRow().
     */
    protected ViewRowImpl createRowFromResultSet(Object qc, ResultSet rs) {
        /*
         * We ignore the JDBC ResultSet passed by the framework (null anyway) and
         * use the resultset that we've stored in the query-collection-private
         * user data storage
         */
        rs = getResultSet(qc);

        /*
         * Create a new row to populate
         */
        ViewRowImpl r = createNewRowForCollection(qc);

        try {
            /*
             * Populate new row by attribute slot number for current row in Result Set
             */
            fillAttributes(r, rs);
        } catch (SQLException s) {
            throw new JboException(s);
        }
        return r;
    }

    /**
     * Overridden framework method.
     *
     * Return true if the datasource has at least one more record to fetch.
     */
    protected boolean hasNextForCollection(Object qc) {
        ResultSet rs = getResultSet(qc);
        boolean nextOne = false;
        try {
            nextOne = rs.next();
            /*
             * When were at the end of the result set, mark the query collection
             * as "FetchComplete".
             */
            if (!nextOne) {
                setFetchCompleteForCollection(qc, true);
                /*
                 * Close the result set, we're done with it
                 */
                rs.close();
            }
        } catch (SQLException s) {
            throw new JboException(s);
        }
        return nextOne;
    }

    /**
     * Overridden framework method.
     *
     * The framework gives us a chance to clean up any resources related
     * to the datasource when a query collection is done being used.
     */
    protected void releaseUserDataForCollection(Object qc, Object rs) {
        /*
         * Ignore the ResultSet passed in since we've created our own.
         * Fetch the ResultSet from the User-Data context instead
         */
        ResultSet userDataRS = getResultSet(qc);
        if (userDataRS != null) {
            try {
                userDataRS.close();
            } catch (SQLException s) {
                /* Ignore */
            }
        }
        super.releaseUserDataForCollection(qc, rs);
    }


    /**
     * Return a JDBC ResultSet representing the REF CURSOR return
     * value from our stored package function.
     */
    private ResultSet retrieveRefCursor(Object qc, Object[] params) {
        ResultSet rs =
            (ResultSet)callStoredFunction(OracleTypes.CURSOR, FUNCTION_NAME,
                                          new Object[] { getNamedBindParamValue(BIND_VARIABLE_NAME,
                                                                                params) });
        return rs;
    }

    private Object getNamedBindParamValue(String varName, Object[] params) {
        Object result = null;
        if (getBindingStyle() == SQLBuilder.BINDING_STYLE_ORACLE_NAME) {
            if (params != null) {
                for (Object param : params) {
                    Object[] nameValue = (Object[])param;
                    String name = (String)nameValue[0];
                    if (name.equals(varName)) {
                        return (String)nameValue[1];
                    }
                }
            }
        }
        throw new JboException("No bind variable named '" + varName + "'");
    }

    /**
     * Store a new result set in the query-collection-private user-data context
     */
    private void storeNewResultSet(Object qc, ResultSet rs) {
        ResultSet existingRs = getResultSet(qc);
        // If this query collection is getting reused, close out any previous rowset
        if (existingRs != null) {
            try {
                existingRs.close();
            } catch (SQLException s) {
            }
        }
        setUserDataForCollection(qc, rs);
        hasNextForCollection(qc); // Prime the pump with the first row.
    }

    /**
     * Retrieve the result set wrapper from the query-collection user-data
     */
    private ResultSet getResultSet(Object qc) {
        return (ResultSet)getUserDataForCollection(qc);
    }


    //----------------[ Begin Helper Code ]------------------------------
    public static int NUMBER = Types.NUMERIC;
    public static int DATE = Types.DATE;
    public static int VARCHAR2 = Types.VARCHAR;

    /**
     * Simplifies calling a stored function with bind variables
     *
     * You can use the NUMBER, DATE, and VARCHAR2 constants in this
     * class to indicate the function return type for these three common types,
     * otherwise use one of the JDBC types in the java.sql.Types class.
     *
     * NOTE: If you want to invoke a stored procedure without any bind variables
     * ====  then you can just use the basic getDBTransaction().executeCommand()
     *
     * @param sqlReturnType JDBC datatype constant of function return value
     * @param stmt stored function statement
     * @param bindVars Object array of parameters
     * @return function return value as an Object
     */
    protected Object callStoredFunction(int sqlReturnType, String stmt,
                                        Object[] bindVars) {
        CallableStatement st = null;
        try {
            st =
 getDBTransaction().createCallableStatement("begin ? := " + stmt + "; end;",
                                            0);
            st.registerOutParameter(1, sqlReturnType);
            if (bindVars != null) {
                for (int z = 0; z < bindVars.length; z++) {
                    st.setObject(z + 2, bindVars[z]);
                }
            }
            st.executeUpdate();
            return st.getObject(1);
        } catch (SQLException e) {
            throw new JboException(e);
        }
    }

    /**getEstimatedRowCount - overridden for custom java data source support.
     */
    public long getEstimatedRowCount() {
        long value = super.getEstimatedRowCount();
        return value;
    }


    /**
     * Returns the bind variable value for person_name.
     * @return bind variable value for person_name
     */
    public String getperson_name() {
        return (String)getNamedWhereClauseParam("person_name");
    }

    /**
     * Sets `value` for bind variable person_name.
     * @param value value to bind as person_name
     */
    public void setperson_name(String value) {
        setNamedWhereClauseParam("person_name", value);
    }
}
```

You can use this code as a template; you'll primarily need to modify `FUNCTION_NAME`, `BIND_VARIABLE_NAME`, and complete the `fillAttributes` method to correctly map the JDBC result set to your View Object's attribute set. It's that simple! In some circumstances, this method of data retrieval in a View Object can even speed up data loading.

## Plain JDBC Data Pull

If you prefer to use plain JDBC instead of a REF CURSOR, you can modify the `callStoredFunction` method like this:

```java
protected Object callStoredFunction(int sqlReturnType, String stmt,
                                        Object[] bindVars) {
    PreparedStatement st = null;
    try {
        st = getDBTransaction().createPreparedStatement("SELECT person_id, first_name, last_name\n" +
        "  FROM persons where person_id = 100", 0);
        return st.executeQuery();
    } catch (SQLException e) {
        throw new JboException(e);
    }
}
```
