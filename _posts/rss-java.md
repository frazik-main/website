```yaml
---
layout: post
title: Fetching RSS Feeds with the ROME Library in Java
date: 2012-10-10 16:52:00
description: A quick guide on how to use the ROME library in Java to easily fetch and parse RSS feeds, including a practical code example.
tags: java, rss, rome, jdom, programming, library
categories: java, libraries
---

If you are looking for a simple library for RSS feeds, then look no further.

Just download the ROME library for Java, and you can get RSS feeds inside your Java program in about 10 minutes. Just don't forget to include the JDOM library in your CLASSPATH because ROME has a dependency on JDOM.

This code sample below is really self-explanatory. What a great library!

```java
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;
import java.util.List;

// Note: 'log' typically refers to an instantiated logger (e.g., from SLF4J, Log4j).
// Ensure your logging framework is configured if you use this code directly.
public class RssFetcher { // Assuming this method is part of a class

    public void getRssFeeds(String rssFeedurl) throws MalformedURLException, IOException, IllegalArgumentException, FeedException {
        URL url = new URL(rssFeedurl);
        HttpURLConnection httpcon = (HttpURLConnection) url.openConnection();

        SyndFeedInput input = new SyndFeedInput();
        SyndFeed feed = input.build(new XmlReader(httpcon));
        List<SyndEntry> entries = feed.getEntries();
        Iterator<SyndEntry> itEntries = entries.iterator();

        while (itEntries.hasNext()) {
            SyndEntry entry = itEntries.next();
            log.info("Title: " + entry.getTitle());
            log.info("Link: " + entry.getLink());
            log.info("Author: " + entry.getAuthor());
            log.info("Publish Date: " + entry.getPublishedDate());
            log.info("Description: " +
                    entry.getDescription().getValue());
        }
    }
}
```