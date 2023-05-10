---
title: Executions Page
---

On the **Executions** page, you will see a list of flow executions.

When clicking on an execution id or on the eye icon, you can open the page of an execution.

![Kestra User Interface Executions Page](/docs/user-interface-guide/08-Executions.png)

An **Execution** page will allow access to the details of a flow execution, including logs, outputs, and metrics. 

![Kestra User Interface Execution Page](/docs/user-interface-guide/09-Executions-Execution.png)


### Gantt Tab

The Gantt tab allows to see each task durations. From this interface you can replay a specific task, see task source code, change task status, or look at task [metrics](../03.concepts/02.executions.md#metrics) and [outputs](../03.concepts/02.executions.md#outputs).

![Kestra User Interface Execution Gantt Tab](/docs/user-interface-guide/27-Executions-Gantt.png)

### Logs Tab

The Logs tab allows to access tasks logs. You can filter by log level, copy logs in your clipboard, or download logs as a file.

![Kestra User Interface Execution Log Tab](/docs/user-interface-guide/28-Executions-Logs.png)

### Topology Tab

Like in the editor view, you can see your execution topology. From this you can access specific task logs, replay certain tasks or change task status.

### Outputs Tab

The outputs tab in an execution page allow to see each task outputs.

![Kestra User Interface Execution Outputs Tab](/docs/user-interface-guide/25-Executions-Outputs.png)

The "Eval Expression" box allows to evaluate [expressions](../05.developer-guide/03.variables/01.index.md) on those task outputs. It's a great way to debug your flows.

> Note: you have to select one task to be able to use the "Eval Expression" button.


![Kestra User Interface Execution Outputs Eval Expression](/docs/user-interface-guide/26-Executions-Outputs-Eval-Expression.png)


For example, you can use the "Eval Expression" feature to deep-dive into your tasks outputs and play directly with [variables operations](../05.developer-guide/03.variables/02.basic-usage.md).


### Metric Tab

The Metric tab shows every metric exposed by tasks after execution.

![Kestra User Interface Execution Metric Tab](/docs/user-interface-guide/29-Executions-Metric.png)
