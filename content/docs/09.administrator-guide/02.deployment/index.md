---
title: Deployments
---

You can deploy Kestra (almost) anywhere. In general, we recommend:
- [Docker](./01.docker.md) for a local installation
- [Kubernetes](./02.kubernetes.md) for a production installation.

::alert{type="warning"}
**Incompatible environments:** Some kestra plugins such as the [Script plugin](https://kestra.io/docs/developer-guide/scripts) require Docker-in-Docker (DinD) to run. This is not supported on AWS Fargate. For production deployments, we recommend using Kubernetes or a virtual machine.
::



This section lists available deployment options, from your laptop or an on-prem server to a distributed cluster running in a public cloud. Select the option that suits your needs best.

<ChildTableOfContents />

