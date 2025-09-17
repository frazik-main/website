---
layout: post
title: PL/SQL Packages for Excel and Word Automation in Oracle Forms (WEBUTIL, OLE2)
date: 2011-02-01 11:03:00
description: PL/SQL packages for automating Excel and Word document creation and manipulation within Oracle Forms 10g applications using WEBUTIL and OLE2.
tags: plsql, oracle forms, excel, word, webutil, ole2, automation, programming
categories: oracle-forms, plsql
---

## Introduction

Several years ago, I was given a requirement for Excel/Word reporting through a PL/SQL Oracle Forms 10g application. A key constraint was that these reports needed to populate existing templates with data, and I was prohibited from using any dedicated reporting tools. Coming from a Java and object-oriented background, I initially began developing a Java bean to be integrated into Forms. My idea was to create reports using this bean (leveraging Apache POI) and then embed it into the Forms applet.

I was almost finished when I discovered that Oracle provides a library, WEBUTIL, which can, among other things, handle communication between Forms and Word or Excel. Consequently, I decided to leverage this library and developed the following PL/SQL packages for Word and Excel communication, utilizing WEBUTIL and OLE2.

I hope you find them useful. I will not provide extensive inline comments within the code itself due to their complexity, but if you have questions, please feel free to comment (or contact me privately), and I will endeavor to respond as soon as possible.

## Excel Package

### Package Specification

```plsql
PACKAGE excel
IS
   /*
    Global excel.Application Object --> This represents the Excel Application object.
    */
   appl_id   client_ole2.obj_type;

   /*
    Open a file to act as a template. Parameters are:
    _application_ -- The global Excel application parameter initialized at the
                     beginning.
    _file_ -- The file name to open (can be from a database or filesystem).
   */
   FUNCTION file_open (application client_ole2.obj_type, FILE VARCHAR2)
      RETURN client_ole2.obj_type;

   /*
    Close the current file.
   */
   PROCEDURE file_close (document client_ole2.obj_type);

   /*
    Saves the current file (useful for saving the current file with a different name).
   */
   PROCEDURE file_save_as (document client_ole2.obj_type, FILE VARCHAR2);

   /*
    Insert number (not formatted)
    x - Horizontal axis.
    y - Vertical axis.
    v - Value.
   */
   PROCEDURE insert_number (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           NUMBER
   );

   /*
    Insert number and format it as a decimal value.
    x - Horizontal axis.
    y - Vertical axis.
    v - Value.
    Note: !!!THIS DOES NOT WORK IN EXCEL 2007!!!
   */
   PROCEDURE insert_number_decimal (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           NUMBER
   );

   /*
    Insert characters (not formatted)
    x - Horizontal axis.
    y - Vertical axis.
    v - Value.
   */
   PROCEDURE insert_char (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           VARCHAR2
   );

   /*
    Insert character - formatted
    color - Number representing the color (e.g., 15 for gray).
    style - 'BOLD' or 'ITALIC'.
    x - Horizontal axis.
    y - Vertical axis.
    v - Value.
   */
   PROCEDURE insert_char_formated (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           VARCHAR2,
      color       NUMBER,
      style       VARCHAR2
   );

   /*
    Set autofit for the entire sheet.
   */
   PROCEDURE set_auto_fit (worksheet client_ole2.obj_type);

   /*
    Set autofit for a specified range 'r'. For example, 'A2:E11'.
   */
   PROCEDURE set_auto_fit_range (worksheet client_ole2.obj_type, r VARCHAR2);

   /*
    Apply decimal format (0.00) to range 'r'.
   */
   PROCEDURE set_decimal_format_range (
      worksheet   client_ole2.obj_type,
      r           VARCHAR2
   );

   /*
    Create a new workbook.
   */
   FUNCTION new_workbook (application client_ole2.obj_type)
      RETURN client_ole2.obj_type;

   /*
    Create a new worksheet.
   */
   FUNCTION new_worksheet (workbook client_ole2.obj_type)
      RETURN client_ole2.obj_type;

   /*
    Saves the file in the client's temporary folder (necessary when editing templates).
   */
   FUNCTION download_file (
      file_name         IN   VARCHAR2,
      table_name        IN   VARCHAR2,
      column_name       IN   VARCHAR2,
      where_condition   IN   VARCHAR2
   )
      RETURN VARCHAR2;

   /*
    Run a macro on the client's Excel document.
   */
   PROCEDURE run_macro_on_document (
      document   client_ole2.obj_type,
      macro      VARCHAR2
   );

   /*
    Limits network load (detail not provided).
   */
   PROCEDURE insert_number_array (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           VARCHAR2
   );
END;
```

### Package Body

```plsql
PACKAGE BODY excel
IS
   FUNCTION file_open (application client_ole2.obj_type, FILE VARCHAR2)
      RETURN client_ole2.obj_type
   IS
      arg_list    client_ole2.list_type;
      document    client_ole2.obj_type;
      documents   client_ole2.obj_type;
   BEGIN
      arg_list := client_ole2.create_arglist;
      documents := client_ole2.invoke_obj (application, 'Workbooks');
      client_ole2.add_arg (arg_list, FILE);
      document := client_ole2.invoke_obj (documents, 'Open', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (documents);
      RETURN document;
   END file_open;

   PROCEDURE file_save_as (document client_ole2.obj_type, FILE VARCHAR2)
   IS
      arg_list   client_ole2.list_type;
   BEGIN
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, FILE);
      client_ole2.invoke (document, 'SaveAs', arg_list);
      client_ole2.destroy_arglist (arg_list);
   END file_save_as;

   FUNCTION new_workbook (application client_ole2.obj_type)
      RETURN client_ole2.obj_type
   IS
      workbook    client_ole2.obj_type;
      workbooks   client_ole2.obj_type;
   BEGIN
      workbooks := client_ole2.get_obj_property (application, 'Workbooks');
      workbook := client_ole2.invoke_obj (workbooks, 'Add');
      client_ole2.RELEASE_OBJ (workbooks);
      RETURN workbook;
   END new_workbook;

   FUNCTION new_worksheet (workbook client_ole2.obj_type)
      RETURN client_ole2.obj_type
   IS
      worksheets   client_ole2.obj_type;
      worksheet    client_ole2.obj_type;
   BEGIN
      worksheets := client_ole2.get_obj_property (workbook, 'Worksheets');
      worksheet := client_ole2.invoke_obj (worksheets, 'Add');
      client_ole2.RELEASE_OBJ (worksheets);
      RETURN worksheet;
   END new_worksheet;

   PROCEDURE file_close (document client_ole2.obj_type)
   IS
   BEGIN
      client_ole2.invoke (document, 'Close');
   END file_close;

   /*
       Macro:    Cells(3, 4).Value = 3
                 Cells(3, 4).Select
                 Selection.NumberFormat = "0.00"
   */
   PROCEDURE insert_number_decimal (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           NUMBER
   )
   IS
      args        client_ole2.list_type;
      cell        client_ole2.obj_type;
      selection   client_ole2.obj_type;
   BEGIN
      IF v IS NOT NULL
      THEN
         args := client_ole2.create_arglist;
         client_ole2.add_arg (args, x);
         client_ole2.add_arg (args, y);
         cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
         client_ole2.destroy_arglist (args);
         client_ole2.set_property (cell, 'Value', v);
         client_ole2.invoke (cell, 'Select');
         selection := client_ole2.invoke_obj (appl_id, 'Selection');
         client_ole2.set_property (selection, 'Numberformat', '#.##0,00');
         client_ole2.RELEASE_OBJ (selection);
         client_ole2.RELEASE_OBJ (cell);
      END IF;
   END;

   /* Macro:
       Cells(x, y).Value = v
   */
   PROCEDURE insert_number (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           NUMBER
   )
   IS
      args   client_ole2.list_type;
      cell   ole2.obj_type;
   BEGIN
      IF v IS NOT NULL
      THEN
         args := client_ole2.create_arglist;
         client_ole2.add_arg (args, x);
         client_ole2.add_arg (args, y);
         cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
         client_ole2.destroy_arglist (args);
         client_ole2.set_property (cell, 'Value', v);
         client_ole2.RELEASE_OBJ (cell);
      END IF;
   END;


   PROCEDURE insert_char (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           VARCHAR2
   )
   IS
      args   client_ole2.list_type;
      cell   client_ole2.obj_type;
   BEGIN
      IF v IS NOT NULL
      THEN
         args := client_ole2.create_arglist;
         client_ole2.add_arg (args, x);
         client_ole2.add_arg (args, y);
         cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
         client_ole2.destroy_arglist (args);
         client_ole2.set_property (cell, 'Value', v);
         client_ole2.RELEASE_OBJ (cell);
      END IF;
   END;


   /*
       Macro:
           Cells(x, y).Value = v
           Cells(x, y).Select
           Selection.Interior.ColorIndex = color
           if (style in 'BOLD')
               Selection.Font.Bold = True
           else if (style in 'ITALIC')
               Selection.Font.Italic = True
   */
   PROCEDURE insert_char_formated (
      worksheet   client_ole2.obj_type,
      x           NUMBER,
      y           NUMBER,
      v           VARCHAR2,
      color       NUMBER,
      style       VARCHAR2
   )
   IS
      args        client_ole2.list_type;
      cell        client_ole2.obj_type;
      selection   client_ole2.obj_type;
      font        client_ole2.obj_type;
      interior    client_ole2.obj_type;
   BEGIN
      IF v IS NOT NULL
      THEN
         args := client_ole2.create_arglist;
         client_ole2.add_arg (args, x);
         client_ole2.add_arg (args, y);
         cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
         client_ole2.destroy_arglist (args);
         client_ole2.set_property (cell, 'Value', v);
         client_ole2.invoke (cell, 'Select');
         selection := client_ole2.invoke_obj (appl_id, 'Selection');
         font := client_ole2.invoke_obj (selection, 'Font');
         interior := client_ole2.invoke_obj (selection, 'Interior');

         IF UPPER (style) IN ('BOLD', 'ITALIC')
         THEN
            client_ole2.set_property (font, style, TRUE);
         END IF;

         client_ole2.set_property (interior, 'ColorIndex', color);
         client_ole2.RELEASE_OBJ (interior);
         client_ole2.RELEASE_OBJ (font);
         client_ole2.RELEASE_OBJ (selection);
         client_ole2.RELEASE_OBJ (cell);
      END IF;
   END;

   /*
       Macro:
           Range(r).Select
           Selection.Columns.AutoFit
           Cells(1,1).Select
   */
   PROCEDURE set_auto_fit_range (worksheet client_ole2.obj_type, r VARCHAR2)
   IS
      args        client_ole2.list_type;
      --range
      rang        client_ole2.obj_type;
      selection   client_ole2.obj_type;
      colum       client_ole2.obj_type;
      cell        client_ole2.obj_type;
   BEGIN
      args := client_ole2.create_arglist;
      client_ole2.add_arg (args, r);
      rang := client_ole2.get_obj_property (worksheet, 'Range', args);
      client_ole2.destroy_arglist (args);
      client_ole2.invoke (rang, 'Select');
      selection := client_ole2.invoke_obj (appl_id, 'Selection');
      colum := client_ole2.invoke_obj (selection, 'Columns');
      client_ole2.invoke (colum, 'AutoFit');
      --now select upper (1,1) for deselection.
      args := client_ole2.create_arglist;
      client_ole2.add_arg (args, 1);
      client_ole2.add_arg (args, 1);
      cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
      client_ole2.invoke (cell, 'Select');
      client_ole2.destroy_arglist (args);
      client_ole2.RELEASE_OBJ (colum);
      client_ole2.RELEASE_OBJ (selection);
      client_ole2.RELEASE_OBJ (rang);
   END set_auto_fit_range;

   /*
       Macro:
           Range(r).Select
           Selection.Numberformat = "0.00"
           Cells(1,1).Select
   */
   PROCEDURE set_decimal_format_range (
      worksheet   client_ole2.obj_type,
      r           VARCHAR2
   )
   IS
      args        client_ole2.list_type;
      --range
      rang        client_ole2.obj_type;
      selection   client_ole2.obj_type;
      --colum Client_OLE2.Obj_Type;
      cell        client_ole2.obj_type;
   BEGIN
      args := client_ole2.create_arglist;
      client_ole2.add_arg (args, r);
      rang := client_ole2.get_obj_property (worksheet, 'Range', args);
      client_ole2.destroy_arglist (args);
      client_ole2.invoke (rang, 'Select');
      selection := client_ole2.invoke_obj (appl_id, 'Selection');
      --colum:= Client_OLE2.invoke_obj(selection, 'Columns');
      client_ole2.set_property (selection, 'Numberformat', '#.##0,00');
      --Client_OLE2.invoke(colum, 'AutoFit');
      --now select upper (1,1) for deselection.
      args := client_ole2.create_arglist;
      client_ole2.add_arg (args, 1);
      client_ole2.add_arg (args, 1);
      cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
      client_ole2.invoke (cell, 'Select');
      client_ole2.destroy_arglist (args);
      --Client_OLE2.release_obj(colum);
      client_ole2.RELEASE_OBJ (selection);
      client_ole2.RELEASE_OBJ (rang);
   END set_decimal_format_range;

   /*
       Macro:Cells.Select
           Selection.Columns.AutoFit
           Cells(1,1).Select
   */
   PROCEDURE set_auto_fit (worksheet client_ole2.obj_type)
   IS
      args        client_ole2.list_type;
      cell        client_ole2.obj_type;
      selection   client_ole2.obj_type;
      colum       client_ole2.obj_type;
   BEGIN
      cell := client_ole2.get_obj_property (worksheet, 'Cells');
      client_ole2.invoke (cell, 'Select');
      selection := client_ole2.invoke_obj (appl_id, 'Selection');
      colum := client_ole2.invoke_obj (selection, 'Columns');
      client_ole2.invoke (colum, 'AutoFit');
      --now select upper (1,1) for deselection.
      args := client_ole2.create_arglist;
      client_ole2.add_arg (args, 1);
      client_ole2.add_arg (args, 1);
      cell := client_ole2.get_obj_property (worksheet, 'Cells', args);
      client_ole2.invoke (cell, 'Select');
      client_ole2.destroy_arglist (args);
      client_ole2.RELEASE_OBJ (colum);
      client_ole2.RELEASE_OBJ (selection);
      client_ole2.RELEASE_OBJ (cell);
   END set_auto_fit;

   PROCEDURE run_macro_on_document (
      document   client_ole2.obj_type,
      macro      VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, macro);
      client_ole2.invoke (excel.appl_id, 'Run', arg_list);
      client_ole2.destroy_arglist (arg_list);
   END;

   FUNCTION download_file (
      file_name         IN   VARCHAR2,
      table_name        IN   VARCHAR2,
      column_name       IN   VARCHAR2,
      where_condition   IN   VARCHAR2
   )
      RETURN VARCHAR2
   IS
      l_ok          BOOLEAN;
      c_file_name   VARCHAR2 (512);
      c_path        VARCHAR2 (255);
   BEGIN
      SYNCHRONIZE;
      c_path := client_win_api_environment.get_temp_directory (FALSE);

      IF c_path IS NULL
      THEN
         c_path := 'C:\';
      ELSE
         c_path := c_path || '\';
      END IF;

      c_file_name := c_path || file_name;
      l_ok :=
         webutil_file_transfer.db_to_client_with_progress
                                                   (c_file_name,
                                                    table_name,
                                                    column_name,
                                                    where_condition,
                                                    'Transfer on file system',
                                                    'Progress'
                                                   );
      SYNCHRONIZE;

      IF NOT l_ok
      THEN
         msg_popup ('File not found in database', 'E', TRUE);
      END IF;

      RETURN c_path || file_name;
   END download_file;
END;
```

## Word Package

### Package Specification

```plsql
PACKAGE word
IS
   /*
    Global Word.Application Object --> Represents the Word Application object.
   */
   appl_id   client_ole2.obj_type;

   /*
    Open a file to act as a template. Parameters are:
    _application_ -- The global Word application parameter initialized at the
                     beginning.
    _file_ -- The file name to open (can be from a database or filesystem).
   */
   FUNCTION file_open (application client_ole2.obj_type, FILE VARCHAR2)
      RETURN client_ole2.obj_type;

   /*
    Close the current file.
   */
   PROCEDURE file_close (document client_ole2.obj_type);

   /*
    Saves the current file (useful for saving the current file with a different name).
   */
   PROCEDURE file_save_as (document client_ole2.obj_type, FILE VARCHAR2);

   /*
    (Core functionality of this package) Inserts a value into a specific Word bookmark.
    _document_ -- The Word document object.
    _bookmark_ -- Name of the bookmark defined in the Word template.
    _content_ -- Content to insert into the bookmark.
   */
   PROCEDURE insertafter_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   );

   /*
    InsertAfter_Bookmark inserts text after a bookmark and then deletes the bookmark. This is not
    ideal when iterating through values, so this procedure does not delete the bookmark after insertion.
    Same parameters as the previous one.
   */
   PROCEDURE replace_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   );

   /*
    Same as the previous procedure, but handles the next line for you.
   */
   PROCEDURE insertafter_bookmark_next (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   );

   /*
    After inserting a value, this procedure moves the selection to the next row in the table (meaning the cell directly below).
    This is essential for iterating through a Word table, one row at a time.
    A new row must be manually created if it does not exist.!!!
   */
   PROCEDURE insertafter_bookmark_down (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   );

   /*
    Deletes a bookmark.
   */
   PROCEDURE delete_bookmark (document client_ole2.obj_type, bookmark VARCHAR2);

   /*
    Creates a new table row.
   */
   PROCEDURE insert_new_table_row (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2
   );

   /*
    Moves a bookmark (ONLY within a table) left, right, up, or down.
    _direction_ can have the following values: 'UP', 'DOWN', 'LEFT', 'RIGHT'.
   */
   PROCEDURE move_table_bookmark (
      document    client_ole2.obj_type,
      bookmark    VARCHAR2,
      direction   VARCHAR2
   );

   /*
    File download.
    _file_name_  -- The client-side file name.
    _table_name_ -- The table containing the BLOB column.
    _column_name_ -- The BLOB column name holding the Word template.
    _where_condition_ -- The WHERE clause filter.
   */
   FUNCTION download_file (
      file_name         IN   VARCHAR2,
      table_name        IN   VARCHAR2,
      column_name       IN   VARCHAR2,
      where_condition   IN   VARCHAR2
   )
      RETURN VARCHAR2;

   /*
    Calls macros on bookmarks (primarily for testing).
   */
   PROCEDURE run_macro_on_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      macro      VARCHAR2
   );

   PROCEDURE run_macro_on_document (
      document   client_ole2.obj_type,
      macro      VARCHAR2
   );
END;
```

### Package Body

```plsql
PACKAGE BODY word
IS
   FUNCTION file_open (application client_ole2.obj_type, FILE VARCHAR2)
      RETURN client_ole2.obj_type
   IS
      arg_list    client_ole2.list_type;
      document    client_ole2.obj_type;
      documents   client_ole2.obj_type;
   BEGIN
      arg_list := client_ole2.create_arglist;
      documents := client_ole2.invoke_obj (application, 'documents');
      client_ole2.add_arg (arg_list, FILE);
      document := client_ole2.invoke_obj (documents, 'Open', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (documents);
      RETURN document;
   END file_open;

   PROCEDURE file_close (document client_ole2.obj_type)
   IS
   BEGIN
      client_ole2.invoke (document, 'Close');
   --CLIENT_OLE2.RELEASE_OBJ(document);
   END file_close;

   PROCEDURE file_save_as (document client_ole2.obj_type, FILE VARCHAR2)
   IS
      arg_list   client_ole2.list_type;
   BEGIN
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, FILE);
      client_ole2.invoke (document, 'SaveAs', arg_list);
      client_ole2.destroy_arglist (arg_list);
   --CLIENT_OLE2.RELEASE_OBJ(document);
   END file_save_as;

   PROCEDURE replace_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, content);
      client_ole2.invoke (selectionobj, 'Delete');
      client_ole2.invoke (selectionobj, 'InsertAfter', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END replace_bookmark;

   PROCEDURE insertafter_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, content);
      client_ole2.invoke (selectionobj, 'InsertAfter', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END insertafter_bookmark;

   PROCEDURE insertafter_bookmark_next (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, content || CHR (13));
      client_ole2.invoke (selectionobj, 'InsertAfter', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END insertafter_bookmark_next;

   PROCEDURE insertafter_bookmark_down (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      content    VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, content);
      client_ole2.invoke (selectionobj, 'InsertAfter', arg_list);
      client_ole2.invoke (selectionobj, 'Cut');
      client_ole2.invoke (selectionobj, 'SelectCell');
      client_ole2.invoke (selectionobj, 'MoveDown');
      client_ole2.invoke (selectionobj, 'Paste');
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END insertafter_bookmark_down;

   PROCEDURE delete_bookmark (document client_ole2.obj_type, bookmark VARCHAR2)
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      client_ole2.invoke (selectionobj, 'Delete');
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END delete_bookmark;

   PROCEDURE run_macro_on_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2,
      macro      VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, macro);
      client_ole2.invoke (word.appl_id, 'Run', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END;

   PROCEDURE run_macro_on_document (
      document   client_ole2.obj_type,
      macro      VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      --bookmarkCollection := CLIENT_OLE2.INVOKE_OBJ(document, 'Bookmarks', arg_list);
      --arg_list := CLIENT_OLE2.CREATE_ARGLIST;
      --CLIENT_OLE2.ADD_ARG(arg_list, bookmark);
      --bookmarkObj := CLIENT_OLE2.INVOKE_OBJ(bookmarkCollection, 'Item',arg_list);
      --CLIENT_OLE2.DESTROY_ARGLIST(arg_list);

      --CLIENT_OLE2.INVOKE(bookmarkObj, 'Select');
      --selectionObj := CLIENT_OLE2.INVOKE_OBJ(appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, macro);
      client_ole2.invoke (word.appl_id, 'Run', arg_list);
      client_ole2.destroy_arglist (arg_list);
   --CLIENT_OLE2.RELEASE_OBJ(selectionObj);
   --CLIENT_OLE2.RELEASE_OBJ(bookmarkObj);
   --CLIENT_OLE2.RELEASE_OBJ(bookmarkCollection);
   END;

   PROCEDURE insert_new_table_row (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, 1);
      client_ole2.invoke (selectionobj, 'InsertRowsBelow', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END insert_new_table_row;

   PROCEDURE move_down_table_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      client_ole2.invoke (selectionobj, 'Cut');
      client_ole2.invoke (selectionobj, 'SelectCell');
      client_ole2.invoke (selectionobj, 'MoveDown');
      client_ole2.invoke (selectionobj, 'Paste');
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END move_down_table_bookmark;

   PROCEDURE move_up_table_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      client_ole2.invoke (selectionobj, 'Cut');
      client_ole2.invoke (selectionobj, 'SelectCell');
      client_ole2.invoke (selectionobj, 'MoveUp');
      client_ole2.invoke (selectionobj, 'Paste');
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END move_up_table_bookmark;

   PROCEDURE move_left_table_bookmark (
      document   client_ole2.obj_type,
      bookmark   VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');
      client_ole2.invoke (selectionobj, 'Cut');
      client_ole2.invoke (selectionobj, 'SelectCell');
      client_ole2.invoke (selectionobj, 'MoveUp'); -- This might be a copy-paste error and should be MoveLeft
      client_ole2.invoke (selectionobj, 'Paste');
      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END move_left_table_bookmark;

   PROCEDURE move_table_bookmark (
      document    client_ole2.obj_type,
      bookmark    VARCHAR2,
      direction   VARCHAR2
   )
   IS
      arg_list             client_ole2.list_type;
      bookmarkcollection   client_ole2.obj_type;
      bookmarkobj          client_ole2.obj_type;
      selectionobj         client_ole2.obj_type;
   BEGIN
      bookmarkcollection :=
                     client_ole2.invoke_obj (document, 'Bookmarks', arg_list);
      arg_list := client_ole2.create_arglist;
      client_ole2.add_arg (arg_list, bookmark);
      bookmarkobj :=
                client_ole2.invoke_obj (bookmarkcollection, 'Item', arg_list);
      client_ole2.destroy_arglist (arg_list);
      client_ole2.invoke (bookmarkobj, 'Select');
      selectionobj := client_ole2.invoke_obj (appl_id, 'Selection');

      IF UPPER (direction) IN ('UP', 'DOWN', 'LEFT', 'RIGHT')
      THEN
         client_ole2.invoke (selectionobj, 'Cut');
         client_ole2.invoke (selectionobj, 'SelectCell');
         client_ole2.invoke (selectionobj, 'Move' || direction);
         client_ole2.invoke (selectionobj, 'Paste');
      END IF;

      client_ole2.RELEASE_OBJ (selectionobj);
      client_ole2.RELEASE_OBJ (bookmarkobj);
      client_ole2.RELEASE_OBJ (bookmarkcollection);
   END move_table_bookmark;

   FUNCTION download_file (
      file_name         IN   VARCHAR2,
      table_name        IN   VARCHAR2,
      column_name       IN   VARCHAR2,
      where_condition   IN   VARCHAR2
   )
      RETURN VARCHAR2
   IS
      l_ok          BOOLEAN;
      c_file_name   VARCHAR2 (512);
      c_path        VARCHAR2 (255);
   BEGIN
      SYNCHRONIZE;
      c_path := client_win_api_environment.get_temp_directory (FALSE);

      IF c_path IS NULL
      THEN
         c_path := 'C:\';
      ELSE
         c_path := c_path || '\';
      END IF;

      c_file_name := c_path || file_name;
      l_ok :=
         webutil_file_transfer.db_to_client_with_progress
                                                   (c_file_name,
                                                    table_name,
                                                    column_name,
                                                    where_condition,
                                                    'Transfer on file system',
                                                    'Progress'
                                                   );
      SYNCHRONIZE;
      RETURN c_path || file_name;
   END download_file;
END;
```

## Simple Test Procedure

```plsql
PROCEDURE Call(c_prog IN VARCHAR2,param1 IN VARCHAR2 DEFAULT NULL,value1 IN VARCHAR2 DEFAULT NULL,
                                    param2 IN VARCHAR2 DEFAULT NULL,value2 IN VARCHAR2 DEFAULT NULL) IS
  list_id Paramlist;
BEGIN
   -- Check if list exists.
   list_id := Get_Parameter_List('param_list');
   IF NOT Id_Null(list_id) THEN
     Destroy_Parameter_List(list_id); -- If it exists, destroy it!
   END IF;

   list_id := Create_Parameter_List('param_list');

   Add_Parameter(list_id, 'ps_sif',TEXT_PARAMETER, :Global.ps_sif);
   Add_Parameter(list_id, 'frm_sif',TEXT_PARAMETER, :Global.frm_sif);
   Add_Parameter(list_id, 'god_sif',TEXT_PARAMETER, :Global.god_sif);
   Add_Parameter(list_id, 'ana_id',TEXT_PARAMETER, :Global.ana_id);
   Add_Parameter(list_id, 'id_radnik',TEXT_PARAMETER, :Global.id_radnik);
   Add_Parameter(list_id, 'forma',TEXT_PARAMETER, UPPER(c_prog));

   IF param1 IS NOT NULL THEN
     Add_Parameter(list_id, param1,TEXT_PARAMETER, value1);
   END IF;

   IF param2 IS NOT NULL THEN
     Add_Parameter(list_id, param2,TEXT_PARAMETER, value2);
   END IF;


   CALL_FORM(c_prog || '.FMX', NO_HIDE, DO_REPLACE, NO_QUERY_ONLY, list_id);

END;
```