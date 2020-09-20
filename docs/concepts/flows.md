---
order: 1
---
# Flow
A [flow](../developer-guide/flow) is a list of task for Kestra. It defines all the behavior you want for the current flow. A flow is so a simple list of Task, group by namespace.

## Task
A Task is single action in a flow. 
A task is can optionally takes inputs, performs an action, and produces an optional outputs.

There is 2 kind of Task in Kestra : 

### Flowable Task
This kind of tasks only handle workflow state and trigger new tasks. It will handle the logic of the flow allowing to do complex workflow like branching, parallel tasks, ...  
A simple example is a `Switch` task that can take any inputs and decide witch are the nexts tasks to run (and allow branching). 

A Flowable Task is handled by `Executors` and can be called very often so it can't run intensive computation. 

The Most common Flowable Task will be keep in the core. 

### Runnable Task 
Runnable Task are here to handle any computation work. This can be anything like file systems operation, api call, database query, ... Theses tasks can be compute intensive since it will be 
handle by `Workers`. By default, Kestra don't have a lot of `RunnableTask` and mostly all the tasks will be available as Plugins.

## Namespace
A namespace is a like a folders for file system. It aim to group flows in a limitless hierarchy.
Namespace is compose by word and letters separated by `.`. The hierarchy depth is not limited and is free for Kestra users to fit their organization.

## Inputs 
Inputs are mandatory or optional parameters sent to a flow in order to be successfully run. It can be anythings (string, int, file, ...) to will be send when the execution is created. Flow must defined possible inputs and mandatory one will be validated before the creation of the execution. 

## Revision
Each flow modification will produce a new revision, revision is a simple increments number that will update after each change of the flow. Internally Kestra will track and keep all revisions of the flow.

## Listeners
Listeners are special task that can listen to the current flow and launch task *outside of the flow*.
The result of the tasks will not change the execution status. Mostly Listeners are here to send notification or handle special end task behaviour that you don't want to be considered as main workflow.
 
## Triggers
Triggers are way to start a flow with external events. For example, on a schedule date or waiting for some external events (like file creation)

