---
title: Installation Guide
icon: /docs/icons/installation.svg
---

You can install Kestra using different methods. Select one that matches your preferred environment.

You can deploy Kestra (almost) anywhere, from your laptop or an on-prem server to a distributed cluster running in a public cloud. Note that some Kestra plugins such as the [Script plugin](../16.scripts/index.md) require Docker-in-Docker (DinD). This is not supported in certain environments such as AWS Fargate. For production deployments, we recommend using Kubernetes or a virtual machine.

The easiest way to install Kestra locally is to use [Docker](./02.docker.md).

::ChildCard
::
