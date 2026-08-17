---
layout: post
title: "Spring Framework Essentials - Wiring and Instantiating Java POJO Beans"
date: 2010-10-31 17:06:00
description: "An introduction to the core concepts of the Spring framework, focusing on how to wire and instantiate Java POJO (Plain Old Java Object) beans using XML configuration, demonstrated with a practical Employee-Department system example."
tags: spring, java, beans, dependency-injection, ioc, xml-configuration, programming
categories: spring-framework, java-programming
---

## Introduction

As we all know, the [Spring](http://www.springsource.org/) framework represents the standard in Java application development. It can be used in desktop applications or web applications. It can assist with database access, security, RMI, the web layer (MVC), and integrate with other technologies like GWT or Flex. There's also the promising Roo framework (with GWT or Flex front-ends), though its maturity is still a consideration.

The Spring framework's appeal lies in its simplicity, small footprint, and ability to be tested outside of a container.

In this article, we will become familiar with the framework's essential concepts: wiring and instantiating Java POJO classes (Beans).

The source code for the following examples can be downloaded from my [Google Code repository](http://code.google.com/p/codingwithpassionblog/downloads/detail?name=SpringBeans.zip&can=2&q=#makechanges).

## Spring Wiring

In Spring, components (mainly Java classes—nothing fancy like CORBA or DCOM, don't worry) are not responsible for managing their associations with other components; instead, references are passed through the container. Controlling associations between components (passing references from one place to another) is known as **wiring**. And this is at the heart of Spring's philosophy. These components are called **beans**, and they share similarities with Java Beans. This philosophy originated from one of the greatest books in the Java ecosystem: _Expert One-on-One J2EE Design and Development_.

Spring also acts as a bean factory (see my blog post about the factory pattern [here](http://codingwithpassion.blogspot.com/2010/11/object-oriented-design-patterns-in-java.html)). But unlike many implementations of the factory pattern, which often create only a single type of object, the Spring bean factory can create many different types of beans (e.g., lists, data sources, as you will see).

Of course, the container is at the core of the Spring framework. This container uses **Inversion of Control** (please see my post about the [Template Method design pattern](http://codingwithpassion.blogspot.com/2010/10/template-method-design-pattern.html) that follows this principle, also known as the Hollywood principle - "Don't call us, we will call you!") to manage component associations. There are several Spring containers; we will use the **ApplicationContext** container, which is the most widely used and provides the basic Spring features we will explore in this post.

I've chosen to use a simple Java application rather than a web application because there are already many examples of Spring in web applications, and this approach allows us to avoid additional configurations and complexities associated with web apps. For testing, we will not use JUnit, but a simple `public static void main` method.

In our simple Java application, we will use Spring 2.5.6 (chosen for its lightweight nature—1.2MB with only essential libraries—and potential future integration with Google App Engine). We will also use an XML file for bean wiring and definition. I prefer not to use annotations because they can intermingle with the code, potentially compromising the non-intrusive concept. I don't shy away from XML; I believe it's not inherently 'evil' if used in the right situations (like this one).

I will not delve into every detail of the Spring framework (such as the bean lifecycle), but will focus on demonstrating its main features through an example. This will be sufficient to learn the basic concepts. Let's begin!

## Example Introduction

We will implement a simple Employee (N):1 Department system. Besides classic CRUD operations, this system can find the largest department (the one with the most employees), assign an employee to that department, and remove an employee from a department.

## Example Service Layer

First, we will implement the service layer of our example application. This layer is at the top of the abstraction hierarchy. In the service layer, we define the operations our application should support.

There are two service components in the service layer, defined by interfaces (it's important to program **to an interface**, not an implementation!): `EmployeeService` and `DepartmentService`. The `EmployeeService` handles the following employee-related operations (essentially simple CRUD):

```java
public interface EmployeeService {

    Employee findEmployee(int employeeId);

    void removeEmployee(int employeeId);

    List<Employee> getAllEmployees();

    void createNewEmployee(Employee employee);

}
```

The `DepartmentService` provides the following operations:

```java
public interface DepartmentService {

    Department findDepartment(int departmentId);

    void createNewDepartment(Department department);

    void removeDepartment(int departmentId);

    List<Department> getAllDepartments();

    /**
     * Find department with largest number of employees.
     * @return The department with the largest number of employees.
     */
    Department findLargestDepartment();

    /**
     * Assign employee into department.
     * @param employee The employee to assign.
     * @param department The department to assign the employee to.
     */
    void assign(Employee employee, Department department);

    /**
     * Remove employee from department.
     * @param employeeId The ID of the employee to remove.
     * @param departmentId The ID of the department to remove the employee from.
     */
    void remove(int employeeId, int departmentId);

}
```

As you can see, the `DepartmentService` provides a couple of more complex operations than basic CRUD.

We have two classes that implement these two service interfaces:

`EmployeeService` concrete implementation:

```java
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeDao employeeDao;

    public Employee findEmployee(int employeeId) {
        return getEmployeeDao().findById(employeeId);
    }

    public void createNewEmployee(Employee employee) {
        getEmployeeDao().create(employee);
    }

    public void removeEmployee(int employeeId) {
        Employee deleteEmployee = getEmployeeDao().findById(employeeId);
        getEmployeeDao().delete(deleteEmployee);
    }

    public List<Employee> getAllEmployees() {
        return getEmployeeDao().retrieveAll();
    }

    public EmployeeDao getEmployeeDao() {
        return employeeDao;
    }

    public void setEmployeeDao(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }
}
```

`DepartmentService` concrete implementation:

```java
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentDao departmentDao;
    private EmployeeService employeeService;

    public Department findDepartment(int departmentId) {
        return getDepartmentDao().findById(departmentId);
    }

    public void createNewDepartment(Department department) {
        getDepartmentDao().create(department);
    }

    public List<Department> getAllDepartments() {
        return getDepartmentDao().retrieveAll();
    }

    public Department findLargestDepartment() {
        Department largestDepartment = getAllDepartments().size() > 0 ? getAllDepartments().get(0) : null;

        for (Department dep : getAllDepartments()) {

            if (dep.getEmployees().size() > largestDepartment.getEmployees().size()) {
                largestDepartment = dep;
            }
        }

        return largestDepartment;
    }

    public void removeDepartment(int departmentId) {
        Department deleteDepartment = findDepartment(departmentId);
        getDepartmentDao().delete(deleteDepartment);
    }

    public void assign(Employee employee, Department department) {
        if (department.getEmployees().size() < department.getMax()) {
            getEmployeeService().createNewEmployee(employee);
            getDepartmentDao().addEmployee(department, employee);
        }
    }

    public void remove(int employeeId, int departmentId) {

        Department department = findDepartment(departmentId);
        Employee deleteEmployee = getEmployeeService().findEmployee(employeeId);

        getDepartmentDao().removeEmployee(department, deleteEmployee);

        if (department.getEmployees().isEmpty())
            removeDepartment(departmentId);
    }

    public EmployeeService getEmployeeService() {
        return employeeService;
    }

    public void setEmployeeService(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    public DepartmentDao getDepartmentDao() {
        return departmentDao;
    }

    public void setDepartmentDao(DepartmentDao departmentDao) {
        this.departmentDao = departmentDao;
    }

}
```

There isn't much complexity in these services; as you can see, much of the responsibility is delegated to the underlying DAO (Data Access Object) bean. Data Access Object beans handle interactions with the database (or other types of data storage, such as flat files or vintage databases) to read and write employee and department information.

The implementations of these DAO beans are not crucial for understanding Spring basics, so I will omit them here (you can find the full implementation in the downloadable example if you're curious). Suffice it to say that the implementation of these DAO beans in this example is very simple, using only `java.util.List` to hold data. You will see how we initially populate this list using Spring; no persistence logic is implemented.

As you can see, both `EmployeeServiceImpl` and `DepartmentServiceImpl` can be given a reference to their respective DAO beans through a `set` method (e.g., `setEmployeeDao` and `setDepartmentDao`). You can also inject them through a constructor.

## Example Wiring

We've chosen XML as the strategy for bean wiring. Wiring beans is quite simple. We use the `<bean>` tags to define a Java Bean (or any Java object; it doesn't strictly need to be a Bean) to be configured with the Spring container.

Spring beans are singletons by default, but you can configure them as prototypes by setting the `singleton="false"` attribute on the bean element.

So, to define a `DepartmentService` bean (the `EmployeeService` bean is defined similarly), we have something like this:

```xml
<bean class="org.codingwithpassion.springbeans.services.DepartmentServiceImpl" id="departmentService">
    <property name="departmentDao">
        <ref bean="departmentDao"></ref>
    </property>
    <property name="employeeService">
        <ref bean="employeeService"></ref>
    </property>
</bean>
```

In this simple XML bean wiring, we define a bean with the ID `departmentService` and specify its fully qualified class name (this class is the concrete implementation, not the interface). At this point, we've added (registered) a bean into the Spring container, and now we can use this bean as needed.

Beans can have properties. These properties are essentially Java properties. We map these bean properties to their corresponding Java properties using XML.

This technique, for populating a bean property based on standard naming conventions, is called **Dependency Injection**. Of course, these Java properties need to have matching **getter** and **setter** methods (as in Java Beans or JSP/JSF backing beans). This process is at the core of the Spring framework (along with other concepts like Aspect-Oriented Programming - AOP, which I'll discuss later).

We can set properties with simple types (like `int`, `long`, `float`, `String`, etc.) or set references to other beans (any Java object) as in this example, using the `<ref>` tag. In this way, and in our example, we give `DepartmentServiceImpl` a reference to the class that implements the `DepartmentDao` interface (using `<ref bean="departmentDao"/>`).

Referencing other beans enables us to inject them into existing ones. This approach allows us to define references between classes within the Spring container rather than as part of the class logic itself. This leverages the job to Spring, helping us create cleaner, more maintainable code where references can be changed solely in the XML configuration.

We can also wire collections in Spring. In our example, we didn't use persistence logic or a database; we simply used `java.util.List` collections to hold data. We use Spring to inject this data into our DAO beans. We set a list of departments into a Java property named `departments`, which has the type definition `java.util.List<Department>`.

So, to populate a bean property with a list of departments, this list is defined in the Spring XML file as follows (I will show only one example):

```xml
<bean class="org.codingwithpassion.springbeans.domain.Department" id="department1">
    <property name="id">
        <value>1</value>
    </property>
    <property name="departmentName">
        <value>QA</value>
    </property>
    <property name="max">
        <value>2</value>
    </property>
    <property name="manager">
        <ref bean="emp1"></ref>
    </property>
    <property name="employees">
        <list>
            <ref bean="emp1"></ref>
        </list>
    </property>
</bean>
```

In this way, we initially populate a collection that is a list of Departments.

## Spring Test

In order to test Spring, you need to do the following:

```java
ApplicationContext context = new ClassPathXmlApplicationContext("simpleappcontext.xml");

EmployeeService employeeService = (EmployeeService)context.getBean("employeeService");

DepartmentService departmentService = (DepartmentService)context.getBean("departmentService");
```

First, get an instance of the `ApplicationContext` and read the bean definitions from the XML file named `simpleappcontext.xml`.
Then, simply retrieve beans by their names and use them.

Refer to my example for detailed insight.

```

```
