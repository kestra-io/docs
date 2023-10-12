---
title: "DollarU, OpCon, Control-M, Kestra, what you need to know to select the right scheduling platform "
description: "Learn more about the scheduling landscape and the tools providing a more modern approach options"
date: 2023-10-12T17:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"

---
Gone are the days of rudimentary cron jobs; with microservices, Big Data, and cloud-based solutions, job scheduling needs to be more robust, flexible, and integrated.

Historically, job scheduling was a straightforward process with cron jobs handling basic scheduling tasks. However as distributed systems have grown more complex, the limitations of these tools have become evident. Some automation and scheduling platforms are adequate for simpler, monolithic architectures, but they haven't evolved significantly to address the modern challenges of:

- Dynamic scaling
- Complex dependencies
- Real-time monitoring
- Fault tolerance
- Cross-platform compatibility

To help you navigate through this, we'll be exploring a selection of tools in the field. From legacy platforms to next-gen solutions like **[Kestra](https://github.com/kestra-io/kestra)**.

## Dollar Universe Workload Automation

[Dollar Universe Workload Automation](https://www.broadcom.com/products/software/automation/dollar-universe), a product of Broadcom, is an enterprise-scale scheduling platform designed to manage complex workflows and optimize business processes. The tool provides robust solutions to ensure scheduling across different platforms, including Unix, Windows, and iSeries.

### The API Ecosystem

The tool comes with a set of APIs that are designed to facilitate integrations across a variety of enterprise-level applications. These APIs are developed to function in tandem with both SOAP and RESTful web services. The APIs provide the hooks necessary for linking tasks across multiple platforms and business applications.  

**How it Works**  
It employs a pretty neat resource allocation and job sequencing to ensure optimal utilization of resources. It allows the scheduler to respond to external events such as file changes, database updates, and system failures.

### Limitations: Areas for Improvement

there are areas where it shows its age, particularly when compared to more modern scheduling platforms:

**Legacy Systems Focus:** The tool is proficient at managing schedules in traditional monolithic environments. However, when it comes to cloud-native or microservices architectures, it falls short. This could be a potential bottleneck for organizations looking to migrate to more modern stacks.

**Inflexibility in Dynamic Scaling**: Although Dollar Universe offers a range of scalability features, they are optimized for more static, pre-defined enterprise environments. In contrast, the modern expectation is for platforms that can adapt to dynamic, cloud-based infrastructures, dynamically allocating or deallocating resources as required.

**Limited Real-Time Monitoring Capabilities**: While the tool does offer some form of real-time monitoring, it is not as comprehensive as newer platforms. For instance, it may not offer the depth of metrics or insights into the system's state, which could be crucial for complex, multi-layered workflows.

## OpCon

[OpCon](https://smatechnologies.com/products-opcon-automation), developed by SMA Technologies, is another industry veteran in the automation and scheduling sector. Engineered with a focus on both small businesses and large enterprises, OpCon aims to simplify complex operational workflows.

### Core Automation Features

**Self-Service scheduler**: Users can build, initiate, and manage workflows without any specialized training.

**Disaster Recovery:** OpCon includes robust disaster recovery features, offering automated failover mechanisms to ensure minimal service disruption. This is particularly beneficial for mission-critical applications that require high availability.

### API Integration Layer

Similar to Dollar Universe, OpCon also incorporates an extensive API framework. However, it goes a step further by offering native integrations with popular third-party applications like ServiceNow, Salesforce, and more. Its API framework allows for both inbound and outbound integrations.

The API set supports both RESTful and SOAP web services. These APIs can facilitate everything from simple task initiation to complex, multi-step workflows involving various departments and systems.

### How it works

OpCon employs a strategy of conditional logic in its scheduling, which allows workflows to adapt based on real-world events. It also supports multiple types of job triggers, including time-based, file-based, and database change-based.

### Where It Falls Short

Despite its powerful feature set, OpCon is not without its shortcomings:

**Resource Intensiveness**: OpCon's architecture can sometimes require substantial system resources, making it less ideal for smaller environments or cloud-native applications that demand lightweight solutions.

**No Native Support for Modern DevOps Practices:** As a tool that’s been around for a while, OpCon lacks out-of-the-box support for modern DevOps practices like containerization and Infrastructure as Code (IaC), which are becoming industry standards.

While OpCon offers a feature-rich and flexible scheduling solution, it still leans towards traditional IT environments and could benefit from updates to better support modern DevOps practices and cloud-native applications.

## Control-M

[Control-M](https://www.bmc.com/it-solutions/control-m-capabilities.html) is a workload automation software by BMC Software, aimed at integrating various automated processes across multiple platforms and applications. With roots stretching back to mainframe systems, Control-M has evolved to accommodate modern environments, including cloud-based and containerized applications.

### Core Features

**File Transfer Management**: Control-M offers an advanced file transfer system, allowing users to schedule, transfer, and track files across different platforms.

**Batch Processing:** Control-M can manage complex batch workflows, taking care of dependencies, scheduling, and resource allocation.

**Auditing and Compliance**: Control-M has strong auditing features, providing detailed logs and reports to ensure compliance with various industry standards.

**API Capabilities**: Control-M provides a well-documented set of APIs that allow for broad integration across enterprise services. These APIs can integrate with RESTful services, thereby simplifying the development of complex, multi-step workflows…

### Task-Specific Execution in Complex Flows

Control-M offers the ability to execute a specific task within a flow. If a task fails, you don't have to rerun the entire operation; you can simply pinpoint and re-trigger the individual task.

### How it works

Administrators can use a single interface to schedule, monitor, and manage jobs across different platforms. It supports condition-based job flows, meaning jobs can be set up to trigger based on successful or unsuccessful completion of preceding tasks.

### Where Control-M Could Improve

**Legacy Overhead:** Despite upgrades for modern platforms, the tool carries the weight of its legacy systems focus, which can make it less agile compared to more modern, cloud-native solutions.

Control-M, while strong in traditional scheduling, sometimes falls short in offering the same level of flexibility and ease for defining complex, conditional workflows. The tool's user interface and scripting requirements can be clunky when trying to orchestrate intricate job dependencies, conditional logic, and data-driven triggers. This could potentially slow down organizations that require agile responses to data conditions. With more modern solutions, you often get a flexible, DSL-based (Domain Specific Language) approach that allows for easier, quicker, and more robust workflow design and management.

### **Technical Overview: Scheduling Flows with Kestra**

### Scheduling with Kestra?

[Kestra](https://github.com/kestra-io/kestra) offers a feature that lets you schedule the execution of your flows based on cron expressions. It's particularly useful when you can't rely on event triggers and need a flow to execute at specific times.

### How Does it Work?

When you define a schedule, Kestra keeps track of the last execution date. This ensures that changing the cron expression won't restart all previous executions. If you change the schedule ID, Kestra will treat it as a new schedule, resetting the last execution date and re-executing all past scheduled events, if backfill exists.

**Basic Schedule**

Here's how you can schedule a flow to run every 15 minutes.

```yaml
yamlCopy code
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"

```

**Schedule with Nickname**

Kestra also supports named cron expressions, which can simplify your configuration.

```yaml
yamlCopy code
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "@hourly"

```

**Complex Schedule**

You can make your schedules more intricate using conditions.

```yaml
yamlCopy code
triggers:
  - id: schedule
    cron: "0 11 * * 1"
    scheduleConditions:
      - id: monday
        date: "{{ trigger.date }}"
        dayOfWeek: "MONDAY"
        dayInMonth: "FIRST"

```

### Backfill Support

When a workflow is missed or fails, Kestra's Backfill feature triggers an automatic rerun for that particular set of tasks. This ensures continuity in your data pipeline, filling any gaps that may have occurred due to scheduling mishaps or system failures.

 **Schedule with Backfill**

If you need the flow to make up for missed runs from a specific date, you can use a backfill.

```yaml
yamlCopy code
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2020-06-25T14:00:00Z

```

### What's Next

As we've seen, the right tool for your scheduling needs depends on a variety of factors, from the scale and complexity of your tasks to the architecture of your system. While traditional tools like Dollar Universe and OpCon have strong features, Kestra is multimodal and allows 100% flexibility in your workflow.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.

