---
layout: post
title: "Simple Remote Logger for Android"
date: 2014-06-06 16:39:00
description: "A guide to implementing a basic remote logger for Android applications, allowing logs to be sent from the device to a backend server for centralized monitoring."
tags: android, java, logging, remote, backend, development
categories: android-development
---

This post presents a simple implementation of a remote logger for Android. This logger can be used to send application logs from your Android app to a backend server.

```java
public final class Logger {

    // URI for dispatching reports to the server.
    public static final String DISPATCHER_REPORT_URI = App.getDispatcherUri() + "/vidLog/report";

    // Maximum number of logs to store before flushing.
    private static final int CAPACITY = 10;
    // Application-specific tag for logs.
    private static final String APPLICATION_LOG_TAG = "YourApp";
    // Thread-safe list to store logs.
    private static List<String> logs = new Vector<String>(CAPACITY);

    /**
     * Records a message to the log buffer. If the buffer capacity is exceeded,
     * logs are automatically flushed to the remote server.
     *
     * @param msg The log message to record.
     */
    public synchronized static void r(String msg) {
        if (logs.size() + 1 > CAPACITY) {
            flushRemote();
        }
        logs.add(buildLog(msg));
    }

    /**
     * Flushes the current log buffer to the remote server.
     * This operation is performed on a new thread to avoid blocking the UI thread.
     */
    public synchronized static void flushRemote() {
        final String formattedLogs = collectAndFormatLogs();

        Runnable sendLogs = new Runnable() {
            @Override
            public void run() {
                // Assuming HttpHelper.doPostRequest is implemented elsewhere
                // Replace YOUR_SERVER_URI with your actual server endpoint
                HttpHelper.doPostRequest(YOUR_SERVER_URI, "APP_LOG", formattedLogs);
            }
        };
        new Thread(sendLogs).start();

        logs.clear(); // Clear logs after dispatching
    }

    /**
     * Collects and formats all stored logs into a single string.
     *
     * @return A single string containing all collected logs, separated by newlines.
     */
    private static String collectAndFormatLogs() {
        StringBuilder logsFormatted = new StringBuilder();
        for (String log : logs) {
            logsFormatted.append(log).append("\n");
        }
        return logsFormatted.toString();
    }

    // Date formatter for consistent log timestamps.
    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss,SSS");

    /**
     * Builds a single log entry with a timestamp and application tag.
     *
     * @param msg The core log message.
     * @return The formatted log string.
     */
    private static String buildLog(String msg) {
        return sdf.format(new Date()) +
                " REMOTE " +
                APPLICATION_LOG_TAG + " " +
                msg;
    }
}
```

### Usage Example

```java
// Record a few messages
Logger.r("first message");
Logger.r("second message");

// When the CAPACITY is exceeded, logs will be flushed automatically.
// You can also force a flush at any time:
Logger.flushRemote();
```
