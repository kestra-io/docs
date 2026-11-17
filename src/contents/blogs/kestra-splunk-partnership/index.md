---
title: "Kestra Joins the Splunk Partner Ecosystem: From Splunk Alert to Automated Response"
description: "Kestra is now a certified Splunk partner. The Kestra Add-on for Splunk is live on Splunkbase, so a Splunk alert can start a Kestra flow with the alert context and the search results attached."
date: 2026-11-12T10:00:00
category: Company News
image: ./main.webp
author:
  name: Emmanuel Darras
  linkedin: https://www.linkedin.com/in/emmanuel-darras/
  image: edarras
  role: CEO & Co-founder
---

Kestra is now a certified Splunk partner, and the [Kestra Add-on for Splunk](https://splunkbase.splunk.com/app/10120) is live on Splunkbase for Splunk Enterprise and Splunk Cloud Platform.

From now on, a Splunk alert can start a Kestra flow directly. The alert context and the search results travel with it, so the flow can fix the problem, open the ticket, ask a human to approve, and record every step.

## Our customers asked for this

Splunk is where many of our largest customers watch their infrastructure and security. Kestra is where they run what happens next. Over the past year, the same request kept coming back from platform, security, and operations teams, including several Fortune 500 companies: connect the two without writing glue code.

They were already doing it by hand. A script polled Splunk, an unauthenticated webhook called a flow, or an engineer read the alert and started the remediation themselves. It worked until the person who wrote the script left, or until an auditor asked who had approved the change.

One of them, running Kestra across more than a dozen industrial sites, asked us for a Splunk integration and had it in production within three days. That request is where this add-on started. Others followed, and it became clear the integration had to be a supported product, available where Splunk users already look for one.

So we joined the Splunk Build Partner Motion, put it through the Splunkbase review, and published it as an official Splunk partner.

## What the add-on does

The add-on adds a **Trigger Kestra Flow** alert action to Splunk. You configure it per alert, with the Kestra tenant, namespace, and flow to run. When the alert fires, the add-on calls the Kestra Executions API and sends:

- the alert metadata: search name, search ID, app, owner, trigger time, and a link to the results
- the result fields you choose to map, using Splunk tokens such as `$result.host$` or `$name$`
- the full search results, attached as a CSV file

Each value arrives in the flow as a typed input. Kestra connections are reusable across alerts, API tokens are stored encrypted in Splunk's credential store, and a dedicated `kestra_alert_user` role lets alert owners use the action without admin rights.

## From detection to governed response

A Splunk alert detects repeated failed logins on a production host. It triggers a Kestra flow that:

1. reads the host and the user from the alert inputs
2. disables the account through the identity provider's API
3. opens a ServiceNow incident with the search results attached
4. waits for a security engineer to approve before access comes back
5. sends the outcome back to Splunk, so the investigation keeps its full record

```yaml
id: splunk_failed_logins
namespace: security.response

inputs:
  - id: search_name
    type: STRING
  - id: host
    type: STRING
  - id: user
    type: STRING
  - id: results
    type: FILE

tasks:
  - id: log_alert
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.search_name }}: failed logins for {{ inputs.user }} on {{ inputs.host }}"

  # next: disable the account, open the incident, pause for approval,
  # then send the outcome back to Splunk
```

The same pattern covers the rest of operations: a disk filling up runs the cleanup playbook, a certificate close to expiry starts the renewal, a degraded service gets restarted, and its owner notified. Every run has an owner, an approval where one is needed, and an audit trail.

## A two-way integration

Kestra flows already work with Splunk through the [Kestra plugin for Splunk](/plugins/plugin-ee-splunk) in Kestra Enterprise:

- `Send` pushes events to Splunk through the HTTP Event Collector
- `Search` runs an SPL query and returns the results to the flow
- `LogExporter` ships Kestra execution logs to Splunk

With the add-on, Splunk can now start those flows too. Detection lives in Splunk, response runs in Kestra, and the results flow back to Splunk, so security and operations teams keep one place to search everything that happened.

## What's next

Most of the requests behind this add-on came from infrastructure teams. They use Splunk to see what happens across servers, networks, and clouds, and Kestra to [automate the infrastructure](/infra-automation) itself: provisioning, patching, configuration with [Ansible](/plugins/plugin-ansible) and [Terraform](/plugins/plugin-terraform), and migrations off legacy tools such as [VMware vRA and vRO](/resources/migration/vra). The add-on closes the loop between the two.

Thank you to the Cisco and Splunk partner teams.

- Install the [Kestra Add-on for Splunk from Splunkbase](https://splunkbase.splunk.com/app/10120)
- Follow the [setup guide](/docs/how-to-guides/splunk-alert-trigger) to connect an alert to a flow
- Read the [Splunk plugin documentation](/plugins/plugin-ee-splunk)
- Visit our [Splunk partner page](/partners/splunk)
- [Talk to our team](/demo) about connecting your Splunk alerts to Kestra
