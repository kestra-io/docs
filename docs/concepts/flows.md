---
order: 1
---
# Flow
A [flow](../developer-guide/flow) is a simple list of tasks that describe the behavior of your flow. Flows are grouped by namespaces.

## Task
A Task is single action in a flow. 
A task can optionally take inputs, perform an action, or produce an output.

There are 2 kinds of task in Kestra: 

### Flowable Task
[Flowable Tasks](../developer-guide/flowable) are tasks that only handle workflow states and trigger new tasks. They will handle the logic of the flow enabling complex workflow like branching, parallel tasks, etc...  
An example is a `Switch` task that can take any inputs and decide what are the next tasks to run (and to allow branching). 

A Flowable Task is handled by `Executors` and can be called very often, so these tasks cannot include intensive computations.

The most common Flowable Tasks will be available in the core. 

### Runnable Task 
Runnable Tasks are used to handle any computational work. This can be anything, including file system operations, api calls, database queries, and more. These tasks can be compute intensive so they will be handled by `Workers`. 

By default, Kestra does not include a lot of Runnable Tasks, most will be available as Plugins.

## Namespace
A Namespace is like a file systems folder, it aims to group flows in a limitless hierarchy.
A Namespace is composed of word and letters separated by `.`. The hierarchy depth is not limited and is free for Kestra users to modify to fit their organization.

## Inputs 
[Inputs](../developer-guide/inputs) are parameters sent to a flow at execution time. It can be anything (string, int, file, ...) that will be sent when the execution is created. The Flow must define possible inputs, and mandatory ones are enforced before the creation of the execution. 

## Revision
Each flow modification will produce a new revision. A revision is a simple incremental number that will be updated after each change made to the flow. Internally, Kestra will track and manage all revisions of the flow.

## Listeners
[Listeners](../developer-guide/listeners) are special tasks that can listen to the current flow and launch tasks *outside of the flow*.
The result of these tasks will not change the execution status. Listeners are mainly used to send notifications or handle special end-task behaviour that you do not want to be considered as part of the main workflow.
 
## Triggers
[Triggers](../developer-guide/triggers) are a way to start a flow from external events. For example, a trigger might initiate a flow on a scheduled date or at a particular time of day, or it can be dependent on external events (such as file creation).

## Templates
[Templates](../developer-guide/templates) are lists of tasks that can be shared between flows. You can define a template and call it from other flows, allowing you to share a list of tasks and keep these tasks updated without changing all flows that use them.
