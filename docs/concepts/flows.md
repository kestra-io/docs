---
order: 1
---
# Flow
A [flow](../developer-guide/flow) is a list of task for Kestra. It defines all the behavior you want for the current flow. So, a flow is simple list of Task, group by namespace.

## Task
A Task is single action in a flow. 
A task is can optionally takes inputs, performs an action, and produces an optional outputs.

There is 2 kind of Task in Kestra : 

### Flowable Task
[Flowable Task](../developer-guide/flowable) are tasks only handle workflow state and trigger new tasks. It will handle the logic of the flow allowing doing complex workflow like branching, parallel tasks, ...  
A simple example is a `Switch` task that can take any inputs and decide witch are the next tasks to run (and allow branching). 

A Flowable Task is handled by `Executors` and can be called very often, so it can't run intensive computation. 

The Most common Flowable Task will be keep in the core. 

### Runnable Task 
Runnable Task are here to handle any computation work. This can be anything like file systems operation, api call, database query, ... Theses tasks can be compute intensive since it will be 
handle by `Workers`. By default, Kestra don't have a lot of `RunnableTask` and mostly all the tasks will be available as Plugins.

## Namespace
A namespace is a like a folder for file system. It aims to group flows in a limitless hierarchy.
Namespace is compose by word and letters separated by `.`. The hierarchy depth is not limited and is free for Kestra users to fit their organization.

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
