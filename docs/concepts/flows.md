---
order: 1
---

# Flow

A [flow](../developer-guide/flow) is a list of tasks. You create flows in Kestra to automate your processes.


## Task

A task is a single action in a flow. A task can take properties as inputs, perform an action, and produce an output.

There are two kinds of tasks in Kestra:
- Runnable Tasks 
- Flowable Tasks


### Runnable Task 

Runnable Tasks handle computational work in the flow. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../architecture/#worker). 

By default, Kestra only includes a few Runnable Tasks. However, many of them are available as [plugins](../../plugins/).


### Flowable Task

[Flowable Tasks](../developer-guide/flowable) only handle flow logic (branching, grouping, parallel processing, etc.) and trigger new tasks. For example, the Switch task takes inputs and decides the next tasks to run. 

A Flowable Task is handled by executors and can be called very often. Because of that, these tasks cannot include intensive computations, unlike Runnable Tasks. Most of the common Flowable Tasks are available in the default Kestra installation. 


## Namespace

A namespace is like a folder for flows. A namespace is composed of words and letters separated by `.`. The hierarchy depth for Namespaces is unlimited. Here are some examples of namespaces:
- `projectOne`
- `com.projectTwo`
- `test.projectThree.folder`


## Inputs 

[Inputs](../developer-guide/inputs) are parameters sent to a flow at execution time. It's important to note that inputs in Kestra are [strongly typed](../developer-guide/inputs/#input-types).

The inputs can be declared as either optional or mandatory. If the flow has mandatory inputs, you'll have to provide them before the execution of the flow. 


## Revision

Changing the source of a flow will produce a new revision for the flow. The revision is a simple incremental number that will be updated after you save any changes to the flow. 

Internally, Kestra will track and manage all the revisions of the flow. Think of it as version control for your flows. 


## Listeners

[Listeners](../developer-guide/listeners) are special tasks that can listen to the current flow and launch tasks *outside the flow*.

The output of listeners will not change the execution status of the flow. Listeners are mainly used to send notifications or handle special behavior outside the primary flow.


## Triggers

[Triggers](../developer-guide/triggers) is a way to start a flow from external events. For example, a trigger might initiate a flow at a scheduled time or based on external events (webhooks, file creation, etc.).


## Templates

[Templates](../developer-guide/templates) are lists of tasks that can be shared between flows. You can define a template and call it from other flows. Templates allow you to share a list of tasks and keep them updated without changing all flows that use them.
