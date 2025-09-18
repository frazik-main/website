---
layout: post
title: "Using Grails dataBind Outside a Controller"
date: 2014-06-10 10:55:00
description: "A quick tip demonstrating how to use the Grails `dataBind` command outside of a Grails controller, for instance, in a service layer."
tags: grails, databinding, groovy, programming
categories: grails-tips
---

This is a quick tip on how to use the `dataBind` Grails command outside of a Grails controller.

```groovy
import org.codehaus.groovy.grails.web.metaclass.BindDynamicMethod

class DataBinder {

    private static BindDynamicMethod bindDynamicMethod = new BindDynamicMethod()

    /**
     * Makes the controller's bindData method statically available,
     * for example, for use in the service layer.
     * Implemented as a closure to allow static import,
     * emulating controller layer bindData usage 1:1.
     */
    static Closure bindData = { Object[] args ->
        bindDynamicMethod.invoke(args ? args[0] : null, BindDynamicMethod.METHOD_SIGNATURE, args)
    }
}

// Usage example
class TestBind {
    public void intermediateNotification(Map params) {
        Test test = new Test()
        DataBinder.bindData(test, params)
        test.save()
    }
}
```
