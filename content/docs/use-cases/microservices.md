---
title: Coordinate Microservices
description: Run flows in response to events from microservices
order: 30
---

Modern data and engineering teams often rely on microservices to keep their systems modular, fault-tolerant, and flexible. Each microservice handles a single task, making it easier to develop, scale, and maintain. The main challenge is orchestrating these independent components so they run in the correct order, automatically recover from failures, and scale as needed.

## What is Microservices Orchestration?

Microservices orchestration is the automated coordination of services, often triggered by events such as a file upload to S3/SFTP, a message in Kafka/PubSub, or a new database row. A platform like Kestra defines the sequence of these services, manages their dependencies, and ensures reliable execution—whether triggered manually, via API calls, webhooks, schedules, or by other services.

Kestra can:
- Trigger your microservices from any event, schedule, or dependency
- Pass data between services, ensuring each receives the right input
- Dynamically provision task runner environments, so your services have enough compute resources
- Retry failed services, keeping workflows robust and fault-tolerant
- Send alerts or notifications on success or failure
- Track logs, metrics, inputs, and outputs of each service execution
- Roll back to earlier workflow versions as needed.

## Why Use Kestra for Microservices Orchestration?

1. **Visibility** – View dependencies, see which service failed or succeeded, then restart or roll back as needed.
2. **Simplicity** – Declare dependencies in YAML or use Kestra’s UI with no-code/low-code options.
3. **Scalability** – Run microservices in parallel and scale compute resources based on workload.
4. **Resilience** – If one service fails, Kestra can retry just that part instead of re-running the entire pipeline.
5. **Separation of Orchestration and Logic** – Keep your existing code as-is and add minimal YAML on top to orchestrate it.
6. **Extensibility** – Add new triggers, tasks, runners, or notifications through Kestra’s plugin system.
7. **Security and Compliance** – Manage secrets, access, encryption, and audit logs within Kestra.
8. **Version Control** – Keep orchestration configurations in Git and revert to previous versions if needed.
9. **Multi-Tenancy** – Use separate tenants/namespaces for different workflows, each with its own variables and secrets.
10. **Community and Support** – Ask questions and share tips in our Slack community.

## Example: Microservices Orchestration in Kestra

Below is a minimal Kestra flow for an e-commerce order-processing workflow. It checks inventory, processes payment, confirms the order, arranges shipping, and updates delivery status. Each task waits for a successful response before triggering the next service, passing data and determining the next step based on the status code of the prior API call.

```yaml
id: orderProcessing
namespace: ecommerce
description: E-commerce Order Processing Workflow

inputs:
  - id: orderId
    type: STRING
    defaults: myorder

tasks:
  - id: checkInventory
    type: io.kestra.plugin.core.http.Request
    description: Check inventory for the order items
    uri: https://reqres.in/api/inventory-service/check

  - id: processPayment
    type: io.kestra.plugin.core.http.Request
    runIf: "{{ outputs.checkInventory.code == 201 }}"
    description: Process payment for the order
    uri: https://reqres.in/api/payment-service/process

  - id: orderConfirmation
    type: io.kestra.plugin.core.http.Request
    runIf: "{{ outputs.processPayment.code == 201 }}"
    description: Confirm the order and notify the customer
    uri: https://reqres.in/api/order-service/confirm

  - id: arrangeShipping
    type: io.kestra.plugin.core.http.Request
    runIf: "{{ outputs.orderConfirmation.code == 201 }}"
    description: Arrange shipping for the order
    uri: https://reqres.in/api/shipping-service/arrange

  - id: updateDeliveryStatus
    type: io.kestra.plugin.core.http.Request
    runIf: "{{ outputs.arrangeShipping.code == 201 }}"
    description: Update the delivery status of the order
    uri: https://reqres.in/api/delivery-service/updateStatus

pluginDefaults:
  - type: io.kestra.plugin.core.http.Request
    values:
      contentType: multipart/form-data
      method: POST
      formData:
        orderId: "{{inputs.orderId}}"
```

## Getting Started with Microservice Orchestration in Kestra

1. **Install Kestra** – Follow the [quick start guide](../01.getting-started/01.quickstart.md) or the full [installation instructions for production environments](../02.installation/index.md).
2. **Write Your Workflows** – Configure your [flow](../03.tutorial/index.md) in YAML. Each task can invoke an API, run scripts, or call any existing service.
3. **Add Triggers** – Use scheduled or event-based [triggers](../04.workflow-components/07.triggers/index.md) to start microservice workflows.
4. **Observe and Manage** – Use [Kestra’s UI](../08.ui/index.md) to monitor states, logs, and metrics. Rerun failed workflow executions or roll back with one click.

If you’d like to explore further, join the [Slack community](https://kestra.io/slack) or [book a demo](https://kestra.io/demo) to discuss how Kestra can help orchestrate your microservices.