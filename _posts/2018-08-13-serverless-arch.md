---
layout: post
title: Serverless Architectures
date: 2018-08-13 12:21:00
description: An overview of Serverless Architectures, a modern approach to application design. This post covers what serverless is, its key characteristics, and a balanced look at its upsides and downsides.
tags: serverless, architecture, cloud, aws-lambda, azure-functions, faas, cloud-computing
categories: cloud-computing, software-architecture
---

## Serverless Architectures

Serverless Architectures (SA) represent a new approach to application design and are a hot topic in the software architecture world. All "Big Three" cloud providers (Amazon, Google, Microsoft) are investing heavily in "Serverless" technologies.

## What is it?

Unlike traditional architectures where applications run on servers, serverless applications run in stateless compute containers that are event-triggered, ephemeral (they may only last for a single invocation), and fully managed by a third party.

These architectures typically power "rich client" applications—think single-page web apps or mobile apps. Such apps leverage a vast ecosystem of cloud-accessible databases, authentication services (e.g., Auth0, AWS Cognito), and so on. For computation, you can leverage services like AWS Lambda or Azure Functions.

## Upsides and Downsides

#### Upsides:

*   No need for system administration (everything is handled by a third party).
*   Decreased product complexity.
*   Native microservices architecture.
*   Lower scaling costs.
*   Elasticity (native scaling).
*   Reduced development and operational costs.
*   Faster time to market.

### Downsides:

*   Debugging and monitoring are still challenges.
*   Tooling is not yet fully mature.
*   Cold start issues.
```