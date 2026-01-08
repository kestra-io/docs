---
title: Glossary
#icon: 
---

A list of terms useful for understanding Kestra and declarative orchestration. 

## A
- Apps - Custom UIs or frontends for flows, allowing your users to interact with Kestra from the outside world. Apps can trigger workflows or enable human-in-the-loop workflows.
    - Approval Apps - Apps that enable forms for approving or rejecting paused workflows
    - Form Apps - Apps that allow you to create forms that can trigger workflows with input parameters

## B

- Backfill - replays of missed schedule intervals between a defined start and end date
- Blueprints - ready-to-use examples with code and documentation designed to kickstart your worflow

## D

- Declarative - expresses logic without describing control flow
- Declarative orchestration - A declarative orchestrator is a system that allows you to define and manage complex workflows using a high-level, descriptive language. Instead of specifying the exact steps and sequences to achieve a specific outcome, a declarative orchestrator lets you define the desired end state and the system figures out how to reach it.

## E

- Expressions - accessing and using variables in flows

## F

- Flows - Flows act as a backend, processing data and executing tasks. Flows are versioned by default.

## N 

- Namespace - separates projects, teams, and environments to group things like flows and provide structure. 

## P

- Pebble Templating Engine - inspired by the Java templating engine, use `.` notation to access nested properties.
- Plugin - the building blocks of tasks in Kestra that offer integerations to different systems and functionality.

## R

- Replay - rerun a workflow execution from any chosen task, useful for iterative developer and reprocessing data.
- Revision - any changes to a flow create a new version of that flow, otherwise known as a revision.

## S

- Subflow - Subflows let you build modular and reusable workflow components. They work like function calls: executing a subflow creates a new flow run from within another flow.

## T

- Task runner - offload computer-intensive tasks to remove environments.
- Tasks - atomic actions in a flow. Tasks are a required element in a flow.
    - Flowable Tasks - Flowable tasks control orchestration logic — running tasks or subflows in parallel, creating loops, and handling conditional branching. They do not run heavy operations.
    - Runnable Tasks - Runnable tasks handle data processing, such as file system operations, API calls, and database queries. They can be compute-intensive and are executed by workers. Most tasks are runnable.
- Triggers - a mechanism that automatically starts the execution of a flow. There are five core trigger types: schedule, flow, webhook, polling, realtime. Triggers are scheduled or event-based.

## W

- Worker group - offload computer-intensive tasks to dedicated workers, but at a broader scope than task runners.