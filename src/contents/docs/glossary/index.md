---
title: "Kestra Glossary: Terms and Definitions"
h1: Glossary of Key Kestra and Orchestration Terms
description: Glossary of Kestra and declarative orchestration terms. Definitions for flows, tasks, triggers, namespaces, and key concepts used across the platform.
sidebarTitle: Glossary
icon: /src/contents/docs/icons/concepts.svg
---

A list of terms useful for understanding Kestra and declarative orchestration. 

## A
<span id="apps"></span>
- [Apps](#apps) - custom user interfaces (UIs) or frontends for workflows, allowing your users to interact with Kestra from the outside world. Apps can trigger workflows or enable human-in-the-loop workflows. Available on [Enterprise Edition](../07.enterprise/04.scalability/apps/index.md).
    <span id="approval-apps"></span>
    - [Approval Apps](#approval-apps) - Apps that enable forms for approving or rejecting paused workflows.
    <span id="form-apps"></span>
    - [Form Apps](#form-apps) - Apps that allow you to create forms that can trigger workflows with input parameters.

## B

<span id="backfill"></span>
- [Backfill](#backfill) - replays of missed schedule intervals between a defined start and end date. All missed schedules are automatically recovered by default if the Kestra server is down. Learn how to manage and configure [backfills](../06.concepts/08.backfill/index.md).
<span id="blueprints"></span>
- [Blueprints](#blueprints) - ready-to-use examples with code and documentation designed to kickstart your worflow. [Blueprints](../06.concepts/07.blueprints/index.md) typically include multiple plugins.

## C

<span id="concurrency"></span>
- [Concurrency](#concurrency) - a flow-level property that limits the number of executions of a specific flow that can run simultaneously. Learn when to use [concurrency](../05.workflow-components/14.concurrency/index.md).
<span id="connector-sprawl"></span>
- [Connector sprawl](#connector-sprawl) - the uncontrolled proliferation of integrations, or connectors, in an organization. [Connector sprawl](https://kestra.io/docs/tutorial/outputs#pass-outputs-between-tasks) can create security, operational, and maintenance issues. Kestra's architecture around outputs and internal storage works to prevent these risks. 
<span id="context"></span>
- [Context](#context) - typically referred to as "execution context" or a collection of variables and metadata that allows for dynamic rendering of flow properties during a workflow's execution.

## D

<span id="declarative"></span>
- [Declarative](#declarative) - An approach where you describe _what_ a workflow should accomplish rather than _how_ to achieve it or expressesing logic without describing control flow.
<span id="declarative-orchestration"></span>
- [Declarative orchestration](#declarative-orchestration) - A declarative orchestrator is a system that allows you to define and manage complex workflows using a high-level, descriptive language. Instead of specifying the exact steps and sequences to achieve a specific outcome, a declarative orchestrator lets you define the desired end state and the system figures out how to reach it.

## E

<span id="events"></span>
- [Events](#events) - in orchestration, an event is something that happens, internal or external to the system, to start a flow.
    <span id="internal-events"></span>
    - [Internal Events](#internal-events) - internal events happen internal, or inside of the Kestra platform, like scheduled CRON triggers, to start a flow.
    <span id="external-events"></span>
    - [External Events](#external-events) - external events happen external, or outside of the Kestra platform to start a flow.
<span id="execution"></span>
- [Execution](#execution) - a single run of a flow, existing in a specific state.
<span id="execution-context"></span>
- [Execution context](#execution-context) - a collection of variables and metadata that allows for dynamic rendering of flow properties during a workflow's execution.
<span id="expressions"></span>
- [Expressions](#expressions) - accessing and using variables in flows, combining the Pebble templating engine with the execution context to dynamically render flow properties. [Expressions](../expressions/index.mdx) allow you to dynamically set values within your workflows. Expression syntax uses curly braces, e.g., `{{ your_expression }}`.

## F

<span id="flowable-tasks"></span>
- [Flowable Tasks](#flowable-tasks) - [Flowable tasks](../05.workflow-components/01.tasks/00.flowable-tasks/index.md) control orchestration logic — running tasks or subflows in parallel, creating loops, and handling conditional branching. They do not run heavy operations.
<span id="flows"></span>
- [Flows](#flows) - Flows act as a backend, processing data and executing tasks. Flows are versioned by default. [Flows](../05.workflow-components/01.flow/index.md) and workflows are often used interchangeable. 

## I

<span id="inputs"></span>
- [Inputs](#inputs) - dynamic values passed to the flow at runtime. Flow inputs are stored in the execution context and accessed with `{{ inputs.parameter_name }}`.Learn more about [inputs](../05.workflow-components/05.inputs/index.md).

## K

<span id="kv-store"></span>
- [KV Store](#kv-store) - also known as [Key Value Store](../06.concepts/05.kv-store/index.md), allows you to store any data in a key-value format. These values can be shared acrss executions and different workflows to provide persistent data.

## N 

<span id="namespace"></span>
- [Namespace](#namespace) - separates projects, teams, and environments to logically group things and provide structure. Working with languages like Java, you may have encountered the concept of [namespaces](../05.workflow-components/02.namespace/index.md) implemented as packages.
<span id="namespace-file"></span>
- [Namespace File](#namespace-file) - files tied to a specific namespace, serving as project assets. They are analogous to a project in a local IDE or a copy of a Git repository. Learn more about [namespace files](../06.concepts/02.namespace-files/index.md).

## O
<span id="orchestration"></span>
- [Orchestration](#orchestration) - a process or a tool that automates, manages, and coordinates various workflows and tasks across different services, systems, or applications. It functions like a conductor of an orchestra, ensuring all components perform in harmony, following a predefined sequence or set of rules.
<span id="outputs"></span>
- [Outputs](#outputs) - a mechanism to pass data between tasks and flows. They can be accessed by all downstream tasks and flows using dynamic properties (e.g., `{{ outputs.task_id.attribute_name }}`). Learn more about [outputs](../05.workflow-components/06.outputs/index.md).

## P

<span id="pebble-templating-engine"></span>
- [Pebble Templating Engine](#pebble-templating-engine) - inspired by the Java templating engine, use `.` notation to access nested properties. [Pebble](../06.concepts/06.pebble/index.md) is used to dynamically render variables, inputs, and outputs withint the execution context.
<span id="plugin"></span>
- [Plugin](#plugin) - the building blocks of tasks in Kestra that offer integerations to different systems and functionality. [Plugins](../05.workflow-components/02.plugins/index.md) power every task and trigger in Kestra.

## R

<span id="replay"></span>
- [Replay](#replay) - re-run a workflow execution from any chosen task, useful for iterative developer and reprocessing data. Learn more about [replay](../06.concepts/10.replay/index.md).
<span id="revision"></span>
- [Revision](#revision) - any changes to a flow create a new version of that flow, otherwise known as a [revision](../06.concepts/03.revision/index.md).
<span id="runnable-tasks"></span>
- [Runnable Tasks](#runnable-tasks) - [Runnable tasks](../05.workflow-components/01.tasks/01.runnable-tasks/index.md) handle data processing, such as file system operations, API calls, and database queries. They can be compute-intensive and are executed by workers. Most tasks are runnable.

## S

<span id="secrets"></span>
- [Secrets](#secrets) - sensitive information stored securely. [Secrets](../06.concepts/04.secret/index.md) can be retrieved and used within Kestra flows using the `secret()` function (e.g., `{{ secret('API_TOKEN') }}`).
<span id="subflow"></span>
- [Sibling task](#sibling-task) - A sibling task is a task that shares a common parent task with other tasks, like in the `tasks` list inside a loop.  
- [Subflow](#subflow) - Subflows let you build modular and reusable workflow components. They work like function calls: executing a [subflow](../05.workflow-components/10.subflows/index.md) creates a new flow run from within another flow.
<span id="system-flows"></span>
- [System flows](#system-flows) - System flows automate maintenance workflows. Any valid Kestra flow can become a [System Flow](../06.concepts/system-flows/index.md) if it’s added to the `system` namespace.

## T

<span id="task-runner"></span>
- [Task runner](#task-runner) - extensible, pluggable system within Kestra capable of executing your tasks in arbitrary remote environments, to offload computationally intensive tasks. Learn more about [task runners](../task-runners/01.overview/index.md).
<span id="tasks"></span>
- [Tasks](#tasks) - atomic actions in a flow. [Tasks](../05.workflow-components/01.tasks/index.mdx) are a required element in a flow and can be [Flowable Tasks](#flowable-tasks) or [Runnable Tasks](#runnable-tasks).
<span id="ttl"></span>
- [Time To Live (TTL)](#ttl) - the expiration or duration something like a token, secret, or key-value pair is available.
<span id="triggers"></span>
- [Triggers](#triggers) - a mechanism that automatically starts the execution of a flow. There are five core trigger types: schedule, flow, webhook, polling, realtime. [Triggers](../05.workflow-components/07.triggers/index.mdx) are scheduled or event-based.

## W

<span id="worker-group"></span>
- [Worker group](#worker-group) - offload computer-intensive tasks to dedicated workers, but at a broader scope than task runners. Available in [Enterprise Edition](../07.enterprise/04.scalability/worker-group/index.md).
<span id="workers"></span>
- [Workers](#workers) - a Kestra server component responsible for executing all runnable tasks and polling triggers.
