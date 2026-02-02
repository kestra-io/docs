---
title: Glossary – Useful Kestra Terms and Definitions
description: A list of terms useful for understanding Kestra and declarative orchestration. 
sidebarTitle: Glossary
#icon: 
---

A list of terms useful for understanding Kestra and declarative orchestration. 

## A
- [Apps](#apps) - custom user interfaces (UIs) or frontends for workflows, allowing your users to interact with Kestra from the outside world. Apps can trigger workflows or enable human-in-the-loop workflows.
    - [Approval Apps](#approval-apps) - Apps that enable forms for approving or rejecting paused workflows.
    - [Form Apps](#from-apps) - Apps that allow you to create forms that can trigger workflows with input parameters.

## B

- [Backfill](#backfill) - replays of missed schedule intervals between a defined start and end date.
- [Blueprints](#blueprints) - ready-to-use examples with code and documentation designed to kickstart your worflow.

## C

- [Concurrency](#concurrency) - a flow-level property that limits the number of executions of a specific flow that can run simultaneously.
- [Context](#context) - typically referred to as "execution context" or a collection of variables and metadata that allows for dynamic rendering of flow properties during a workflow's execution.

## D

- [Declarative](#declarative) - An approach where you describe _what_ a workflow should accomplish rather than _how_ to achive it or expressesing logic without describing control flow.
- [Declarative orchestration](#declarative-orchestration) - A declarative orchestrator is a system that allows you to define and manage complex workflows using a high-level, descriptive language. Instead of specifying the exact steps and sequences to achieve a specific outcome, a declarative orchestrator lets you define the desired end state and the system figures out how to reach it.

## E

- [Events](#events) - in orchestration, an event is something that happens, internal or external to the system, to start a flow.
    - [Internal Events](#internal-events) - internal events happen internal, or inside of the Kestra platform, like scheduled CRON triggers, to start a flow.
    - [External Events](#external-events) - external events happen external, or outside of the Kestra platform to start a flow.
- [Execution](#execution) - a single run of a flow, existing in a specific state.
- [Execution context](#execution-context) - a collection of variables and metadata that allows for dynamic rendering of flow properties during a workflow's execution.
- [Expressions](#expressions) - accessing and using variables in flows, combining the Pebble templating engine with the execution context to dynamically render flow properties. Expressions allow you to dynamically set values within your workflows. Expression syntax uses curly braces, e.g., `{{ your_expression }}`.

## F

- [Flowable Tasks](#flowable-tasks) - Flowable tasks control orchestration logic — running tasks or subflows in parallel, creating loops, and handling conditional branching. They do not run heavy operations.
- [Flows](#flows) - Flows act as a backend, processing data and executing tasks. Flows are versioned by default. Flows and workflows are often used interchangeable. 

## K

- [KV Store](#kv-store) - also known as Key Value Store, allows you to store any data in a key-value format. These values can be shared acrss executions and different workflows to provide persistent data.

## N 

- [Namespace](#namespace) - separates projects, teams, and environments to logically group things and provide structure. Working with languages like Java, you may have encountered the concept of namespaces implemented as packages.
- [Namespace File](#namespace-file) - files tied to a specific namespace, serving as project assets. They are analogous to a project in a local IDE or a copy of a Git repository.

## O
- [Orchestration](#orchestration) - a process or a tool that automates, manages, and coordinates various workflows and tasks across different services, systems, or applications. It functions like a conductor of an orchestra, ensuring all components perform in harmony, following a predefined sequence or set of rules.
- [Outputs](#outputs) - a mechanism to pass data between tasks and flows. They can be accessed by all downstream tasks and flows using dynamic properties (e.g., `{{ outputs.task_id.attribute_name }}`).

## P

- [Pebble Templating Engine](#pebble-templating-engine) - inspired by the Java templating engine, use `.` notation to access nested properties. It is used to dynamically render variables, inputs, and outputs withint the execution context.
- [Plugin](#plugin) - the building blocks of tasks in Kestra that offer integerations to different systems and functionality.

## R

- [Replay](#replay) - rerun a workflow execution from any chosen task, useful for iterative developer and reprocessing data.
- [Revision](#revision) - any changes to a flow create a new version of that flow, otherwise known as a revision.
- [Runnable Tasks](#runnable-tasks) - Runnable tasks handle data processing, such as file system operations, API calls, and database queries. They can be compute-intensive and are executed by workers. Most tasks are runnable.

## S

- [Secrets](#secrets) - sensitive information stored securely. Secrets can be retrieved and used within Kestra flows using the `secret()` function (e.g., `{{ secret('API_TOKEN') }}`).
- [Subflow](#subflow) - Subflows let you build modular and reusable workflow components. They work like function calls: executing a subflow creates a new flow run from within another flow.

## T

- [Task runner](#task-runner) - extensible, pluggable system within Kestra capable of executing your tasks in arbitrary remote environments, to offload computationally intensive tasks.
- [Tasks](#tasks) - atomic actions in a flow. Tasks are a required element in a flow and can be [Flowable Tasks](#flowable-tasks) or [Runnable Tasks](#runnable-tasks).
- [Time To Live (TTL)](#ttl) - the expiration or duration something like a token, secret, or key-value pair is available.
- [Triggers](#triggers) - a mechanism that automatically starts the execution of a flow. There are five core trigger types: schedule, flow, webhook, polling, realtime. Triggers are scheduled or event-based.

## W

- [Worker group](#worker-group) - offload computer-intensive tasks to dedicated workers, but at a broader scope than task runners.
- [Workers](#workers) - a Kestra server component responsible for executing all runnable tasks and polling triggers.
