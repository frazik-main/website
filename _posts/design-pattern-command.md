```
---
layout: post
title: Command Pattern
date: 2012-12-31 00:34:00
description: An introduction to the Command pattern, including its definition, use cases, and an example demonstrating complete decoupling between sender and receiver.
tags: design-patterns, command-pattern, programming, java
categories: design-patterns
---

A **Command pattern** is an object behavioral pattern that allows us to achieve complete decoupling between the sender and the receiver. A *sender* is an object that invokes an operation, and a *receiver* is an object that receives the request to execute a certain operation.

This pattern allows the **requester** of a particular **action** to be decoupled from the object that performs the action.

The Command pattern encodes the details needed to send a message to an object. Such messages can be invoked at different times or locations in a general way without hard-coding their details. It allows messages to be invoked one or more times, or passed along to different parts of the system or multiple systems without requiring the specific invocation details to be known before execution.

## Object References vs. Function Pointers

Some languages (C, for example) support **function pointer** facilities that allow programs to store and transmit the ability to invoke a particular function. Java does not provide function pointers, but object references together with **dynamic loading and binding mechanisms** can be used to achieve a similar effect. This is where the Command pattern comes into play.

## Example

We will use a simple remote control for a CD player as an example. This basic CD player supports only basic commands (Play, Stop, and Pause), which is sufficient for our illustration of the Command pattern.

```java
// Cd Player that will be controlled by remote control
public class CdPlayer {

  public enum State {
    PAUSE, PLAY, STOP
  }

  private State state;

  public void pause() {
    state = State.PAUSE;
  }

  public void stop() {
    state = State.STOP;
  }

  public void play() {
    state = State.PLAY;
  }

  public State getState() {
    return state;
  }

}
```

```java
// Simple command interface.
public interface Command {
  void execute();
}
```

```java
// Cd Player remote control that will control the Cd Player through button press.
public class CdPlayerRemoteControl {

  private Command command;

  public void setCommand(Command command) {
    this.command = command;
  }

  public void pressButton() {
    command.execute();
  }
}
```

```java
// Cd Player play command.
public class CdPlayerPlayCommand implements Command {

  private CdPlayer cdPlayer;

  public CdPlayerPlayCommand(CdPlayer cdPlayer) {
    this.cdPlayer = cdPlayer;
  }

  public void execute() {
    cdPlayer.play();
  }

}
```

```java
// Cd Player pause command.
public class CdPlayerPauseCommand implements Command {

  private CdPlayer cdPlayer;

  public CdPlayerPauseCommand(CdPlayer cdPlayer) {
    this.cdPlayer = cdPlayer;
  }

  public void execute() {
    cdPlayer.pause();
  }

}
```

```java
// Stop command.
public class CdPlayerStopCommand implements Command {

  private CdPlayer cdPlayer;

  public CdPlayerStopCommand(CdPlayer cdPlayer) {
    this.cdPlayer = cdPlayer;
  }

  public void execute() {
    cdPlayer.stop();
  }

}
```

```java
// Client class that uses the remote control for CD Player operation.
public class Client {

  public static void main(String[] args) {
    CdPlayerRemoteControl cdPlayerRemoteControl = new CdPlayerRemoteControl();
    CdPlayer cdPlayer = new CdPlayer();

    Command play = new CdPlayerPlayCommand(cdPlayer);
    Command pause = new CdPlayerPauseCommand(cdPlayer);
    Command stop = new CdPlayerStopCommand(cdPlayer);

    // Play music
    cdPlayerRemoteControl.setCommand(play);
    cdPlayerRemoteControl.pressButton();

    // Stop music
    cdPlayerRemoteControl.setCommand(stop);
    cdPlayerRemoteControl.pressButton();

    // prints STOP
    System.out.println(cdPlayer.getState());

  }

}
```