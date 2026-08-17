---
layout: post
title: "What Programming Language Pays the Most in Slovakia?"
date: 2019-03-02 17:53:00
description: "An analysis using web crawling and NLP techniques on Slovak job ads to determine the most in-demand and highest-paying programming languages in the local job market."
tags: slovakia, job market, programming languages, python, nlp, web crawling, salary analysis, career advice
categories: market-analysis, career-advice
---

## Introduction

This analysis attempts to answer a simple question using Google Colab, Python notebooks, web crawling of a Slovak job ad site, simple NLP techniques (primarily regex and text transformations), pandas, and scikit-learn.

It's impossible to answer this question accurately using indices like the TIOBE Programming Index. Such indices are based on search engine trends and do not reflect the actual demand for programming languages in specific job markets, especially niche markets like Slovakia.

## How Is This Possible?

This analysis is made possible by a recent change in Slovak labor law, which mandates companies to publish the lowest possible salary they are willing to pay for a position. Companies often tend to post higher figures in advertisements to compete with each other, so actual salaries may be slightly higher, but this effect should average itself out. One challenge, however, is the lack of regulation regarding the type of salary to be published; some companies list net salaries, while others list gross salaries. Fortunately, the number of companies posting gross salaries is relatively small.

## Data

To ensure data correctness, job postings with salaries lower than 900 EUR or higher than 5500 EUR will be excluded, as they have a higher probability of being false positives.

We will crawl the most popular Slovak job advertisement site. The crawler will process approximately 1200 pages of IT jobs, including dedicated programming roles and others that are hybrid (e.g., Managers, Support, Testers).

A corpus of words representing popular programming languages will be used. Three different strategies will be employed for parsing programming languages from the ad text. The specific parsing details are less critical for this overview; the main reason for these strategies is the difficulty in accurately identifying single-letter programming languages like "C" or "R" within a text, which often requires treating them as distinct tokens without typical word boundaries.

## Python Scripts

Below is a link to a read-only Google Colab Python notebook. Please note that this version excludes the web crawling code (the part that extracts/downloads content from the job ad site).

[Click here to see the scripts](https://colab.research.google.com/drive/1SgClp8xQWp7wSE6O5DqEYhPt93ZGYFyW#scrollTo=Lyp53UVzT7vn)

## Summary

As the analysis reveals, there are some interesting surprises. Java appears to be a primary language to learn if you aim for salaries between 3000 and 4000 Euros.

Who knew Bash was so important to learn? On the other hand, it's not particularly difficult to pick up. :)

For lower-paying positions, PHP is the dominant language, but R also appears prominently in second place (perhaps indicating a parsing anomaly?).

It's no surprise that for salaries higher than 4000 EUR, there is no single clear winner. Professionals in these positions (Architects, Team Leads, Tech Leads) are typically expected to be generalists. Therefore, the answer to the question posed in the title is: None, or there is no silver bullet; simply excel at what you do and commit to continuous learning.
