// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2022-08-04-serverless-react/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2012-04-10-faces-generator-1.0/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2012-03-29-testing-grail/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2011-10-14-book-clean-code/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-10-04-java-strategy-design-pattern/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-29-javascript-jquery-trigger/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-28-dynamic-typing-plsql/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-14-plsq-cut-down-round-trips/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-07-javascript-concepts-part4/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-06-plsql-collections-as-columns/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-06-javascript-concepts-part3/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-03-caching-data-plsql/";
        
      },
    },{id: "post-",
      
        title: "",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/2010-09-02-plsq-collections/";
        
      },
    },{id: "post-optimizing-large-language-models-a-look-at-key-techniques",
      
        title: "Optimizing Large Language Models A Look at Key Techniques",
      
      description: "An introduction to key techniques for optimizing Large Language Models (LLMs), including Retrieval-Augmented Generation (RAG), Chaining Transformers, Prompt Engineering, and Transfer Learning and Fine-tuning.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/modern-techniques-llm-perf/";
        
      },
    },{id: "post-nginx-reverse-proxy-for-amazon-opensearch-kibana-with-ansible",
      
        title: "Nginx Reverse Proxy for Amazon OpenSearch Kibana with Ansible",
      
      description: "A guide on how to set up access to Amazon OpenSearch Service Kibana using an Nginx reverse proxy, provisioned with Ansible. This includes defining inventory, creating a main playbook, and configuring Nginx for basic proxying.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2022/kibana-reverse-proxy/";
        
      },
    },{id: "post-application-load-balancer-host-and-path-based-routing-for-multiple-ecs-services",
      
        title: "Application Load Balancer - Host- and Path-Based Routing for Multiple ECS Services",
      
      description: "This post explains how to leverage a single AWS Application Load Balancer for multiple Amazon ECS services using a combination of host- and path-based routing rules, enhancing efficiency and reducing costs.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2022/alb-rules-terraform/";
        
      },
    },{id: "post-exporting-react-components-to-pdf",
      
        title: "Exporting React Components to PDF",
      
      description: "A guide on exporting React.js components to PDF using html2canvas to create canvas objects and pdfMake to generate the PDF document.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2020/react-pdf-export/";
        
      },
    },{id: "post-what-programming-language-pays-the-most-in-slovakia",
      
        title: "What Programming Language Pays the Most in Slovakia?",
      
      description: "An analysis using web crawling and NLP techniques on Slovak job ads to determine the most in-demand and highest-paying programming languages in the local job market.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2019/profesia-jobs/";
        
      },
    },{id: "post-serverless-architectures",
      
        title: "Serverless Architectures",
      
      description: "An overview of Serverless Architectures, a modern approach to application design. This post covers what serverless is, its key characteristics, and a balanced look at its upsides and downsides.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/serverless-arch/";
        
      },
    },{id: "post-truffle-contract-execution-errors-and-solutions",
      
        title: "Truffle Contract Execution Errors and Solutions",
      
      description: "Common errors encountered when executing contract functions from Truffle scripts and how to resolve them.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/truffle-external-script/";
        
      },
    },{id: "post-resolving-39-cannot-read-property-39-apply-39-of-undefined-39-in-truffle-external-scripts",
      
        title: "Resolving &#39;Cannot Read Property &#39;apply&#39; of undefined&#39; in Truffle External Scripts",
      
      description: "A guide to troubleshoot and resolve common TypeError issues, specifically &#39;Cannot read property &#39;apply&#39; of undefined&#39;, when executing external scripts with Truffle.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/truffle-script-example/";
        
      },
    },{id: "post-what-are-smart-contracts",
      
        title: "What Are Smart Contracts?",
      
      description: "An introduction to smart contracts, their history, how they work, and their execution on the Ethereum blockchain using Solidity and Web3.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/ehtereum-solidity/";
        
      },
    },{id: "post-understanding-java-memory-leaks",
      
        title: "Understanding Java Memory Leaks",
      
      description: "This post delves into Java memory management, common types of OutOfMemoryError, and demonstrates how to create various memory leaks like byte, list, map key, and class leaks with practical examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/intentional-memory-leak/";
        
      },
    },{id: "post-introduction-to-java-8-stream-api",
      
        title: "Introduction to Java 8 Stream API",
      
      description: "An overview of the Java 8 Stream API, covering its definition, core characteristics like pipelining and internal iteration, and the distinction between intermediate and terminal operations, alongside its benefits for collection processing.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/java-8-streams/";
        
      },
    },{id: "post-javascript-promises-an-introduction",
      
        title: "JavaScript Promises - An Introduction",
      
      description: "An introduction to JavaScript Promises, explaining their purpose in handling asynchronous operations, addressing callback hell, and demonstrating a basic implementation.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/js-promisses/";
        
      },
    },{id: "post-introduction-to-solid-principles-in-object-oriented-design",
      
        title: "Introduction to SOLID Principles in Object-Oriented Design",
      
      description: "An introduction to the SOLID principles of object-oriented design, outlining what the acronym stands for and common pitfalls to avoid.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/solid-object-oriented/";
        
      },
    },{id: "post-java-profiling-built-in-tools",
      
        title: "Java Profiling - Built-in Tools",
      
      description: "An introduction to Java profiling, covering common performance issues and essential built-in JDK tools like jmap, jstack, jconsole, and VisualVM, along with mentions of specialized profilers.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/java-build-profiling/";
        
      },
    },{id: "post-refactoring-conditional-logic-with-polymorphism",
      
        title: "Refactoring Conditional Logic with Polymorphism",
      
      description: "This post explores refactoring complex conditional statements (like switch or if-else ladders) into a more maintainable and object-oriented polymorphic design, demonstrating how it enhances code readability and extensibility.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/transform-if-polym/";
        
      },
    },{id: "post-erasure-bridge-method",
      
        title: "Erasure Bridge Method",
      
      description: "An in-depth look at how Java implements generics through type erasure, including the steps involved, its compile-time nature, and the role of synthetic bridge methods in preserving polymorphism, illustrated with code examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/erasure-bridge-method/";
        
      },
    },{id: "post-groovy-memoization-with-memoize",
      
        title: "Groovy Memoization with .memoize()",
      
      description: "An explanation and example of Groovy&#39;s memoize() method for caching closure results to improve performance, particularly in computationally intensive or recursive scenarios.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/groovy-memoization/";
        
      },
    },{id: "post-using-grails-databind-outside-a-controller",
      
        title: "Using Grails dataBind Outside a Controller",
      
      description: "A quick tip demonstrating how to use the Grails `dataBind` command outside of a Grails controller, for instance, in a service layer.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/grail-databind/";
        
      },
    },{id: "post-simple-remote-logger-for-android",
      
        title: "Simple Remote Logger for Android",
      
      description: "A guide to implementing a basic remote logger for Android applications, allowing logs to be sent from the device to a backend server for centralized monitoring.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/android-logger/";
        
      },
    },{id: "post-simplifying-android-context-access-globally",
      
        title: "Simplifying Android Context Access Globally",
      
      description: "Learn how to store and access your Android application context globally using a static field in your custom Application class, reducing the need to pass it around.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/context-android/";
        
      },
    },{id: "post-streamlining-google-analytics-integration-in-android-with-activity-lifecycle-callbacks",
      
        title: "Streamlining Google Analytics Integration in Android with Activity Lifecycle Callbacks",
      
      description: "Learn how to integrate Google Analytics into your Android application more cleanly using ActivityLifecycleCallbacks instead of manual onStart and onStop calls in every Activity.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/google-android-analytics/";
        
      },
    },{id: "post-a-custom-blocking-queue-implementation-in-java",
      
        title: "A Custom Blocking Queue Implementation in Java",
      
      description: "Explore a custom implementation of a blocking queue in Java, complete with worker threads and the &#39;poison pill&#39; termination technique. This article demonstrates fundamental concurrency concepts and serves as a learning exercise compared to using Java&#39;s built-in `BlockingQueue`.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/java-consumer-producer/";
        
      },
    },{id: "post-java-passing-arrays-and-collections-as-method-arguments",
      
        title: "Java - Passing Arrays and Collections as Method Arguments",
      
      description: "A guide on how to pass array instances directly to methods in Java, and a technique using anonymous inner classes with instance initialization for collections.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/add-element-single-line/";
        
      },
    },{id: "post-how-to-create-threads-in-java",
      
        title: "How to Create Threads in Java",
      
      description: "Explore two common methods for creating new threads in Java: implementing the Runnable interface or extending the Thread class and overriding its run() method.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/threads-java/";
        
      },
    },{id: "post-book-improving-design",
      
        title: "Book Improving Design",
      
      description: "A recommendation for the book &#39;Refactoring: Improving the Design of Existing Code&#39;, highlighting its value for developers looking to enhance their coding skills.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/book-improving-design/";
        
      },
    },{id: "post-interviews-with-it-pioneers-ward-cunningham-and-barbara-liskov",
      
        title: "Interviews with IT Pioneers: Ward Cunningham and Barbara Liskov",
      
      description: "Insights from computing pioneers Ward Cunningham on Agile and knowledge sharing, and Barbara Liskov on the Liskov substitution principle and distributed systems, through their QCon interviews.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/barbra-liskov/";
        
      },
    },{id: "post-effective-java-the-builder-pattern",
      
        title: "Effective Java - The Builder Pattern",
      
      description: "Explore the Builder Pattern as an elegant solution for handling a large number of optional parameters in constructors, addressing limitations of telescopic constructors and JavaBeans.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/design-pattern-builder/";
        
      },
    },{id: "post-visitor-design-pattern",
      
        title: "Visitor Design Pattern",
      
      description: "An explanation of the Visitor design pattern, demonstrating how to define new operations on objects without modifying their classes, using a Java example with vehicle fuel efficiency calculations.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/design-pattern-visitor/";
        
      },
    },{id: "post-google-app-engine-push-technology-with-long-polling",
      
        title: "Google App Engine Push Technology with Long Polling",
      
      description: "An explanation of Google App Engine&#39;s push technology using long polling, detailing client-server communication channels, an example application, and code snippets for client-side JavaScript and server-side Java implementation.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/google-app-engine-api/";
        
      },
    },{id: "post-facade-pattern-and-session-facade",
      
        title: "Facade Pattern and Session Facade",
      
      description: "An explanation of the Facade Pattern, a structural design pattern that simplifies complexity and decouples code, along with a detailed look at the Session Facade, which encapsulates client-server interactions.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/design-pattern-facade/";
        
      },
    },{id: "post-understanding-threadlocal-in-java",
      
        title: "Understanding ThreadLocal in Java",
      
      description: "Explore the concept of ThreadLocal in Java, its unique scope, global access within a thread, and common use cases in web applications and as an alternative to object pools.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/threadlocal-java/";
        
      },
    },{id: "post-java-reference-types-strong-weak-and-soft-references",
      
        title: "Java Reference Types - Strong, Weak, and Soft References",
      
      description: "An overview of different reference types in Java, including strong, weak, and soft references, explaining their behavior with the garbage collector and common use cases like caching.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/java-weak-references/";
        
      },
    },{id: "post-command-pattern",
      
        title: "Command Pattern",
      
      description: "An introduction to the Command pattern, including its definition, use cases, and an example demonstrating complete decoupling between sender and receiver.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/design-pattern-command/";
        
      },
    },{id: "post-svn-revert-to-a-previous-revision-using-reverse-merge",
      
        title: "SVN: Revert to a Previous Revision Using Reverse Merge",
      
      description: "Learn how to revert a Subversion (SVN) repository to a previous revision or undo specific changes using the reverse merge command.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/unmerge-svn/";
        
      },
    },{id: "post-fetching-rss-feeds-with-the-rome-library-in-java",
      
        title: "Fetching RSS Feeds with the ROME Library in Java",
      
      description: "A quick guide on how to use the ROME library in Java to easily fetch and parse RSS feeds, including a practical code example.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/rss-java/";
        
      },
    },{id: "post-douglas-crockford-and-javascript-39-s-expanding-role",
      
        title: "Douglas Crockford and JavaScript&#39;s Expanding Role",
      
      description: "An exploration of Douglas Crockford&#39;s influence on the JavaScript community, the language&#39;s unexpected rise beyond browser confines, and his insights on functional programming and avoiding classical methodologies.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/douglas-javascript/";
        
      },
    },{id: "post-koch-snowflake-animation-with-html5-canvas",
      
        title: "Koch Snowflake Animation with HTML5 Canvas",
      
      description: "An exploration of the Koch snowflake fractal, demonstrating its recursive implementation through an animation using HTML5 Canvas and JavaScript.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/koch-curve/";
        
      },
    },{id: "post-java-concurrency-strategies",
      
        title: "Java Concurrency Strategies",
      
      description: "Exploring various concurrent programming strategies in Java, including single-threaded, simple multi-threaded, thread pooling, and the Future and Callable mechanisms, along with a performance comparison.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/java-concurrency/";
        
      },
    },{id: "post-apache-solr-and-apache-nutch-integration-tutorial",
      
        title: "Apache Solr and Apache Nutch Integration Tutorial",
      
      description: "A quick guide to finding a useful tutorial on integrating Apache Solr with Apache Nutch, pointing to the official Nutch wiki.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2012/apache-nutch-solr/";
        
      },
    },{id: "post-groovy-and-java-closures-and-dynamic-programming",
      
        title: "Groovy and Java - Closures and Dynamic Programming",
      
      description: "This post explores key differences between Groovy and Java, focusing on Groovy&#39;s closures and its dynamic programming capabilities, with practical code examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/groovy-diff-java-2/";
        
      },
    },{id: "post-grails-file-upload-example",
      
        title: "Grails File Upload Example",
      
      description: "A working snippet for uploading files in Grails, including controller logic and GSP form example.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/upload-with-grail/";
        
      },
    },{id: "post-groovy-diff-java-1",
      
        title: "Groovy Diff Java 1",
      
      description: "An introduction to the Groovy programming language, covering its core concepts, fundamental differences from Java, productivity features, operators, data types, collections, and regular expression support.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/groovy-diff-java-1/";
        
      },
    },{id: "post-why-learn-scheme-understanding-functional-programming-for-javascript",
      
        title: "Why Learn Scheme? Understanding Functional Programming for JavaScript",
      
      description: "An introduction to Scheme, highlighting its benefits for understanding JavaScript, its core functional programming concepts, and basic syntax with illustrative examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/scheme-func-programming/";
        
      },
    },{id: "post-passing-structured-data-to-oracle-pl-sql-stored-procedures-with-java",
      
        title: "Passing Structured Data to Oracle PL/SQL Stored Procedures with Java",
      
      description: "Learn how to pass structured data, including multiple rows and columns, from Java to Oracle PL/SQL stored procedures using Oracle-specific ARRAY and STRUCT objects.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/plsql-multiple-rows/";
        
      },
    },{id: "post-java-design-patterns-decorator-wrapper",
      
        title: "Java Design Patterns - Decorator (Wrapper)",
      
      description: "An explanation of the Decorator design pattern in Java, including its definition, implementation examples, and a demonstration of how it adds functionality to objects dynamically.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/design-pattern-generator/";
        
      },
    },{id: "post-introducing-the-jdeveloper-adf-view-controller-generator",
      
        title: "Introducing the JDeveloper ADF View Controller Generator",
      
      description: "An introduction to a JDeveloper plugin for generating Oracle ADF view controller projects from a model project, emphasizing its benefits for prototyping and customization over existing tools like Oracle HeadStart.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/faces-gen/";
        
      },
    },{id: "post-developing-an-android-2d-game-hexxagon-like",
      
        title: "Developing an Android 2D Game - Hexxagon-like",
      
      description: "A tutorial on developing a 2D Android game similar to Hexxagon, covering game rules, class design, UI, and animation using Java 2D interfaces.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/android-game/";
        
      },
    },{id: "post-using-xpath-in-java",
      
        title: "Using XPath in Java",
      
      description: "A guide to using XPath for XML document parsing and querying in Java, with practical code examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/xpath-java/";
        
      },
    },{id: "post-simple-saxon-xslt-transformation-example-using-java",
      
        title: "Simple Saxon XSLT Transformation Example using Java",
      
      description: "A simple and descriptive example of performing Saxon XSLT transformations using Java, including a code snippet and setup instructions.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/saxon-xslt/";
        
      },
    },{id: "post-speed-up-jdeveloper",
      
        title: "Speed up JDeveloper",
      
      description: "Tips to improve JDeveloper performance, focusing on memory management, component binding, and page complexity.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/slow-jdeveloper/";
        
      },
    },{id: "post-pl-sql-cursors-implicit-vs-explicit",
      
        title: "PL/SQL Cursors - Implicit vs. Explicit",
      
      description: "An introduction to PL/SQL cursors, differentiating between implicit and explicit cursors, their usage, and best practices with code examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/plsql-cursor/";
        
      },
    },{id: "post-pl-sql-packages-for-excel-and-word-automation-in-oracle-forms-webutil-ole2",
      
        title: "PL/SQL Packages for Excel and Word Automation in Oracle Forms (WEBUTIL, OLE2)",
      
      description: "PL/SQL packages for automating Excel and Word document creation and manipulation within Oracle Forms 10g applications using WEBUTIL and OLE2.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/plsql-word-excel/";
        
      },
    },{id: "post-mvc-concept",
      
        title: "MVC Concept",
      
      description: "An in-depth look at the Model-View-Controller (MVC) architectural pattern, its core components, application in web development, particularly with JSP and Servlets, and a discussion on related frameworks.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/desing-pattern-mvc/";
        
      },
    },{id: "post-why-jquery-and-adf-faces",
      
        title: "Why jQuery and ADF Faces?",
      
      description: "This post explores how to integrate the jQuery JavaScript library with Oracle ADF Faces applications, providing steps for including jQuery globally or on specific pages, and tips for locating ADF components.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2011/adf-custom-javascript-library/";
        
      },
    },{id: "post-jquery-and-animation",
      
        title: "jQuery and Animation",
      
      description: "This tutorial covers jQuery animation methods, from basic show/hide effects to complex custom animations using the animate() method, including practical examples and code snippets.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/jquery-animation/";
        
      },
    },{id: "post-jquery-plugin-development-guidelines",
      
        title: "jQuery Plugin Development Guidelines",
      
      description: "This article provides a simple guide for writing jQuery plugins, covering best practices such as naming conventions, handling the $ alias, complex parameter lists, and wrapper methods.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/jquery-plugin-create/";
        
      },
    },{id: "post-xslt-tutorial-transforming-xml-to-html",
      
        title: "XSLT Tutorial - Transforming XML to HTML",
      
      description: "An introduction to XSLT for XML document transformation, covering core concepts, functional programming influences, and a practical example of transforming weather XML into HTML.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/transform-xml-html/";
        
      },
    },{id: "post-recursion-in-xslt",
      
        title: "Recursion in XSLT",
      
      description: "A guide to using recursion in XSLT for XML document processing, covering templates, XPath, and an example of transforming F1 season data.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/recursion-xslt/";
        
      },
    },{id: "post-implementing-ajax-with-jquery-39-s-load-method",
      
        title: "Implementing AJAX with jQuery&#39;s load() Method",
      
      description: "A comprehensive guide to AJAX, comparing plain JavaScript with jQuery, and demonstrating how to use jQuery&#39;s powerful load() method for dynamic content updates. Includes cross-browser XMLHttpRequest handling, jQuery load() examples, and best practices for GET vs. POST requests.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/ajax-jquery/";
        
      },
    },{id: "post-java-collections-converting-to-arrays",
      
        title: "Java Collections - Converting to Arrays",
      
      description: "This post explains how to convert Java Collections to typed arrays using the Collection.toArray(T[] a) method, avoiding explicit casting.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/convert-java-list-array/";
        
      },
    },{id: "post-dynamically-loading-javascript-files-with-jquery-getscript",
      
        title: "Dynamically Loading JavaScript Files with jQuery.getScript()",
      
      description: "Learn how to dynamically load JavaScript files using jQuery&#39;s $.getScript() function, including practical examples.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/jquery-dynamic-loading/";
        
      },
    },{id: "post-tracking-sql-queries-in-adf-applications",
      
        title: "Tracking SQL Queries in ADF Applications",
      
      description: "Learn how to track and monitor SQL queries executed by View Objects in ADF applications by overriding the executeQueryForCollection method and extracting parameter values.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/adf-debug-query/";
        
      },
    },{id: "post-niklaus-wirth-on-programming-languages-and-verification",
      
        title: "Niklaus Wirth on Programming Languages and Verification",
      
      description: "Exploring Niklaus Wirth&#39;s profound insights on programming languages, the hardware-software gap, program verification, and his critiques of modern software development practices.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/niklaus-wirth/";
        
      },
    },{id: "post-design-pattern-template",
      
        title: "Design Pattern Template",
      
      description: "An introduction to creational design patterns, focusing on the Factory Method and Abstract Factory patterns, with Java examples and a comparison of their usage.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/design-pattern-template/";
        
      },
    },{id: "post-spring-framework-essentials-wiring-and-instantiating-java-pojo-beans",
      
        title: "Spring Framework Essentials - Wiring and Instantiating Java POJO Beans",
      
      description: "An introduction to the core concepts of the Spring framework, focusing on how to wire and instantiate Java POJO (Plain Old Java Object) beans using XML configuration, demonstrated with a practical Employee-Department system example.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/spring-beans/";
        
      },
    },{id: "post-dynamically-changing-sql-where-clause-in-adf-view-objects",
      
        title: "Dynamically Changing SQL WHERE Clause in ADF View Objects",
      
      description: "This post describes how to dynamically modify the SQL WHERE clause in an ADF View Object by overriding the `buildWhereClause` method, which is particularly useful for optimizing queries without creating new database indexes.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/oracle-adf-advance-dynamic-query/";
        
      },
    },{id: "post-xpath-navigating-and-querying-xml-documents",
      
        title: "XPath - Navigating and Querying XML Documents",
      
      description: "An introduction to XPath, explaining how to navigate and query XML documents using path expressions, predicates, and relative node selections.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/xpath-tutorial/";
        
      },
    },{id: "post-object-oriented-design-patterns-in-java-template-method",
      
        title: "Object-Oriented Design Patterns in Java - Template Method",
      
      description: "An introduction to the Template Method design pattern in Java, illustrating its use for controlling algorithm flow with abstract superclasses and concrete subclasses, including an example for JSON and XML object creation.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/template-method/";
        
      },
    },{id: "post-object-oriented-design-patterns-in-java-template-method",
      
        title: "Object-Oriented Design Patterns in Java - Template Method",
      
      description: "An introduction to the Template Method design pattern in Java, illustrating its use for controlling algorithm flow with abstract superclasses and concrete subclasses, including an example for JSON and XML object creation.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/java-template-method-pattern/";
        
      },
    },{id: "post-javascript-functions-a-deep-dive",
      
        title: "JavaScript Functions - A Deep Dive",
      
      description: "Exploring the deeper concepts of JavaScript functions, including their object nature and first-class status.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/javascript-concepts-part2/";
        
      },
    },{id: "post-javascript-concepts-objects",
      
        title: "JavaScript Concepts - Objects",
      
      description: "An introduction to objects in JavaScript, including object creation, properties, JSON notation, and the window object.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/javascript-concepts-part1/";
        
      },
    },{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
