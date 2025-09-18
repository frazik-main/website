---
layout: post
title: Google App Engine Push Technology with Long Polling
date: 2013-05-05 22:15:00
description: An explanation of Google App Engine's push technology using long polling, detailing client-server communication channels, an example application, and code snippets for client-side JavaScript and server-side Java implementation.
tags: google app engine, gae, long polling, push technology, javascript, java, web development
categories: google-app-engine, web-development
---

Google App Engine (GAE) uses long polling as a push technology.

It employs two HTTP connections to the server. When the client has data to send to the server, it initiates an HTTP connection and posts the data. The client also maintains a long-lived HTTP connection to the server, which the server uses to send data back to the client. We refer to the first type of connection as the _send channel_ and the second as the _receive channel_. Together, these two unidirectional channels provide a bidirectional communication pathway between the browser and the server.

In this example, we will leverage GAE's push technology support. It's important to note, however, that it doesn't support full-duplex communication directly; the client sends HTTP POST requests to the server. While this approach might be somewhat slow, I believe it's sufficient for non-aggressive client state refreshes.

## Example Application

I created an example application on GAE, demonstrated in this YouTube video:

[![GAE Long Polling Demo](http://i.ytimg.com/vi/8DF2dr7EFXY/0.jpg)](http://www.youtube.com/watch?v=8DF2dr7EFXY)

This example shows four separate clients updating simultaneously, with each client painting the canvas in a different color.

You can also try it online here: [http://codingwithpassion.appspot.com/dots](http://codingwithpassion.appspot.com/dots)

Delete your browser cookies if you wish to restart the application.

## Client-Side Implementation

Developing a push-capable application involves orchestrating several moving parts. The client-side application needs to listen for changes and update its view accordingly. A second responsibility for the client is, of course, to send messages to the server when its state changes.

The client-side implementation should look something like this:

```javascript
// Some utility library for this example
var demolib = {};

demolib.sendMessage = function (path, opt_params) {
  if (opt_params) {
    path += opt_params;
  }
  var xhr = new XMLHttpRequest();
  console.log("Posting: " + path);
  xhr.open("POST", path, true);
  xhr.send();
};

demolib.writeCircle = function (xPos, yPos, color) {
  var canvas = document.getElementById("simpleCanvas");
  var context = canvas.getContext("2d");
  var radius = 10;
  context.beginPath();
  context.arc(xPos - radius, yPos - radius, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = "#003300";
  context.stroke();
};

demolib.onOpened = function () {
  demolib.sendMessage("/opened");
};

demolib.onMessage = function (m) {
  var newState = JSON.parse(m.data);
  if (newState.color != "${color}") {
    demolib.writeCircle(newState.x, newState.y, newState.color);
  }
};

demolib.openChannel = function () {
  var token = "${token}";
  var channel = new goog.appengine.Channel(token);
  var handler = {
    onopen: demolib.onOpened,
    onmessage: demolib.onMessage,
    onerror: function () {},
    onclose: function () {},
  };
  var socket = channel.open(handler);
  // The original code contained a syntax error and a redundant assignment:
  // 'onopen' = demolib.onOpened; // This line had a syntax error
  // socket.onmessage = demolib.onMessage; // Redundant as 'onmessage' is in handler
};

demolib.init = (function () {
  demolib.openChannel();
  var canvas = document.getElementById("simpleCanvas");
  canvas.onclick = function (e) {
    var centerX = e.pageX - canvas.offsetLeft;
    var centerY = e.pageY - canvas.offsetTop;
    var token = "${token}";
    var color = "${color}";
    console.log(centerX + " " + centerY);

    demolib.writeCircle(centerX, centerY, color);
    demolib.sendMessage("/play", "?x=" + centerX + "&y=" + centerY + "&color=" + color);
  };
  // The original code included this line, but calling onMessage without 'm' (message)
  // would likely cause an error or unexpected behavior.
  // demolib.onMessage();
})();
```

## Server-Side Channel Creation

On the server side, you need to create a channel for each client. In this example, we use user sessions to manage clients. To keep this example simple, only new clients from the same IP address are allowed (this helps in differentiating clients).

```java
public void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws IOException {
    try {
        HttpSession session = req.getSession();
        Integer colorIndex = (Integer)session.getAttribute(DotsServlet.COLOR_INDEX_ATTRIBUTE);
        colorIndex = colorIndex != null ? colorIndex + 1 : 0;
        if (colorIndex > Color.size() - 1) {
            noMoreClients(resp, Color.size());
        } else {
            session.setAttribute(DotsServlet.COLOR_INDEX_ATTRIBUTE, colorIndex);
            Color color = Color.getColorByIndex(colorIndex);
            String ipAddress = Game.getClientIpAddr(req);
            ChannelService channelService = ChannelServiceFactory.getChannelService();
            String token = channelService.createChannel(color + ipAddress);
            req.setAttribute("token", token);
            req.setAttribute("color", color.toString());
            req.getRequestDispatcher("/jsp/htmlsocket/dots.jsp").forward(req, resp);
        }
    } catch (ServletException exc) {
        exc.printStackTrace();
    }
}
```

## Server-Side Client Update

After receiving each message from a client, you need to update all relevant clients. Specifically, we are updating each client associated with the current IP address.

```java
for (int i = 0; i <= colorIndex; i++) {
    String user = Color.getColorByIndex(i).toString();
    ChannelService channelService = ChannelServiceFactory.getChannelService();
    String ipAddress = Game.getClientIpAddr(request);
    String channelKey = user + ipAddress;
    channelService.sendMessage(new ChannelMessage(channelKey, getMessageString(x, y, color)));
}
```

That's basically it. You can also update each client when a new client connects, by using the `socket.onopen` event.

```

```
