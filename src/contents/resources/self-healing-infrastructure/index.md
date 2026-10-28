---
title: "Auto-Remediation: Build Self-Healing Infrastructure from Alerts"
description: "Learn how auto-remediation turns Prometheus and Grafana alerts into verified fixes, and how to build self-healing infrastructure with event-driven workflows."
metaTitle: "Auto-Remediation & Self-Healing Infrastructure Guide"
metaDescription: "Auto-remediation for self-healing infrastructure: route Prometheus or Grafana alerts to a webhook, run guarded fixes, verify them, and escalate failures."
tag: "infrastructure"
date: 2026-09-02
lastUpdated: 2026-10-26
slug: "self-healing-infrastructure"
faq:
  - question: "What is auto-remediation?"
    answer: "Auto-remediation is the automatic execution of a predefined fix when a monitoring alert fires, such as restarting a deployment, freeing disk space, or rolling back a release. A complete auto-remediation loop also verifies that the fix worked and escalates to a human when it did not."
  - question: "How do I trigger auto-remediation from a Prometheus or Grafana alert?"
    answer: "Point a Prometheus Alertmanager webhook receiver or a Grafana webhook contact point at a Kestra Webhook trigger. The alert payload, including its labels, is available in the flow as the trigger body, so the flow can read the target from the labels, check it against an allowlist, run the fix, and verify the result."
  - question: "Is it safe to run auto-remediation without human approval?"
    answer: "It is safe for known, reversible, idempotent actions on allowlisted targets, such as restarting a stateless service in staging. Destructive actions, data changes, and production targets outside the allowlist should go through an approval step before the fix runs."
  - question: "What is a self-healing system?"
    answer: "A self-healing system is an IT architecture that automatically detects, diagnoses, and resolves operational anomalies or infrastructure failures without manual human intervention."
  - question: "What are self-healing technologies?"
    answer: "Self-healing technologies include automated monitoring tools, event-driven orchestrators, chaos engineering scripts, and AI-driven anomaly detectors that trigger corrective actions upon failure."
  - question: "Is Kubernetes self-healing?"
    answer: "Kubernetes provides container-level self-healing by restarting crashed pods or replacing unhealthy nodes within its cluster boundaries. But it does not manage cross-system dependencies, cloud services, or complex business logic."
  - question: "What are self-healing techniques in IT?"
    answer: "Common self-healing techniques include health-check polling, automatic container restarts, exponential backoff retries, dead-letter queues, and orchestration-driven remediation subflows."
  - question: "How does orchestration enable self-healing infrastructure?"
    answer: "Orchestration provides the state awareness, event triggers, and execution engine needed to coordinate detection, alerting, and remediation across disparate cloud services and APIs."
---

> **TL;DR** — Self-healing infrastructure automatically detects, diagnoses, and remediates operational failures without human intervention. Auto-remediation is the part that acts: an alert from Prometheus, Grafana, or any monitoring tool calls a webhook, an orchestration layer checks the target against guardrails, and a remediation workflow runs: restarting a service, replacing a node, draining a queue. Engineers are paged only when the automated attempt fails or the fault falls outside known patterns.

If your pager goes off at 3 AM for an incident that a shell script or a restart command could have fixed, the problem isn't your monitoring—it's your lack of automated remediation. Modern cloud estates generate thousands of telemetry signals per second, yet human operators still spend hours diagnosing recurring faults. Self-healing infrastructure replaces manual firefighting with deterministic, event-driven recovery loops.

## What is self-healing infrastructure?

Self-healing infrastructure is a design pattern where systems can autonomously recover from failures. Instead of just alerting a human operator, the system initiates a predefined, automated workflow to restore itself to a healthy state. This goes beyond simple redundancy or failover; it's about active, intelligent remediation.

### Defining self-healing systems in IT
A self-healing system operates on a continuous feedback loop:
1.  **Detect:** An issue is identified through monitoring, health checks, or external events (e.g., an alert from Prometheus, Datadog, or a custom application).
2.  **Diagnose:** The system analyzes the signals to classify the failure. Is it a transient network blip, a crashed container, a memory leak, or a misconfiguration?
3.  **Act:** Based on the diagnosis, an automated remediation workflow is triggered. This could be as simple as restarting a service or as complex as reprovisioning a server and draining traffic.
4.  **Verify:** After the action, the system confirms that the remediation was successful and the component has returned to a healthy state. If not, it can escalate to a human operator.

### How self-healing infrastructure works
The core mechanism is the connection between monitoring systems and an automation engine. An observability platform detects a deviation from the desired state (e.g., an API endpoint returns a 503 error, or CPU usage remains at 100% for five minutes). This detection triggers an event, often via a webhook.

An orchestration platform consumes this event and executes a corresponding remediation workflow. This workflow contains the logic to fix the specific issue—restarting a pod, clearing a cache, rolling back a deployment, or failing over to a secondary database. The key is that this entire process is automated, codified, and repeatable.

### Self-healing technologies explained
Achieving self-healing requires a combination of tools and technologies:
-   **Monitoring and Alerting:** Tools like Prometheus, Grafana, Datadog, or cloud-native services (AWS CloudWatch, Azure Monitor) provide the initial signals of failure.
-   **Orchestration Engines:** Platforms like Kestra act as the "brain," consuming events and executing complex, stateful remediation workflows.
-   **Infrastructure as Code (IaC):** Tools like Terraform and Ansible provide the declarative means to provision and configure infrastructure, ensuring that "fixing" it means returning it to a known-good state defined in code.
-   **Containerization:** Technologies like Docker and container orchestrators like Kubernetes provide the basic building blocks for self-healing at the application level, such as automatic container restarts.

## What is auto-remediation?

Auto-remediation is the automatic execution of a predefined fix in response to a monitoring alert. When an alert fires, a workflow runs the corrective action an on-call engineer would otherwise run by hand, checks that the system is healthy again, and escalates only if it is not.

### Auto-remediation vs. self-healing infrastructure
The two terms are often used interchangeably, but they describe different layers. Self-healing is a property of the system: it recovers on its own. Auto-remediation is the mechanism that delivers that property for faults the platform cannot absorb by itself. Kubernetes rescheduling a crashed pod is built-in self-healing. A workflow that restarts a deployment because Prometheus reports a stuck rollout, or that frees disk space because Grafana shows a volume at 95%, is auto-remediation.

### What to auto-remediate, and what to leave to humans
Good candidates share three traits: the failure is well understood, the fix is idempotent, and the fix is reversible. Typical examples:
-   Rolling restart of a stateless deployment that stopped serving traffic.
-   Clearing temporary files or rotating logs when a disk crosses a threshold.
-   Scaling out a worker pool when a queue backlog grows.
-   Re-running a failed job after a transient dependency outage.

Leave database schema changes, data deletion, and anything without a tested rollback to an approval step. Auto-remediation that guesses makes incidents worse.

## Why traditional monitoring falls short of self-healing

Traditional operations models are built around alerting. A system fails, an alert fires, and a human is paged to investigate and resolve the issue. This approach has fundamental limitations in modern, complex environments.

### The gap between alerting and remediation
Alerts tell you something is broken; they don't fix it. The time between an alert firing and an operator acting (Mean Time to Resolution, or MTTR) can be minutes or hours, especially during off-peak times. This "remediation gap" leads to extended downtime, customer impact, and operator fatigue from handling repetitive incidents. Self-healing closes this gap by making remediation the immediate, automated response to an alert.

### Why cron jobs and basic scripts fail at scale
Many teams attempt to bridge the remediation gap with simple shell scripts triggered by cron. This approach is brittle and doesn't scale for several reasons:
-   **Lack of State:** A cron job doesn't know if a previous run is still active or if the system is already in a recovery state. This can lead to multiple remediation attempts conflicting with each other.
-   **No Error Handling:** What happens if the remediation script itself fails? Without a proper orchestration engine, there are no built-in retries, error branching, or escalation paths.
-   **Poor Observability:** Debugging a failed cron job often involves SSHing into a server and parsing log files. There is no central dashboard, audit trail, or visibility into execution history.
-   **Credential Management:** Scripts often have sensitive credentials hardcoded or stored insecurely on disk, creating a significant security risk.

## How to implement self-healing infrastructure

Building a self-healing system is an incremental process that combines architectural choices with the right tooling.

### Architectural strategies for self-preservation
-   **Health Checks and Liveness Probes:** Expose endpoints (e.g., `/healthz`) that report the internal state of an application. Load balancers and orchestrators can use these to automatically remove unhealthy instances from service.
-   **Idempotency:** Ensure that remediation actions can be run multiple times without changing the result beyond the initial application. A "restart service" script should work correctly whether the service is running or already stopped.
-   **Decoupling and Microservices:** Smaller, independent services are easier to restart, scale, or replace without affecting the entire system.
-   **Circuit Breaker Pattern:** When a downstream service is failing, a circuit breaker can temporarily stop sending requests to it, preventing cascading failures and giving the service time to recover.

### Is Kubernetes self-healing?
Kubernetes provides a powerful foundation for self-healing at the container level. Its control plane constantly works to match the actual state of the cluster to the desired state defined in YAML manifests. If a pod crashes, the ReplicaSet controller will automatically create a new one. If a node fails, its workloads will be rescheduled to healthy nodes.

But Kubernetes's self-healing capabilities are confined to its own cluster. It cannot automatically remediate issues with external dependencies like a managed database, a third-party API, or a misconfigured cloud storage bucket. True end-to-end self-healing requires a higher-level orchestration layer to coordinate actions across Kubernetes and the broader cloud estate.

### Bridging cloud services with event-driven orchestration
The key to extending self-healing beyond a single platform like Kubernetes is [event-driven orchestration](/resources/infrastructure/event-driven-orchestration). An alert from any system—AWS CloudWatch, a database monitor, or a custom application metric—can be converted into a standardized event. An orchestrator subscribes to these events and triggers workflows that can interact with any API or service, regardless of where it runs. This allows you to build remediation logic that spans your entire stack, from on-prem servers to multi-cloud services.

## Orchestrate self-healing workflows with Kestra

Kestra provides the event-driven triggers, stateful execution, and declarative workflow definitions needed to build dependable self-healing systems. You can define remediation playbooks as simple YAML files, version them in Git, and trigger them automatically from any monitoring tool.

This example workflow creates a webhook trigger that listens for alerts from a monitoring system. When an alert is received, it attempts to restart the failing service via a shell command. If the restart fails after multiple retries, it sends a detailed failure notification to a Slack channel for human intervention.

```yaml
id: self-healing-service-restart
namespace: company.team.production

triggers:
  - id: listen-for-monitoring-alerts
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('WEBHOOK_KEY') }}"

tasks:
  - id: attempt_restart
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: alpine:latest
    env:
      HOST: "{{ trigger.body.host }}"
      SERVICE: "{{ trigger.body.serviceName }}"
    commands:
      - 'echo "Attempting to restart service: $SERVICE"'
      # The request body is untrusted and ssh passes its command to a remote shell, so allow only safe characters
      - case "$HOST$SERVICE" in *[!A-Za-z0-9@._-]*) echo "Invalid host or service name"; exit 1;; esac
      # In a real scenario, this would be an SSH command or API call
      - ssh ops@"$HOST" sudo systemctl restart "$SERVICE"
    retry:
      type: exponential
      maxAttempts: 3
      interval: PT1M
      maxInterval: PT5M

  - id: check_restart_status
    type: io.kestra.plugin.core.http.Request
    uri: "http://{{ trigger.body.host }}/healthz"
    method: GET
    retry:
      type: constant
      maxAttempts: 5
      interval: PT30S

errors:
  - id: notify_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_ALERT_WEBHOOK') }}"
    payload: |
      {
        "text": "🚨 Self-healing FAILED for service `{{ trigger.body.serviceName }}` on host `{{ trigger.body.host }}`.",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "🚨 *Self-healing FAILED* for service `{{ trigger.body.serviceName }}` on host `{{ trigger.body.host }}`.\nManual intervention required.\n<{{ execution.url }}|Link to Kestra Execution>"
            }
          }
        ]
      }
```

A few things are worth noticing in this workflow:
-   **Event-Driven:** The `Webhook` trigger allows any monitoring system to initiate the workflow with a simple HTTP POST request.
-   **Stateful Retries:** The `retry` block on the `attempt_restart` task uses an [exponential backoff](/resources/infrastructure/exponential-backoff) strategy, preventing it from overwhelming the system during a prolonged outage.
-   **Verification Step:** The `check_restart_status` task actively probes the service's health endpoint to confirm if the restart was successful.
-   **Automated Escalation:** The `errors` block ensures that if all automated attempts fail, a human is notified with a clear, context-rich message, including a direct link to the execution logs. You can explore more patterns in our [self-healing blueprint](/blueprints/self-healing-recovery-loop).

## Alert-driven auto-remediation with Prometheus, Grafana, and Kestra

Most teams already have the detection half of the loop: Prometheus rules, Grafana alerts, and a pager. What is missing is the step between the alert and the fix. Both Prometheus Alertmanager and Grafana Alerting can deliver an alert as an HTTP POST, which is exactly what a Kestra Webhook trigger accepts. The alert's labels then tell the flow what to fix.

### The alert-to-remediation loop
1.  **Alert rule fires:** a Prometheus rule or a Grafana alert detects a condition, for example a deployment whose available replicas stay below the desired count.
2.  **Routing sends it to a webhook:** only alerts labeled as remediable (for example `remediation="restart"`) are routed to Kestra. Everything else keeps paging as before.
3.  **Kestra reads the target from the labels:** `namespace` and `deployment` come from the alert payload, not from a hardcoded script.
4.  **Guardrails decide:** the target is checked against an allowlist. Anything outside it is refused and escalated.
5.  **The fix runs, then gets verified:** the flow restarts the deployment and probes its health endpoint with retries.
6.  **Failure escalates:** if the fix or the verification fails, the on-call channel gets the alert name, the target, and a link to the execution.

### Send Prometheus Alertmanager alerts to a Kestra webhook
Add a webhook receiver in `alertmanager.yml` and route only opted-in alerts to it. Grouping by `namespace` and `deployment` makes each notification target a single workload, so the flow can read the target from `commonLabels`.

```yaml
route:
  receiver: default-pager
  routes:
    - matchers:
        - remediation="restart"
      receiver: kestra-auto-remediation
      group_by: ["alertname", "namespace", "deployment"]

receivers:
  - name: default-pager
    # your existing PagerDuty, Opsgenie, or Slack receiver
  - name: kestra-auto-remediation
    webhook_configs:
      - url: "https://<your-kestra-host>/api/v1/main/executions/webhook/company.sre/alert-auto-remediation/<webhook-key>"
        send_resolved: true
```

The step-by-step setup, including alert rules and a Docker Compose file for Prometheus and Alertmanager, is in the guide to [trigger a flow on a Prometheus alert](/docs/how-to-guides/prometheus-alert-trigger).

### Send Grafana alerts to the same flow
In Grafana Alerting, create a contact point with the **Webhook** integration and paste the same Kestra webhook URL. Then add a notification policy that matches the `remediation=restart` label and sends to that contact point. Grafana's webhook payload also carries `status` and `commonLabels`, so the flow below works for both sources without changes.

### A guarded auto-remediation flow
This flow restarts the deployment named in the alert, but only in allowlisted namespaces, and only for alerts that are firing. Resolved notifications are filtered out by the trigger's `when` condition, so they never start an execution.

```yaml
id: alert-auto-remediation
namespace: company.sre

variables:
  allowed_namespaces: ["staging", "production-canary"]

triggers:
  - id: from_alerting
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('REMEDIATION_WEBHOOK_KEY') }}"
    # Resolved notifications return 204 and start nothing
    when: "{{ trigger.body.status == 'firing' }}"

tasks:
  - id: read_target
    type: io.kestra.plugin.core.execution.SetVariables
    variables:
      namespace: "{{ trigger.body.commonLabels.namespace ?? '' }}"
      deployment: "{{ trigger.body.commonLabels.deployment ?? '' }}"

  - id: guardrails
    type: io.kestra.plugin.core.flow.If
    condition: "{{ vars.deployment == '' or not (vars.namespace isIn vars.allowed_namespaces) }}"
    then:
      - id: refuse
        type: io.kestra.plugin.core.execution.Fail
        errorMessage: "No auto-remediation for {{ vars.namespace }}/{{ vars.deployment }}: target is not allowlisted."

  - id: restart_deployment
    type: io.kestra.plugin.kubernetes.kubectl.Restart
    connection:
      masterUrl: "{{ secret('K8S_MASTER_URL') }}"
      caCertData: "{{ secret('K8S_CA_CERT_DATA') }}"
      oauthToken: "{{ secret('K8S_OAUTH_TOKEN') }}"
    namespace: "{{ vars.namespace }}"
    resourceType: Deployment
    resourcesNames:
      - "{{ vars.deployment }}"

  - id: verify_health
    type: io.kestra.plugin.core.http.Request
    # Assumes Kestra workers can reach in-cluster services
    uri: "http://{{ vars.deployment }}.{{ vars.namespace }}.svc.cluster.local/healthz"
    method: GET
    retry:
      type: constant
      maxAttempts: 10
      interval: PT30S

errors:
  - id: escalate_to_on_call
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {
        "text": "Auto-remediation failed for {{ vars.namespace }}/{{ vars.deployment }} (alert: {{ trigger.body.commonLabels.alertname ?? 'unknown' }}). Manual intervention needed: {{ execution.url }}"
      }
```

For a variant that takes the target from webhook query parameters and reports success to Slack, start from the [Kubernetes deployment restart remediation blueprint](/blueprints/k8s-deployment-restart-remediation).

### Guardrails that keep auto-remediation safe
-   **Opt-in routing:** only alerts carrying a remediation label reach the flow. A new alert rule never triggers a fix by accident.
-   **Allowlisted targets:** the flow refuses any namespace that is not explicitly listed, and a refusal escalates like any other failure.
-   **Untrusted input:** alert labels arrive in an HTTP request. They are compared against the allowlist and passed as API arguments, never interpolated into a shell command.
-   **One remediation at a time:** by default, a trigger starts no new execution while its previous one is still running (`allowConcurrent: false`), so a flapping alert cannot stack restarts. If several workloads must be remediated in parallel, enable `allowConcurrent` and cap the flow with a [concurrency limit](/docs/workflow-components/concurrency).
-   **Verification before success:** the execution succeeds only when the health endpoint answers, not when the restart command returns.
-   **Human approval where it matters:** for production targets, add a [pause and resume](/docs/how-to-guides/pause-resume) step before the fix. In Kestra 2.0, [Cases](/blogs/kestra-2-0-cases-incident-management) can also group the failing executions of an incident and attach remediation flows as one-click actions, with the approval and audit trail on the same record.

## Real-world use cases for autonomous remediation

### Automated service recovery and restarts
This is the most common use case. When a critical service or API becomes unresponsive, an automated workflow can immediately attempt a graceful restart, clear temporary files, or cycle the container, often resolving the issue faster than a human could even log in.

### Infrastructure configuration drift correction
Using an IaC tool like [Terraform](/docs/terraform), you can build workflows that periodically check for configuration drift. If a manual change has been made to a production resource, a self-healing workflow can automatically run `terraform apply` to revert the infrastructure to its code-defined state, ensuring consistency and preventing configuration-related outages.

### Database failover and connection draining
In the event of a primary database failure, a self-healing workflow can automate the entire failover process. This includes promoting a read replica to primary, updating DNS records or service discovery, and gracefully restarting application services to use the new database connection.

## Related concepts
-   [What is a Runbook?](/resources/infrastructure/runbook)
-   [Runbook Automation Tools](/resources/infrastructure/runbook-automation-tools-2026)
-   [Incident Management Workflow](/resources/infrastructure/incident-management-workflow)
-   [Workflow Observability](/resources/infrastructure/workflow-observability)
-   [IT Process Automation](/resources/infrastructure/it-process-automation)
-   [Task Retries in Kestra](/docs/workflow-components/retries)
-   [Dead Letter Queue (DLQ)](/resources/infrastructure/dead-letter-queue)
