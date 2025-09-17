```
---
layout: post
title: Grails File Upload Example
date: 2011-09-27 18:07:00
description: A working snippet for uploading files in Grails, including controller logic and GSP form example.
tags: grails, file-upload, groovy, gsp, web
categories: grails-development
---

I encountered several examples of uploading files with Grails, but none worked reliably for me. Therefore, I'm sharing a snippet of code that is actually functional (at least in my environment). Hopefully, someone else finds it useful.

### Controller Method

The controller method looks like this:

```groovy
// inputTagName should be "myFile"
public MultipartFile readUploadFile(HttpServletRequest request,
                                    String inputTagName) {
  return request.getFile(inputTagName)
}
```

### GSP Page Snippet

Here is the GSP page snippet:

```html
<g:uploadForm name="myUpload" action="readUploadFile">
  <input type="file" name="myFile"/>
  <g:submitButton class="button" name="Upload" value="Upload"/>
</g:uploadForm>
```
```