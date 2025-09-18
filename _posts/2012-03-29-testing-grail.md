---
layout: post
title:" "Grails Controller Unit Testing""
date: 2012-03-29 16:30:00
description:" "This post details how to perform unit testing for controllers in Grails using ControllerUnitTestCase, including examples for mocking services.""
tags: grails, testing, unit-testing, controllers, groovy
categories: grails
---

To unit test a controller in Grails, you must extend `ControllerUnitTestCase`. Additionally, your test class needs to be in the same package as the controller under test, and its name should follow the pattern `<YourControllerName>Tests`.

That's it! Now, let's look at a code example.

## Simple Controller

```groovy
class SimpleController {

    def dateService

    def firstAction = {
        render "first"
    }

    def secondAction = {
        render "second"
    }

    def thirdAction = {
        render dateService.currentDateFormated()
    }
}
```

## Service

```groovy
class DateService {

    boolean transactional = true

    public String currentDateFormated() {
        return (new Date()).format("MM-dd-yyyy")
    }
}
```

## Unit Test for the Controller

```groovy
class SimpleControllerTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    public void testFirstAction() {
        controller.firstAction()
        assertEquals("first", controller.response.contentAsString)
    }

    public void testSecondAction() {
        controller.secondAction()
        assertEquals("second", controller.response.contentAsString)
    }

    public void testThird() {
        DateService dateService = new DateService()
        controller.dateService = dateService
        controller.thirdAction()
        assertEquals(dateService.currentDateFormated(), controller.response.contentAsString)
    }
}
```

If your controller references a service, you must explicitly initialize that service within your test, as demonstrated in the `testThird()` method of `SimpleControllerTests`.
