---
title: Concepts
---

This section lists key concepts of Kestra, listed alphabetically. You can treat this section as a lookup reference anytime you need more information about a specific concept or feature, rather than reading it from start to finish.

[**Task**](./tasks.md): a discrete action within a flow, capable of taking inputs and variables from the flow, and producing outputs for downstream consumption by end users and other tasks.

[**Flow**](./flow.md): a container for tasks, labels, variables, inputs, outputs and triggers, and their orchestration logic.

[**Namespace**](./namespace.md): a logical grouping of flows. Namespaces are used to organize workflows and manage access to secrets, task defaults and variables.

[**Execution**](./execution.md): a single run of a flow.

[**Task Run**](./execution.md#task-run): a single run of an individual task within a flow.

[**Triggers**](./triggers/index.md): a mechanism that automates the execution of a flow. Triggers can be scheduled, event-based or webhook-based.

[**Variables**](./variables.md): a map of custom key-value pairs to help reuse some values across tasks.

[**Inputs**](./inputs.md): a list of dynamic values passed to the flow at runtime.

[**Outputs**](./outputs.md): a mechanism that allows you to pass data between tasks and flows.

[**Labels**](./labels.md): a map of custom key-value pairs that you can use to organize (_and search for_) your flows and executions based on your project, maintainers, or any other criteria.

[**Secret**](./secret.md): a secret is a mechanism that allows you to securely store sensitive information, such as passwords and API keys, and retrieve them in a flow using `"{{ secret('API_TOKEN') }}"`. You can leverage your existing [secrets manager](./secrets-manager.md) as a secrets backend.

[**Internal Storage**](./internal-storage): a dedicated storage area to store your private data passed as inputs to a flow or generated as a result of a flow execution.

[**Expressions**](./expression/01.index.md): Kestra relies on an [integrated Pebble templating engine](./pebble.md) to dynamically render variables, inputs and outputs within the execution context.

For a more detailed explanation on all main concepts, please refer to the following pages:

<ChildTableOfContents :max="2" />
