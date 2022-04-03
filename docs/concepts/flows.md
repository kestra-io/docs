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
[Inputs](../developer-guide/inputs) are mandatory or optional parameters sent to a flow in order to be successfully run. It can be anythings (string, int, file, ...) to will be send when the execution is created. Flow must defined possible inputs and mandatory one will be validated before the creation of the execution. 

## Revision
Each flow modification will produce a new revision, revision is a simple increments number that will update after each change of the flow. Internally Kestra will track and keep all revisions of the flow.

## Listeners
[Listeners](../developer-guide/listeners) are special task that can listen to the current flow and launch task *outside of the flow*.
The result of the tasks will not change the execution status. Mostly Listeners are here to send notification or handle special end task behaviour that you don't want to be considered as main workflow.
 
## Triggers
[Triggers](../developer-guide/triggers) are way to start a flow with external events. For example, on a schedule date or waiting for some external events (like file creation)

## Templates
[Templates](../developer-guide/templates) are list of tasks that can be shared between flows. You can define a template and call it from other flows allowing to share a list of tasks and keep these task updated without changing your flow.
