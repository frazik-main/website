---
layout: post
title: Simple Saxon XSLT Transformation Example using Java
date: 2011-03-15 11:39:00
description: A simple and descriptive example of performing Saxon XSLT transformations using Java, including a code snippet and setup instructions.
tags: java, xslt, saxon, xml, transformation, programming
categories: java, xml-transformation
---

When searching for a straightforward and descriptive example of Saxon XSLT transformation using Java, I found the existing resources to be lacking. Therefore, I created this example, hoping it will be useful to others.

Here is the code:

```java
import java.io.File;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

public class Main {

    /**
     * Simple transformation method.
     * @param sourcePath - Absolute path to the source XML file.
     * @param xsltPath - Absolute path to the XSLT file.
     * @param resultDir - Directory where you want to place the resulting files.
     */
    public static void simpleTransform(String sourcePath, String xsltPath,
                                       String resultDir) {
        TransformerFactory tFactory = TransformerFactory.newInstance();
        try {
            Transformer transformer =
                tFactory.newTransformer(new StreamSource(new File(xsltPath)));

            transformer.transform(new StreamSource(new File(sourcePath)),
                                  new StreamResult(new File(resultDir)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // Set Saxon as the transformer.
        System.setProperty("javax.xml.transform.TransformerFactory",
                           "net.sf.saxon.TransformerFactoryImpl");

        simpleTransform("d:/project/hob/AppModule.xml",
                        "d:/project/hob/create-fragment.xslt", "C:/");

    }
}
```

To run this example, ensure the Saxon library is included in your project's CLASSPATH. This code will generate the resulting file(s) in the root directory of your C: drive.

Enjoy experimenting!
