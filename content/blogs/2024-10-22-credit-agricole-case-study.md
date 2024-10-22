---
title: Scaling Data Operations at Crédit Agricole with Kestra
description: Julien Legrand from Crédit Agricole shares how the bank’s Data Team use Kestra to optimize infrastructure management, enhance security, and scale data pipelines for mission-critical operations across 50+ MongoDB clusters.
date: 2024-10-22T17:30:00
category: Solutions
author:
  name: Julien Legrand
  image: jlegrand
image:/blogs/2024-10-22-credit-agricole-case-study.jpg
---

CAGIP is the IT production entity of Crédit Agricole Group, a leading French banking and financial services company, acting as the central provider of IT services for the entire group. In the Data team we own several products that are used by different entities to host transactional, streaming or analytical data. We provide most of our solutions as SaaS hosted on a private cloud. Expectations regarding security, regulation and high availability imply specific needs regarding infrastructure operations.

## The challenges we faced in scaling data pipelines.

For a long time, we used Ansible & Jenkins to manage all the tasks that must be done on every of our deployments. Lately, we faced a real scale up in the number of clusters and services we manage. To keep up all the requirements related to hosting critical services in a banking environment we have to:
⁃ parallelize more (operating on +50 mongoDB clusters)
⁃ optimize the resources consumed (using containers instead of virtual machines)
⁃ and enhance the security (activating key rotation at scale) 

## Experimenting with Kestra

We probably could have challenged our current tools but some of us were quickly convinced by Kestra and we wanted to go much further!
So, we started with a quick and dirty installation in order to check the usability of the interface and the flow language based on yaml. It went fine and we decided then to continue with setting up the right architecture:

![alt text](/blogs/2024-10-22-credit-agricole-case-study/architecture.png)

## Using Kestra in production
Before releasing the new tool to the teams who will use it we wanted to define guidelines regarding CICD pattern and security. To do so we prepared few subflow easing the use of solution such as Vault to store and retrieve secrets. We also tried multiple delivery pattern to agree on: dev on the Kestra interface, test it in a specific namespace then commit the flow to git and finally use a gitsync to make sure that each of our production flow is properly stored on a git project. Recently we even plug it with our alerting service to stay alerted when something is wrong!
 
It tooks us time but we are finally opening access to our 7 data teams this fall!

## Expanding Kestra to even more use-case

We see many obvious use cases:
- replace the Kubernetes cronjobs used to collect data and calculate the billing of our clients (which is complex to monitor and evolve) with a simple flow [small data, python code, HTTP API & mongo]
- run daily and parallelize jobs on each existing clusters to keep our referential up to date [HTTP API, ssh connection]
- run a weekly test to verify the stability of our ansible code (deploy a cluster, configure it, run test, delete the cluster) and report it if anything goes wrong [ansible]
- run all our daily backup jobs and centralize the report to feed the dashboards [ssh, object store]

But I’m sure that this will be just a start and we’ll soon cover more complex processes like certificates management that we want to deal with an event driven approach.

As we continue to expand Kestra’s role across our operations, we’re excited to explore even more use cases in the future. If this resonates with your challenges, consider giving Kestra a star on GitHub and becoming a part of the growing community. You can also join the conversation and share your feedback directly on Slack or by opening a GitHub issue.

As we continue to expand Kestra’s role across our operations, we’re excited to explore even more use cases in the future. If this resonates with your challenges, consider giving Kestra [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).



