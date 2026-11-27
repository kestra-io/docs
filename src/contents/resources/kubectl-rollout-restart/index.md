---
title: "Kubectl Rollout Restart: Orchestrating Kubernetes Deployments"
description: "How kubectl rollout restart replaces pods without downtime, when to use it, how to check and undo a rollout, and how to automate restarts with verification and alerts."
metaTitle: "kubectl rollout restart: How It Works and How to Automate It"
metaDescription: "What kubectl rollout restart does, how it keeps pods available, how to check or undo a rollout, and how to automate restarts with verification and alerts."
tag: "infrastructure"
date: 2026-11-25
slug: "kubectl-rollout-restart"
faq:
  - question: "What does kubectl rollout restart do?"
    answer: "`kubectl rollout restart` triggers a rolling restart of a Kubernetes resource (like a Deployment or StatefulSet). It achieves this by updating a unique annotation in the pod template, signaling to the controller that a change has occurred, which then initiates a new rollout with updated pods while maintaining application availability."
  - question: "How does kubectl rollout restart achieve zero downtime?"
    answer: "It works by creating a new ReplicaSet and gradually replacing old pods with new ones. Kubernetes waits for new pods to pass their readiness probes before removing old ones, so traffic moves to the new pods while the application stays available. Without readiness probes, Kubernetes cannot tell when a new pod is really ready."
  - question: "When should I use kubectl rollout restart?"
    answer: "Use it to apply changes that require pods to be recreated, such as updating a ConfigMap or Secret that is mounted as a volume, or forcing a fresh start for an application experiencing issues. It's ideal for scenarios where the application code hasn't changed, but its configuration or environment needs to be refreshed."
  - question: "Can kubectl rollout restart be automated?"
    answer: "Yes, `kubectl rollout restart` can be automated as part of a larger orchestration workflow. Tools like Kestra can trigger these commands based on events (e.g., a new ConfigMap version), monitor their status, and integrate with notification or rollback procedures, ensuring reliable and audited operations."
  - question: "What is the difference between kubectl rollout restart and kubectl delete pod?"
    answer: "`kubectl rollout restart` replaces pods gradually, following the Deployment's rolling-update settings (maxUnavailable, maxSurge). `kubectl delete pod` removes a pod immediately; its controller recreates it, but nothing waits for the replacement to be ready first, so deleting several pods at once can cause downtime."
  - question: "How do I check the status of a rollout restart?"
    answer: "You can check the status of a rollout restart using the command `kubectl rollout status <resource_type>/<resource_name>`. This command provides real-time updates on the progress of the rollout, indicating whether new pods are being created and becoming ready, and when the rollout is complete."
  - question: "Can I undo a kubectl rollout restart?"
    answer: "A restart creates a new revision that differs only by the `kubectl.kubernetes.io/restartedAt` annotation, so `kubectl rollout undo` rolls back to the previous revision but rarely changes behaviour. If the restart exposed a problem (for example a bad ConfigMap value picked up by the new pods), fix or revert that configuration and restart again."
---

> **TL;DR** — `kubectl rollout restart` triggers a rolling restart of a Deployment, DaemonSet, or StatefulSet. It sets a `restartedAt` annotation on the pod template, so the controller replaces pods gradually while respecting readiness probes and the rollout strategy. Pair it with `kubectl rollout status` to confirm the restart actually finished.

Managing applications in Kubernetes often requires updating their underlying configuration or environment without disrupting service. While changing a ConfigMap or Secret doesn't always trigger a pod recreation, a full refresh is sometimes necessary to ensure all application instances reflect the latest state. Manually orchestrating this process across multiple deployments can be error-prone and time-consuming.

This article covers [`kubectl rollout restart`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/), the command for controlled restarts in Kubernetes. It explains how it works, practical applications, and common troubleshooting steps. We'll also show how to run it as an automated workflow that verifies the rollout and alerts the team.

## Understanding `kubectl rollout restart`: The Mechanics of Zero-Downtime Updates

The `kubectl rollout restart` command replaces your application's pods without taking the service down. Unlike manually deleting pods, which can interrupt service, a rollout restart uses the [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) rolling-update strategy.

### How Pod Template Annotations Drive Rolling Updates

When you execute `kubectl rollout restart deployment/my-app`, Kubernetes doesn't actually "restart" anything in the traditional sense. Instead, it updates an annotation within the deployment's pod template: `kubectl.kubernetes.io/restartedAt`. The value is set to the current timestamp.

This seemingly minor change is the key. The Deployment controller constantly monitors the pod template. When it detects a change, even in the metadata, it considers the template to be new. This triggers the standard rolling update process, just as if you had changed the container image or an environment variable.

### Ensuring Application Availability with ReplicaSets

The rolling update process is managed through ReplicaSets. Here’s how it works:
1.  **New ReplicaSet Creation:** The Deployment controller creates a new ReplicaSet based on the updated pod template.
2.  **Pod Scaling:** The new ReplicaSet begins to scale up, creating new pods with the updated configuration.
3.  **Health Checks:** Kubernetes waits for the new pods to pass their readiness probes, ensuring they are healthy and ready to serve traffic.
4.  **Old Pod Termination:** As new pods become ready, the controller scales down the old ReplicaSet, terminating the old pods.

This process respects the `maxUnavailable` and `maxSurge` parameters defined in your Deployment's strategy, ensuring that a minimum number of healthy pods are always available to handle requests. 

## Why Manual Kubernetes Rollouts Fall Short in Production

Running `kubectl rollout restart` by hand in a production environment introduces several risks and inefficiencies:
*   **Lack of Traceability:** Manual commands are not inherently audited. It's difficult to track who initiated a restart, why, and when, which is critical for compliance and incident response.
*   **No Scheduling or Event-Driven Logic:** You can't schedule a restart for off-peak hours or trigger it automatically in response to an event, like a secret rotation or a monitoring alert.
*   **No Automated Verification:** The command itself doesn't wait for the rollout to complete successfully. A separate `kubectl rollout status` command is required, and there's no built-in logic to handle timeouts or failures.
*   **Human Error:** Manual processes are prone to errors, such as targeting the wrong deployment or namespace, leading to unintended consequences.
*   **Integration Challenges:** It's difficult to chain restarts with other operations, like updating a database schema, clearing a cache, or sending notifications, without custom scripting.

To address these limits, teams turn to [workflow orchestration tools](/resources/infrastructure/workflow-orchestration-tools) that can encapsulate these operations into reliable, automated processes. This is a core aspect of modern [job orchestration](/resources/infrastructure/job-orchestration).

## Orchestrate Kubernetes Deployments with Kestra: Automated Rollout and Verification

Orchestration platforms like Kestra can automate the entire restart process, adding verification, error handling, and notifications. This turns a manual CLI command into a governed, event-driven workflow.

Consider a scenario where you need to restart a deployment after a configuration change. The following Kestra flow can be triggered by a webhook from your CI/CD system. It restarts the deployment, waits for it to complete, and sends a Slack notification.

```yaml
id: k8s-rollout-restart-and-verify
namespace: company.ops

triggers:
  - id: on_config_change
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('ROLLOUT_WEBHOOK_KEY') }}"

tasks:
  - id: restart_deployment
    type: io.kestra.plugin.kubernetes.kubectl.Restart
    namespace: my-app-ns
    resourceType: Deployment
    resourcesNames:
      - my-app-deployment

  - id: check_rollout_status
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: bitnami/kubectl:1.31
    inputFiles:
      kubeconfig: "{{ secret('KUBECONFIG') }}"
    env:
      KUBECONFIG: kubeconfig
    commands:
      - kubectl rollout status deployment/my-app-deployment -n my-app-ns --timeout=5m

  - id: notify_success
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Deployment my-app-deployment in my-app-ns restarted and rolled out (execution {{ execution.id }})."}

errors:
  - id: notify_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Restart of my-app-deployment in my-app-ns failed or timed out. Check execution {{ execution.id }}."}
```

The `Restart` task uses the worker's cluster credentials (kubeconfig or in-cluster service account) unless you set its `connection` property; the status check reads a kubeconfig stored as a Kestra secret.

**What's worth noticing in this workflow:**
*   **Declarative Restart:** The `kubectl.Restart` task names the resource to restart, so the action is explicit and recorded.
*   **Blocking Status Check:** [`kubectl rollout status`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_status/) runs in a separate shell task. With `--timeout`, it either succeeds when the rollout completes or fails when the timeout expires, which sends the failure alert.
*   **Automated Notifications:** The flow automatically sends a success or failure notification to Slack, providing immediate feedback without manual intervention.
*   **Centralized Auditing:** Every execution is logged in Kestra, providing a complete audit trail of who triggered the restart and the outcome. This is especially useful for [automating remediation from alerts](/blueprints/k8s-deployment-restart-remediation).

## Beyond Deployments: Applying `kubectl rollout restart` to Other Kubernetes Resources

The `kubectl rollout restart` command is not limited to Deployments. It can also be used with DaemonSets and StatefulSets, though with some differences in behavior.

### Restarting DaemonSets for Node-Level Updates

For DaemonSets, `kubectl rollout restart daemonset/<name>` triggers a rolling update across all nodes where the DaemonSet's pods are running. This is useful for applying node-level configuration changes, such as updating a logging agent or a monitoring tool. Kestra's `kubectl.Restart` task supports Deployments and StatefulSets; for DaemonSets, you can use a shell task as shown in the example above.

### Managing StatefulSets with Controlled Restarts

When used with a StatefulSet (`kubectl rollout restart statefulset/<name>`), the restart follows the StatefulSet's ordered update guarantees. Pods are restarted one at a time, in reverse ordinal order (e.g., `pod-2`, then `pod-1`, then `pod-0`). The controller waits for each pod to become ready before moving to the next one, ensuring the stability of stateful applications like databases or message queues.

## Essential Troubleshooting and Rollback with `kubectl rollout undo`

Even with controlled rollouts, things can go wrong. A new configuration might be invalid, or a new pod might fail its readiness probe. Kubernetes provides commands to inspect and revert rollouts.

To view the history of a deployment's revisions, use:
```bash
kubectl rollout history deployment/my-app-deployment
```

If you detect a problem after a restart, you can revert to the previous revision using `kubectl rollout undo`:
```bash
kubectl rollout undo deployment/my-app-deployment
```

This command rolls back the deployment to its previous state, effectively canceling the restart. For more complex failure scenarios, you can build automated rollback workflows, as shown in the [Kubernetes Failed Rollout Auto-Rollback blueprint](/blueprints/k8s-failed-rollout-auto-rollback).

Keep in mind that a restart only changes the `restartedAt` annotation. If the rollout fails because of a bad ConfigMap value, `undo` won't fix the underlying issue. The correct approach is to revert the ConfigMap and trigger another restart.

## Where Automated Kubernetes Rollouts Pay Off

Automating `kubectl rollout restart` in an orchestrator covers several use cases:
*   **Secret and ConfigMap Rotation:** Automatically restart deployments when their configuration changes in Vault, Git, or another source of truth. The [Rotate Vault Secrets into Kubernetes blueprint](/blueprints/kubernetes-vault-rotation-restart) shows this pattern.
*   **Periodic Application Refreshes:** Schedule nightly or weekly restarts to clear memory leaks, refresh caches, or recycle connections in legacy applications.
*   **Self-Healing Infrastructure:** Trigger a restart automatically in response to monitoring alerts from Prometheus or other systems, creating a basic [self-healing infrastructure](/resources/infrastructure/self-healing-infrastructure).
*   **GitOps Integration:** Integrate restarts into a [GitOps](/resources/infrastructure/gitops) pipeline, ensuring that configuration changes applied via Git are safely rolled out to the cluster.

By moving beyond manual commands, you can build a more resilient and automated infrastructure control plane.

## Related Concepts
- [Kestra for Kubernetes Orchestration](/orchestration/kubernetes)
- [Kubernetes Job Orchestration](/resources/infrastructure/kubernetes-job-orchestration)
- [Building Kubernetes Workflows](/resources/infrastructure/kubernetes-workflow)
- [The Kestra Kubernetes Plugin](/plugins/plugin-kubernetes)
- [Managing Retries and Restarts with Subflow Executions](/docs/how-to-guides/subflow-executions)

To learn more about how Kestra can help you manage your entire infrastructure, visit the [Infrastructure Automation](/infra-automation) page.
