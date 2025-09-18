---
layout: post
title: Application Load Balancer - Host- and Path-Based Routing for Multiple ECS Services
date: 2022-04-28 22:58:00
description: This post explains how to leverage a single AWS Application Load Balancer for multiple Amazon ECS services using a combination of host- and path-based routing rules, enhancing efficiency and reducing costs.
tags: aws, alb, ecs, fargate, load-balancing, routing, cloud
categories: aws-cloud
---

Since 2017, Amazon Application Load Balancers (ALB) have supported host-based routing. Previously, only path-based (content-based) routing was available. This means ALBs now support both host- and path-based rules, allowing you to combine these routing types to create complex traffic management rules for your services.

For a detailed explanation on how to combine both routing types, refer to this Stack Overflow answer: [Combining Host and Path-Based Rules](https://stackoverflow.com/a/46304567).

## The Challenge of Routing to Multiple ECS Services

This article will demonstrate how to utilize a single Application Load Balancer (ALB) to route traffic to multiple, distinct Amazon ECS services.

Consider a scenario where you have 30 ECS services running on AWS Fargate, but only 10 of them need to be publicly exposed. Using a separate ALB for each exposed ECS service would be inefficient and costly. To address this, AWS enables ALBs to route traffic to various target groups (where an ECS service can be a prime example of a target group) based on defined rules. This approach allows a single ALB to efficiently direct traffic to the appropriate ECS service.

## Practical Implementation Example

Below is a practical example illustrating how to implement this architecture, with comments providing specific details. The full code example can be found in the following GitHub Gist:

[GitHub Gist: ALB Routing Example](https://gist.github.com/spookysleeper/72085ce300f4af9fcfa1dbd1836be1be.js)