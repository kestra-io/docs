---
title: Executions Page
---

On the **Executions** page, you will see a list of flow executions.

When clicking on an execution id or on the eye icon, you can open the page of an execution.

![Kestra User Interface Executions Page](/docs/user-interface-guide/08-Executions.png)

An **Execution** page will allow access to the details of a flow execution, including logs, outputs, and metrics. 

![Kestra User Interface Execution Page](/docs/user-interface-guide/09-Executions-Execution.png)


### Outputs

The outputs in an execution page allow to see each task outputs.

![Kestra User Interface Execution Outputs Tab](/docs/user-interface-guide/25-Executions-Outputs.png)

The "Eval Expression" box allows to evaluate [expressions](../05.developer-guide/03.variables/01.index.md) on those task outputs. It's a great way to debug your flows.


![Kestra User Interface Execution Outputs Eval Expression](/docs/user-interface-guide/26-Executions-Outputs-Eval-Expression.png)


For example, you can use the "Eval Expression" feature to deep-dive into your tasks outputs and play directly with [variables operations](../05.developer-guide/03.variables/02.basic-usage.md).
