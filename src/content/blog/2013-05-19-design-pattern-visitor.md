---
layout: post
title: "Visitor Design Pattern"
date: 2013-05-19 00:37:00
description: "An explanation of the Visitor design pattern, demonstrating how to define new operations on objects without modifying their classes, using a Java example with vehicle fuel efficiency calculations."
tags: design-patterns, visitor, java, programming, object-oriented
categories: design-patterns
---

Visitor allows you to define a new operation (method) on an object without changing the classes (interface) of the elements on which it operates. This is the essence of the Visitor pattern. The name "Visitor" is somewhat misleading, as this pattern has nothing to do with visiting, iteration, or similar concepts. If you need to perform operations across a disparate set of objects, the Visitor pattern might be suitable for you. Let's explore how it works.

Let's presume we have a disparate object structure and we want to run a single operation on each object within this structure. Here's how it works:

The core of this pattern is the **Visitor** interface. This interface defines a `visit` operation for each type within the object structure. The object (an element from the structure) interface simply defines an `accept` method to allow the visitor to perform an action on that object. This `accept` operation grants the visitor access to the object.

Here's an example that will calculate the average "Per Seat Fuel Economy" for different types of vehicles. The calculation is quite simple: `consumption / number of seats`. Each vehicle is represented by simple POJOs (Plain Old Java Objects). Each of these objects has an `accept` method, providing access to the object through a unified interface.

### Interfaces:

```java
public interface Visitable {

    void accept(Visitor visitor);

}

public interface Visitor {

    void visit(Bike bike);
    void visit(Bus bus);
    void visit(Car car);

}
```

### Simple POJOs:

```java
public class Bike implements Visitable {

    private int consumption;

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Bike(int consumption) {
        this.consumption = consumption;
    }

    public int getConsumption() {
        return consumption;
    }

}

public class Bus implements Visitable {

    private int numberOfSeats;
    private int litersConsumption;

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Bus(int numberOfSeats, int litersConsumption) {
        this.numberOfSeats = numberOfSeats;
        this.litersConsumption = litersConsumption;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public int getLitersConsumption() {
        return litersConsumption;
    }

}

public class Car implements Visitable {

    private int consumption;
    private int weight;
    private int seats;

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Car(int consumption, int weight, int seats) {
        this.consumption = consumption;
        this.weight = weight;
        this.seats = seats;
    }

    public int getConsumption() {
        return consumption;
    }

    public int getWeight() {
        return weight;
    }

    public int getSeats() {
        return seats;
    }
}
```

Although these objects don't inherently know how to calculate average per-seat consumption, we will enable them to do so without modifying their original classes:

```java
public class EfficiencyVisitor implements Visitor {

    private int efficiency;

    @Override
    public void visit(Bike bike) {
        efficiency += bike.getConsumption() / 2;
    }

    @Override
    public void visit(Bus bus) {
        efficiency += bus.getLitersConsumption() / bus.getNumberOfSeats();
    }

    @Override
    public void visit(Car car) {
        efficiency += car.getConsumption() / car.getSeats() ;
    }

    public int getEfficiency() {
        return efficiency;
    }

}
```

### Client:

```java
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {

        int averageConsumptionPerSeat = 0;

        List <Visitable> vehicles = new ArrayList<>();

        Car mazda = new Car(6, 1024, 5);
        vehicles.add(mazda);
        Car skoda = new Car(7, 1200, 4);
        vehicles.add(skoda);
        Bus merc = new Bus(60, 30);
        vehicles.add(merc);
        Bike suzuki = new Bike(4);
        vehicles.add(suzuki);

        EfficiencyVisitor efficiencyVisitor = new EfficiencyVisitor();

        for (Visitable vehicle : vehicles) {
            vehicle.accept(efficiencyVisitor);
            averageConsumptionPerSeat += efficiencyVisitor.getEfficiency();
        }

        System.out.println(averageConsumptionPerSeat / vehicles.size());
    }
}
```

A key advantage of this pattern is the ease with which you can add new vehicle types or change existing methods without altering the interfaces or methods of the "old" vehicle types.

The primary purpose of this pattern is to clean up your code. It allows you to separate specific logic from the elements themselves, thereby keeping your data classes simple and focused.
