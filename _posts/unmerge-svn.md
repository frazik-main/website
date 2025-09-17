---
layout: post
title: SVN: Revert to a Previous Revision Using Reverse Merge
date: 2012-11-21 14:24:00
description: Learn how to revert a Subversion (SVN) repository to a previous revision or undo specific changes using the reverse merge command.
tags: svn, version-control, reverse-merge, revision, revert
categories: version-control
---

## How to Revert to a Previous SVN Revision

If you ever need to revert a `trunk` or any other directory in Subversion (SVN) to a previous revision, or effectively remove a specific revision's changes, simply perform a **reverse merge**.

Here's the command:

```bash
svn merge -r1001:1000 .
```

In this command:
*   `1001` is the newer revision you want to undo or remove.
*   `1000` is the older, previous revision you want the merge to calculate changes from (i.e., the state you want to revert to).

After executing the merge command, you'll need to commit the changes:

```bash
svn commit -m "Reverting changes introduced in revision 1001."
```