---
order: 1
---
# Flow
A [flow](../developer-guide/flow) is a simple list of tasks for Kestra, grouped by namespace. It defines all the behavior you want for the current flow.

## Task
A Task is single action in a flow. 
A task can optionally take inputs, perform an action, or produce an output.

There are 2 kind of Tasks in Kestra: 

### Flowable Task
[Flowable Tasks](../developer-guide/flowable) are tasks that only handle workflow states and trigger new tasks. They will handle the logic of the flow enabling complex workflow like branching, parallel tasks, etc...  
A simple example is a `Switch` task that can take any inputs and decide which are the next tasks to run (and to allow branching). 

A Flowable Task is handled by `Executors` and can be called very often, so these tasks cannot include intensive computations.

The most common Flowable Tasks will be kept in the core. 

### Runnable Task 
Runnable Tasks are used to handle any computational work. This can be anything, including file systems operations, api calls, database queries, and more. These tasks can be compute intensive since they will be handled by `Workers`. By default, Kestra does not operate a lot of `Runnable Tasks`. Most tasks will be available as Plugins.

## Namespace
A namespace is a like a folder for file systems. It aims to group flows in a limitless hierarchy.
A Namespace is composed of word and letters separated by `.`. The hierarchy depth is not limited and is free for Kestra users to modify to fit their organization.

## Inputs 
[Inputs](../developer-guide/inputs) are mandatory or optional parameters sent to a flow in order for it to be successfully run. It can be anything (string, int, file, ...) that will be sent when the execution is created. The Flow must define possible inputs, and mandatory ones will be validated before the creation of the execution. 

## Revision
Each flow modification will produce a new revision. A revision is a simple incremental number that will update after each change made to the flow. Internally, Kestra will track and manage all revisions of the flow.

## Listeners
[Listeners](../developer-guide/listeners) are special tasks that can listen to the current flow and launch tasks *outside of the flow*.
The result of these tasks will not change the execution status. For the most part, Listeners are applied to send notifications or handle special end-task behaviour that you do not want to be considered as part of the main workflow.
 
## Triggers
[Triggers](../developer-guide/triggers) are a way to start a flow from external events. For example, a trigger might initiate a flow on a scheduled date or at a particular time of day, or it can be dependent on external events (such as file creation).

## Templates
[Templates](../developer-guide/templates) are lists of tasks that can be shared between flows. You can define a template and call upon it from other flows, allowing you to share a list of tasks and keep these task updated without changing your flow.
