---
order: 1
---

# Flow

A [flow](../developer-guide/flow) is a list of tasks. You create flows in Kestra to automate your processes.

A flow can have [inputs](#inputs).


## Task

A task is a single action in a flow. A task can have properties, use flow inputs and other tasks outputs, perform an action, and produce an [output](#outputs).

There are two kinds of tasks in Kestra:
- Runnable Tasks 
- Flowable Tasks


### Runnable Task 

Runnable Tasks handle computational work in the flow. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../architecture/#worker). 

By default, Kestra only includes a few Runnable Tasks. However, many of them are available as [plugins](../../plugins/) and if you use our default Docker image plenty of them will be already included.


### Flowable Task

[Flowable Tasks](../developer-guide/flowable) only handle flow logic (branching, grouping, parallel processing, etc.) and new task triggers. For example, the Switch task decides the next task to run based on some inputs. 

A Flowable Task is handled by [executors](../architecture/#executor) and can be called very often. Because of that, these tasks cannot include intensive computations, unlike Runnable Tasks. Most of the common Flowable Tasks are available in the default Kestra installation. 


## Namespace

A namespace is like a folder for flows. A namespace is composed of words and letters separated by `.`. The hierarchy depth for Namespaces is unlimited. Here are some examples of namespaces:
- `projectOne`
- `com.projectTwo`
- `test.projectThree.folder`

Namespaces are hierarchical, which means that for our previous example, the `test.projectThree.folder1` namespace is inside the `test.projectThree` namespace.


## Inputs 

[Inputs](../developer-guide/inputs) are parameters sent to a flow at execution time. It's important to note that inputs in Kestra are [strongly typed](../developer-guide/inputs/#input-types).

The inputs can be declared as either optional or mandatory. If the flow has required inputs, you'll have to provide them before the execution of the flow.

Inputs of type `FILE` will be uploaded to Kestra's [internal storage](../architecture/#the-internal-storage) and made available for all tasks.

Flow inputs can be seen in the **Overview** tab of the **Execution** page.

## Outputs

Each task can produce an output that may contain multiple properties. This output is described in the plugin documentation task and can then be accessible by all the following tasks via [variables](../developer-guide/variables/basic-usage.md).

Some outputs are of a special type and will be stored inside Kestra's [internal storage](../architecture/#the-internal-storage). Successive tasks may still use them as Kestra will automatically make them available for all tasks.

Tasks outputs can be seen in the **Outputs** tab of the **Execution** page. If an output is a file from the [internal storage](../architecture/#the-internal-storage), it will be available to download.


## Revision

Changing the source of a flow will produce a new revision for the flow. The revision is an incremental number that will be updated each time you change the flow. 

Internally, Kestra will track and manage all the revisions of the flow. Think of it as version control for your flows integrated inside Kestra.

You can access old revisions inside the **Revisions** tab of the **Flows** page.


## Listeners

[Listeners](../developer-guide/listeners) are special tasks that can listen to the current flow and launch tasks *outside the flow*, meaning launch tasks that will not be considered part of the flow.

The results of listeners will not change the execution status of the flow. Listeners are mainly used to send notifications or handle special behavior outside the primary flow.


## Triggers

[Triggers](../developer-guide/triggers) are a way to start a flow from external events. For example, a trigger might initiate a flow at a scheduled time or based on external events (webhooks, file creation, message in a broker, etc.).


## Templates

[Templates](../developer-guide/templates) are lists of tasks that can be shared between flows. You can define a template and call it from other flows. Templates allow you to share a list of tasks and keep them updated without changing all flows that use them.
