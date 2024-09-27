---
title: System Flows
icon: /docs/icons/admin.svg
editions: ["OSS", "EE"]
version: ">= 0.19.0"
---

Automate maintenance workflows with System Flows.

System Flows are designed to handle periodically executed background operations that keep your platform running, but which you would generally prefer to keep out of sight. These flows automate maintenance workflows, such as:

1. Sending [alert notifications](https://kestra.io/blueprints/system/250-set-up-alerts-for-failed-workflow-executions-using-slack)
2. Creating automated support tickets when critical workflows fail
3. [Purging logs](https://kestra.io/blueprints/trigger/234-purge-execution-data-including-logs-metrics-and-outputs-on-a-schedule) and removing old executions or internal storage files to save space
4. Syncing code from Git or pushing code to Git
5. Automatically [releasing flows](https://kestra.io/blueprints/system/258-copy-flows-from-development-to-qa-and-staging-environments-or-tenants) from development to QA and staging environments

We refer to these as **System Flows** because by default they are hidden from end users and are only visible within the `system` namespace. If you prefer, you can use a different namespace name instead of `system` by overwriting the following [configuration](https://kestra.io/docs/configuration-guide/system-flows):

```yaml
kestra:
  system-flows:
    namespace: system
```

To access System Flows, navigate to the `Namespaces` section in the UI. The `system` namespace is pinned at the top for quick access.

![system_namespace](/docs/concepts/system-flows/system_namespace.png)

Here, you’ll find the _System Blueprints_ tab, which provides fully customizable templates which you can modify to suit your organization’s needs.

![system_blueprints](/docs/concepts/system-flows/system_blueprints.png)

Keep in mind that System Flows are not restricted to System Blueprints — any valid Kestra flow can become a System Flow if it's added to the `system` namespace.

System Flows are intentionally hidden from the main UI, appearing only in the `system` namespace. The Dashboard, Flows, and Executions pages offer a multi-select filter with options for `User` (default) and `System` (visible by default only within the `system` namespace). This makes it easy to toggle between user-facing workflows and background system flows and their executions, or view both simultaneously.

![system_filter](/docs/concepts/system-flows/system_filter.png)

In terms of permissions, `system` namespace is open by default, but using the namespace-level RBAC functionality in the Enterprise Edition, you can restrict access to the `system` namespace only to Admins, while assigning `company.*` namespaces to your general user base.

