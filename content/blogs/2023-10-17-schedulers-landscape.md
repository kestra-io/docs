---
title: "DollarU, Control-M, Kestra — how to choose the right scheduling platform"
description: "How the scheduling landscape has evolved in the last decade? Learn more about the differences between traditional schedulers and tools, such as Kestra, providing a more modern approach to orchestration and scheduling."
date: 2023-10-17T17:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2023-10-17-schedulers-landscape.jpg

---
Gone are the days of rudimentary cron jobs. With the rise of microservices, big data, and cloud-native distributed technologies, job scheduling has evolved to meet the needs of modern engineering workflows.

Historically, job scheduling has often been approached with cron jobs. However, as distributed systems have grown more complex, the limitations of these tools have become evident. Some automation and scheduling platforms are adequate for simpler, monolithic architectures, but they haven't evolved significantly to address the modern challenges of:

- Dynamic scaling
- Complex dependencies
- Real-time monitoring
- Fault tolerance
- Cross-platform compatibility

Let's explore a selection of tools in the field, from legacy platforms to modern solutions such as **[Kestra](https://github.com/kestra-io/kestra)**, and discuss how they address those challenges.

---

## Dollar Universe Workload Automation

[Dollar Universe Workload Automation](https://www.broadcom.com/products/software/automation/dollar-universe), a product of Broadcom, is an enterprise-scale scheduling platform designed to manage complex workflows and optimize business processes. The tool provides robust solutions to ensure scheduling across different platforms, including Unix, Windows, and iSeries.

### The API Ecosystem

The tool comes with a set of APIs that are designed to facilitate integrations across a variety of enterprise-level applications. These APIs are developed to function in tandem with both SOAP and RESTful web services. The APIs provide the hooks necessary for linking tasks across multiple platforms and business applications.

**How it Works**
It allows the scheduler to respond to external events such as file changes, database updates, and system failures.

### Limitations: Areas for Improvement

There are areas where the product shows its age, particularly when compared to more modern scheduling platforms:

**Legacy Systems Focus:** The tool is proficient at managing schedules in traditional monolithic environments. However, when it comes to cloud-native or microservices architectures, it falls short. This could be a potential bottleneck for organizations looking to migrate to more modern stacks.

**Inflexibility in Dynamic Scaling**: Although Dollar Universe offers a range of scalability features, they are optimized for more static on-prem enterprise environments. In contrast, modern applications expect the platform to adapt to cloud-based infrastructure requirements, dynamically allocating or deallocating resources as needed.

**Limited Real-Time Monitoring Capabilities**: While the tool does offer some form of real-time monitoring, it is not as comprehensive as newer platforms. For instance, it may not offer the depth of metrics or insights into the system's state, which could be crucial for complex, multi-layered workflows.

---

## Control-M

[Control-M](https://www.bmc.com/it-solutions/control-m-capabilities.html) is a workload automation software by BMC Software, aimed at integrating various automated processes across multiple platforms and applications. With roots stretching back to mainframe systems, Control-M has evolved to accommodate modern environments, including cloud-based and containerized applications.

### Core Features

**File Transfer Management**: Control-M offers a file transfer system that allows users to schedule, transfer, and track files across different platforms.

**Batch Processing:** Control-M can manage complex batch workflows, taking care of dependencies, scheduling, and resource allocation.

**Auditing and Compliance**: Control-M has auditing features, providing detailed logs and reports to ensure compliance with various industry standards.

**API Capabilities**: Control-M provides APIs that allow for broad integration across enterprise services. These APIs can integrate with RESTful services, thereby simplifying the development of complex, multi-step workflows.

### Task-Specific Execution in Complex Flows

Control-M offers the ability to execute a specific task within a flow. If a task fails, you don't have to rerun the entire operation; you can rerun the individual task.

### How it works

Administrators can use a single interface to schedule, monitor, and manage jobs across different platforms. It supports condition-based job flows, meaning jobs can be set up to trigger based on successful or unsuccessful completion of preceding tasks.

### Where Control-M Could Improve

**Legacy Overhead:** Despite upgrades for modern platforms, the tool carries the weight of its legacy systems focus, which can make it less agile compared to more modern, cloud-native solutions.

Control-M, while strong in traditional scheduling, sometimes falls short in offering the same level of flexibility and ease for defining complex, conditional workflows. The tool's user interface and scripting requirements can be clunky when trying to orchestrate complex job dependencies, conditional logic, and data-driven triggers. This can slow down organizations that require agile responses to data conditions. With more modern solutions, you often get a flexible, DSL-based (Domain Specific Language) approach that allows for easier, quicker, and more robust workflow design and management.

Lastly, the tool is prohibitively expensive. The price tag doesn't justify its capabilities compared to alternatives.

---

## **Technical Overview: Scheduling Flows with Kestra**

### Scheduling with Kestra

[Kestra](https://github.com/kestra-io/kestra) lets you schedule your flows based on a simple cron expression, as well as based on complex scheduling conditions. It's useful when you want to run a flow at a regular cadence, e.g. daily or hourly.

### How Does it Work?

When you define a schedule, Kestra keeps track of the last execution date. This ensures that changing the cron expression won't restart all previous executions. If you change the schedule ID, Kestra will treat it as a new schedule. If you add a backfill, Kestra will execute the flow for all past schedules.

**Basic Schedule**

Here's how you can schedule a flow to run every 15 minutes.

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"

```

**Scheduling expressions: daily, hourly, weekly**

Kestra also supports named expressions, which can simplify your configuration.

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@hourly"

```

**Complex Schedule**

For more complex scheduling needs, use `conditions`.

```yaml
triggers:
  - id: schedule
    cron: "0 11 * * 1"
    conditions:
      - id: monday
        date: "{{ trigger.date }}"
        dayOfWeek: "MONDAY"
        dayInMonth: "FIRST"

```

### Backfill Support

When a workflow execution is missed or fails, Kestra's Backfill feature can automatically trigger an automatic rerun for that particular set of tasks. This ensures continuity in your workflow, filling any gaps that may have occurred due to scheduling mishaps or system failures.

 **Schedule with Backfill**

If you need the flow to make up for missed runs from a specific date, you can configure a `backfill`.

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2023-10-17T14:00:00Z

```

::alert{type="info"}
The examples above show how Kestra allows you to keep the entire scheduling logic in code. For more examples of how Kestra brings Infrastructure as Code best practices to all workflows, check the [CI/CD guide](https://kestra.io/docs/developer-guide/cicd). See it in action by following the [getting started guide](https://kestra.io/docs/getting-started).
::

---

## What's Next

As we've seen, the right tool for your scheduling needs depends on a variety of factors, from the scale and complexity of your tasks to the architecture of your system. While traditional tools like Dollar Universe have many useful features, Kestra provides more flexibility and brings Infrastructure as Code best practices to all scheduled and event-driven workflows.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.

