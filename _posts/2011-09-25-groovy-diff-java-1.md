---
layout: post
title: Groovy: An Introduction to its Core Concepts
date: 2011-09-25 21:05:00
description: An introduction to the Groovy programming language, covering its core concepts, fundamental differences from Java, productivity features, operators, data types, collections, and regular expression support.
tags: groovy, java, jvm, programming, dynamic-language, operators, collections, regular-expressions
categories: groovy-concepts, programming-languages
---

## What is Groovy all about?

**Groovy** is a [dynamic programming language](http://en.wikipedia.org/wiki/Dynamic_programming_language) that runs on the JVM. This means it is compiled to Java bytecode and then executed on the Java Virtual Machine. You can read more about its features and download Groovy from the [official website](http://groovy.codehaus.org/).

After unpacking or installing Groovy, you can use the Groovy console (located at `$GROOVY_HOME/bin/groovyConsole`) for writing and experimenting with Groovy scripts.

Groovy aims to provide greater productivity compared to Java (and other mainstream object-oriented languages), and it excels at this.

A simple "hello world" in Groovy (no `main` method or anything required):

```groovy
println "Hello programmers!"
```

## Basic Differences

Almost all Java code is valid Groovy code, allowing for seamless mixing of Java and Groovy within your projects.

- Groovy provides more default imports than Java, including `java.io`, `java.math`, `java.util`, `java.net`, `groovy.lang`, and `groovy.util`. This is because a significant percentage of Java classes utilize these packages.
- In Groovy conditional statements, both `null` values and empty collections evaluate to `false`. For example:

  ```java
  Map map = new HashMap();
  // In Java you must do following for example:
  if (map != null && map.size() > 0) {
    // ...
  }
  // In Groovy this is enough:
  if (!map) {
    // ...
  }
  ```

  Similarly, an empty string also evaluates to `false`.

- `public` is the default visibility for classes, fields, constants, and methods in Groovy, contrasting with Java's package-private default visibility.
- Unlike Java, where the compiler forces you to catch `checked exceptions`, Groovy does not require this. While this can lead to cleaner code and remove a sense of false security, the decision of whether to catch these exceptions depends on your specific problem domain.

## Silent Helpers

Groovy offers several features that enhance productivity by removing unnecessary syntax from Java equivalents and replacing it with smart defaults.

- **Semicolons**: In Groovy, semicolons are generally optional. However, if you place multiple statements on a single line, you must separate them with semicolons.
- **Parentheses**: While generally required, parentheses are optional in a few specific cases, such as with the `println` command or closures (which will be discussed in the second part of this tutorial).
- **`return` statement**: In non-void methods, the `return` statement is often optional. Groovy automatically returns the result of the last evaluated expression. For example:

  ```groovy
  private boolean something() {
      "a" == "b"
  }
  // Will return "false".
  ```

  However, it is often advisable to use the `return` statement explicitly for better code readability.

## Properties (fields)

Groovy provides field access notation for Java bean properties (or fields). It automatically generates getters and setters for private fields behind the scenes. To leverage this, simply leave the default visibility on your fields. For example:

```groovy
Date date = new Date()
// You can access all Java bean properties
// using their field name.
println date.time
// prints some long number...

class MyClass {

    // Default visibility for fields is private,
    // but Groovy generates setters and getters
    // behind the scenes.
    String firstName
    String lastName

    // Compiles without problem.
    public static void access() {
        MyClass myClass = new MyClass()
        myClass.firstName = "John"
    }
}
```

## Constructors

In Groovy, you can instantiate beans using a **list of named arguments**. This powerful feature allows you to effectively treat maps as objects that can be passed around. For example:

```groovy
// Here we create a new SimpleDateFormat and set default
// values to some of its properties.
SimpleDateFormat format =
    new SimpleDateFormat(lenient: false, numberFormat: "ddMMyyyy")
```

## Added Operations

Groovy introduces several new operators not found in Java:

- **Null-safe operator (`?.`)**: This operator provides null-safe object navigation, similar to a null-checked dot (`.`) operator. For example:

  ```groovy
  // In Java, if you have an object named "obj" that
  // encapsulates an object named "field", you must do
  // the following to check if "field" is null:
  if (obj != null && obj.field != null) {
    // ...
  }

  // In Groovy, you can use the null-safe operator
  // for the same check and get the same result:
  if (obj?.value != null) {
    // ...
  }
  ```

  This operator helps avoid `java.lang.NullPointerException`s, making code safer and cleaner.

- **Elvis operator (`?:`)**: This is a shortened version of Java's ternary (if-then-else) operator. It's playfully called the 'Elvis Operator' due to its resemblance to Elvis Presley's trademark hair! For example:

  ```groovy
  // When using the ternary operator in Java,
  // you normally code something like this:
  Date date = (row.getDateFromDatabase() != null) ?
               row.getDateFromDatabase() : new Date();
  // In Groovy, you can get the same result by using the Elvis operator:
  Date date = row.getDateFromDatabase ?: new Date()
  // It automatically checks for null values.
  ```

- **Spread-dot operator (`*.`)**: This operator calls a method on every item within a collection. For example:

  ```groovy
  // This will create a new List with all employees' salaries.
  List employees = allEmployees*.getSalary()
  ```

  This eliminates the need to loop through a list simply to extract single properties into another list, offering a more concise and Groovy way of handling collections!

- **Spaceship operator (`<=>`)**: This operator is particularly useful when implementing the `Comparable` interface. In Java, correctly implementing the `int compare` method (returning negative if the first value is smaller, positive if bigger, or zero otherwise) requires careful attention to the API specification. Groovy simplifies this with the spaceship operator, which performs exactly this comparison:

  ```groovy
  // This method will properly compare
  // (in correspondence to Java API) two integers.
  public int compare(int number1, int number2) {
    return number1 <=> number2
  }
  ```

- **Equals operator (`==`)**: In Groovy, `==` is equivalent to Java's `equals()` method. It is null-safe, meaning it will not throw a `NullPointerException` when dealing with null values. It's important to note that if an object implements the `Comparable` interface, `==` will use the `compareTo()` method rather than `equals()`. For identity comparison, you can use the `is()` method.

## Basic Types in Groovy

In Groovy, you have access to all primitive Java types, along with some Groovy-specific types. Additionally, you can benefit from Groovy's syntactic sugar when working with basic types.

- **Numbers**: Groovy treats primitive types as objects, allowing you to call methods on them. For example:

  ```groovy
  // This is perfectly legal in Groovy
  222222.abs()
  // Although not so useful in this particular
  // example.
  ```

  Groovy uses `BigDecimal` for floating-point calculations. While potentially slower than `long` and `double`, it eliminates the common quirks and precision issues associated with `float` and `double`.

- **Strings**: While Java `String`s can be used, Groovy offers several advantages, most notably **embedded Groovy expressions** within strings. Anything enclosed within `${}` will be evaluated and interpolated into the string.

  ```groovy
  int amount = 255
  Date today = new Date()

  String out = "Something, something, ${today} is amount: ${amount}"

  println out
  // This will print the following:
  // Something, something, Sun Sep 25 18:34:52 CEST 2011 is amount: 255
  ```

  This eliminates the need for clumsy Java string concatenation, improving readability and conciseness.

  **Multiline strings (`"""`)** are another Groovy extension. They allow you to easily create string literals that span multiple lines and include line breaks.

  ```groovy
  // So this is how you used to do this in Java:
  String bla1 = "Something, something,..." + "\n\n" +
                "              Another thing...."
  // Same code in Groovy:
  String bla1 = """Something, something,...

                  Another thing...."""
  ```

  This avoids the need for `+ "\n" +` concatenation for multiline strings.

- **`as` operator**: This is a powerful casting operator (similar to Java's `(String) someObject`) but with extended capabilities. It can cast `String`s to `Number`s (and vice-versa), `List`s to `Array`s (and vice-versa), `Set`s to `List`s or `Array`s (and vice-versa), and even `String`s to `List`s (and vice-versa). For example:

  ```groovy
  int number = ("12345" as int) - 1
  println number
  // 12344
  boolean isEqual = 123 as String == "123"
  // true
  println isEqual
  List abcList = "abc" as List
  println abcList
  // [a, b, c]
  ```

  These features are precisely what one would expect from a dynamic scripting language and are quite powerful.

## Maps, Lists, and Ranges

Groovy integrates list and map concepts more naturally into its type system.

- **Lists and Maps**: Groovy offers a more natural syntax for defining Lists and Maps compared to Java. It uses comma-separated sequences of items enclosed in square brackets for definition. Let's look at some examples:

  ```groovy
  // In Java
  List cars1 = new ArrayList();
  cars1.add("Citroen");
  cars1.add("Audi");
  // [Citroen, Audi]

  // In Groovy
  List cars2 = ["Citroen", "Audi"]
  // [Citroen, Audi]

  // Maps in Groovy (you know the Java part ;) )
  Map map1 = ["amount" : 15, "size" : 5]

  // Empty list
  List l = []
  // Empty map
  Map m = [:]

  // Get element from List
  String car = cars2[1]

  // Get element from Map
  String amount = map1["amount"]

  // Add item to list (somewhat different)
  cars2 << "Ferrari"
  // [Citroen, Audi, Ferrari]

  // Add item to map
  map1["mass"] = 55
  ```

- **Ranges**: Ranges are related to lists and represent a combination of a lower and upper bound. In the case of an integer range, this includes all numbers between the two bounds (inclusive). For example:

  ```groovy
  List computerComponents = ["Monitor", "CPU", "GPU", "Mem", "HDD"]
  // [Monitor, CPU, GPU, Mem, HDD]

  // Here you define only a subset of the previous list.
  List subComponents = computerComponents[1..2]
  // [CPU, GPU]
  ```

## Regular Expressions

Groovy provides first-class support for regular expressions at the language level, introducing new literals, operators for matching, and a concise syntax for extracting groups. While regular expressions are a complex topic on their own and beyond the full scope of this introductory article, it's important to note that Groovy uses forward slashes (not backslashes, like Java) for defining regular expressions. It also introduces two new operators for matching:

- **`=~`**: This operator checks if the pattern on the right side can be _found anywhere_ within the string on the left side. It returns a `Matcher` object, which evaluates to `true` in a boolean context if a match is found.
- **`==~`**: This operator checks if the string on the left side _exactly matches_ the entire pattern on the right side. It returns `true` for an exact match, `false` otherwise.

Example:

```groovy
println "999999" ==~ /\d+/
// true

println "mercury9" ==~ /\d+/
// false

println "mercury" ==~ /\w+/
// true
```

## What is Groovy missing

Groovy is not missing much, but some features not present (or different) from Java include:

- Character literals.
- Java-like `for` loop (specifically, the lack of a comma operator for multiple initializations/increments).
- `do...while` loops.
- Inner and anonymous classes (though closures, to be covered in Part 2 of this tutorial, and the ability to declare multiple classes in a single Groovy file, mitigate this).
