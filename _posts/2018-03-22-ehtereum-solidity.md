---
layout: post
title: What Are Smart Contracts?
date: 2018-03-22 23:28:00
description: An introduction to smart contracts, their history, how they work, and their execution on the Ethereum blockchain using Solidity and Web3.
tags: smart-contracts, blockchain, ethereum, solidity, web3, decentralized-web, programming
categories: blockchain-concepts
---

## What Are Smart Contracts?

Having the opportunity to work on an interesting smart contract project, I decided to write something about this hot topic on my blog. So, what exactly is a smart contract?

In 1994, Nick Szabo, a legal scholar and cryptographer, realized that the decentralized ledger could be used for _smart contracts_—also known as self-executing contracts, blockchain contracts, or digital contracts. In this format, contracts could be converted into computer code, stored and replicated on the system, and supervised by the network of computers that run the blockchain. This setup would also facilitate ledger feedback, such as transferring money upon receiving a product or service.

Smart contracts facilitate the exchange of money, property, shares, or anything of value in a transparent, conflict-free way, all while eliminating the need for intermediaries.

This raises intriguing questions: Could laws be written as smart contracts? What kind of world would that create? Would programmers essentially become lawyers? Imagine the implications of code reviews and testing on such contracts.

## How Are Smart Contracts Executed?

Most smart contracts written today are based on the Ethereum blockchain. The Ethereum blockchain functions as a "world computer" capable of executing these smart contracts. Smart contracts are primarily written in a language called Solidity (current version at the time of writing: 0.4.21). The most popular framework for developing smart contracts is Truffle.

In this architecture, contracts serve as the backend for applications, while the frontend is developed using Web3. Web3 represents a new paradigm for building web applications, known as the "decentralized web." Essentially, there is no classical backend; instead, applications consist of a frontend interacting directly with decentralized smart contracts.
