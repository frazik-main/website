```
---
layout: post
title: Terraform Example: Serverless React App with AWS API Gateway and Lambda
date: 2022-08-04 16:09:00
description: A Terraform example demonstrating how to create a serverless React application using AWS API Gateway to invoke an AWS Lambda function, including CORS configuration.
tags: terraform, aws, serverless, react, api-gateway, lambda, programming
categories: aws, terraform, serverless
---

This Terraform example demonstrates how to create a **serverless React application** that utilizes **AWS API Gateway** to invoke an **AWS Lambda** function. The API Gateway is configured to proxy GET requests to the Lambda function, which simply returns "Hello World."

### Terraform Infrastructure Definition

This section contains the actual Terraform infrastructure definition, which includes CORS configuration.

[View Terraform Infrastructure Definition Gist](https://gist.github.com/spookysleeper/b8ebded1d37f3eeb564e47eaeff8d93f.js)

### Lambda Function

This is the Python Lambda function code that will return "Hello World."

[View Lambda Function Gist](https://gist.github.com/spookysleeper/754b0ea994cb2d305dcc781f9aee8998.js)
```