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
        },{id: "post-dynamically-changing-sql-where-clause-in-adf-view-objects",
      
        title: "Dynamically Changing SQL WHERE Clause in ADF View Objects",
      
      description: "This post describes how to dynamically modify the SQL WHERE clause in an ADF View Object by overriding the `buildWhereClause` method, which is particularly useful for optimizing queries without creating new database indexes.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/oracle-adf-advance-dynamic-query/";
        
      },
    },{id: "post-custom-view-object-with-oracle-ref-cursor-in-adf",
      
        title: "Custom View Object with Oracle Ref Cursor in ADF",
      
      description: "This post demonstrates how to create a custom read-only view object in Oracle ADF JDeveloper, leveraging an Oracle REF CURSOR as an alternative data source. It covers initial JDeveloper setup, database package creation, and customizing the View Object implementation class.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/oracle-adf-advance-ref-cursor/";
        
      },
    },{id: "post-xpath-navigating-and-querying-xml-documents",
      
        title: "XPath - Navigating and Querying XML Documents",
      
      description: "An introduction to XPath, explaining how to navigate and query XML documents using path expressions, predicates, and relative node selections.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/xpath-tutorial/";
        
      },
    },{id: "post-strategy-pattern-in-java",
      
        title: "Strategy Pattern in Java",
      
      description: "A comparison of the Strategy pattern with the Template Method pattern in Java, showing differences and providing a code example.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/java-strategy-design-pattern/";
        
      },
    },{id: "post-java-template-method-pattern",
      
        title: "Java Template Method Pattern",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/java-template-method-pattern/";
        
      },
    },{id: "post-custom-events-in-jquery-a-powerful-technique",
      
        title: "Custom Events in jQuery - A Powerful Technique",
      
      description: "Learn how to create and use custom events in jQuery to simulate the observer pattern and build dynamic web applications.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/javascript-jquery-trigger/";
        
      },
    },{id: "post-using-pl-sql-39-s-any-types-for-dynamic-typing",
      
        title: "Using PL/SQL&#39;s ANY Types for Dynamic Typing",
      
      description: "Exploring PL/SQL&#39;s ANY types for handling data of unknown type at runtime.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/dynamic-typing-plsql/";
        
      },
    },{id: "post-using-pl-sql-collections-to-optimize-data-retrieval",
      
        title: "Using PL/SQL Collections to Optimize Data Retrieval",
      
      description: "Learn how to use PL/SQL collections to combine master and detail tables in a single SELECT statement, reducing database round trips and improving performance.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/plsq-cut-down-round-trips/";
        
      },
    },{id: "post-javascript-closures-a-deep-dive",
      
        title: "JavaScript Closures - A Deep Dive",
      
      description: "Understanding closures in JavaScript, a powerful concept for handling asynchronous callbacks.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/javascript-concepts-part4/";
        
      },
    },{id: "post-storing-collections-in-database-columns",
      
        title: "Storing Collections in Database Columns",
      
      description: "Demonstrates how to store collections in database columns using Oracle&#39;s VARRAY.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/plsql-collections-as-columns/";
        
      },
    },{id: "post-javascript-concepts-callbacks-and-function-context",
      
        title: "JavaScript Concepts - Callbacks and Function Context",
      
      description: "A deep dive into JavaScript callbacks and function context, exploring how `this` works and how to manage function contexts using `call()`",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/javascript-concepts-part3/";
        
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
    },{id: "post-caching-static-data-in-pl-sql-for-performance-improvement",
      
        title: "Caching Static Data in PL/SQL for Performance Improvement",
      
      description: "Optimize PL/SQL performance by caching static data in a collection stored in the session&#39;s PGA.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/caching-data-plsql/";
        
      },
    },{id: "post-pl-sql-collections-a-comprehensive-guide",
      
        title: "PL/SQL Collections A Comprehensive Guide",
      
      description: "A detailed explanation of associative arrays, nested tables, and VARRAYs in PL/SQL, including examples and best practices.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2010/plsq-collections/";
        
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
