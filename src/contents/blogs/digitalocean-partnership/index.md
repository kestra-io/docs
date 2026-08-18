---
title: "Kestra Joins the DigitalOcean Partner Program: Orchestrate the Developer Cloud"
description: "Kestra is now an official DigitalOcean technology partner. A dedicated plugin covers droplets, managed databases, DNS, Kubernetes, firewalls, and volumes, backed by six production blueprints."
date: 2026-08-17T13:00:00
category: Company News
author:
  name: Martin-Pierre Roset
  linkedin: https://www.linkedin.com/in/martin-pierre-roset/
  image: "mproset"
image: ./main.jpg
---

**We are excited to announce that Kestra is now an official [DigitalOcean](https://www.digitalocean.com/) technology partner. With this partnership, we are releasing a dedicated DigitalOcean plugin that covers the most common tasks, and blueprints to get you started!**

## About DigitalOcean

DigitalOcean is designed for developers and expanding digital businesses, offering quick-boot droplets, managed databases like Postgres, MongoDB, MySQL, Redis, and Kafka, as well as managed Kubernetes (DOKS), block storage, load balancers, and DNS. All features are provided with transparent pricing and an easy-to-use API. Its simplicity explains why millions of developers prefer it, and why it requires smarter automation than just cron jobs running doctl scripts on neglected VMs.

## What the integration covers

With the new [`plugin-digitalocean`](/plugins/plugin-digitalocean), the DigitalOcean resources most teams touch daily become declarative Kestra tasks:

- Droplets: create, get, list, resize, delete, plus actions for power off, reboot, and snapshots
- Managed databases: create, get, list, resize, and delete clusters across Postgres, MySQL, Redis, MongoDB, Kafka, and OpenSearch
- Domains and DNS records: full record lifecycle for zones managed by DigitalOcean
- Kubernetes (DOKS): cluster lifecycle plus `GetKubeconfig`, which drops the kubeconfig straight into Kestra's internal storage ready for `kubectl`
- Firewalls, volumes, and load balancers: full lifecycle management
- An account-level trigger: `droplet.Trigger` polls the account and fires one execution for every new droplet it discovers

Every `List` task supports `fetchType` control, returning row data for iteration, counts for reporting, or ION files stored in Kestra's internal storage for downstream analytics.

DigitalOcean uses a single personal access token for its API. Ths single broad credential is exactly the thing you don't want pasted into a flow definition in Git. With Kestra its easy to securely store and reference it within a flow e.g. `{{ secret('DIGITALOCEAN_TOKEN') }}`

## Kestra and DigitalOcean unlocking value

The plugin earns its place on operations that span several API calls, need to poll for state, and have to behave correctly when something fails partway through. Those are orchestration problems, and they are where a flow beats a script.

### Ephemeral compute with guaranteed teardown

Provision a droplet per batch job, wait until it is actually active, run the workload, and destroy everything in a `finally` block that executes whether the job succeeded, failed, or timed out. A crashed workload never leaves a forgotten VM billing by the hour:

```yaml
id: ephemeral-runner
namespace: company.team

tasks:
  - id: create_droplet
    type: io.kestra.plugin.digitalocean.droplet.Create
    apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"
    name: "runner-{{ execution.id | lower }}"
    region: nyc3
    size: s-2vcpu-4gb
    image: ubuntu-24-04-x64
    apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"

  - id: wait_until_active
    type: io.kestra.plugin.core.flow.LoopUntil
    condition: "{{ outputs.poll.status == 'active' }}"
    checkFrequency:
      interval: PT10S
      maxDuration: PT10M
    failOnMaxReached: true
    tasks:
      - id: poll
        type: io.kestra.plugin.digitalocean.droplet.Get
        apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"
        dropletId: "{{ outputs.create_droplet.id }}"
        apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"

finally:
  - id: delete_droplet
    type: io.kestra.plugin.digitalocean.droplet.Delete
    apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"
    dropletId: "{{ outputs.create_droplet.id }}"
    apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"

```

### Governance for shadow infrastructure

Most teams find unauthorized infrastructure only when invoicing. For example, someone created a droplet in March for testing purposes; once the test ended, the droplet remained. Since nothing was monitoring, there was no time to catch it.

Kestra has events such as `droplet.Trigger` that bridge that gap by activating within minutes of a droplet appearing on the account, regardless of how it arrived, whether through the control panel, `doctl`, Terraform, or a teammate's laptop. The key point isn't just the notification, but that what was once a discovery becomes an action. This enables Kestra to perform any workflow operation on an unanticipated machine, just as it would normally.

This approach offers various responses tailored to the scenario. Enhance the event by matching tags and naming conventions with your inventory, shifting the focus from "what is this?" to "whose is this and is it authorized?". Share the incident on Slack for awareness and then pause. Use a `HumanTask` before any action that could destroy someone's work, ensuring detection is automatic but consequences are not. Escalate according to a schedule or notify upon discovery, follow up if unclaimed after a week, and quarantine behind a strict firewall instead of powering down. For namespaces with clear policies, take immediate action and document it. These are just some of the many possibilities with using Kestra as your enterprise grade orchestrator for DigitalOcean deployments.

### Fleet backups, DNS cutovers, and inventory

Tag-filtered nightly snapshots with dated names, verified blue-green DNS cutovers with duplicate cleanup, and a weekly parallel census of every resource type on the account posted to Slack. Each pattern ships as a blueprint you can copy today.

## Get started with DigitalOcean blueprints

TKestra offers sample patterns in the blueprint catalog that serve as a great starting point for your orchestration tasks. Here are a few of the DigitalOcean blueprints:

1. [Ephemeral droplet runner with guaranteed teardown](/blueprints/digitalocean-ephemeral-droplet-runner)
2. [Business-hours resize for managed databases](/blueprints/digitalocean-database-business-hours-resize)
3. [Nightly droplet snapshot backups by tag](/blueprints/digitalocean-droplet-snapshot-backup)
4. [New droplet governance guard](/blueprints/digitalocean-new-droplet-governance-guard)
5. [Blue-green DNS cutover](/blueprints/digitalocean-dns-blue-green-cutover)
6. [Weekly account inventory report](/blueprints/digitalocean-account-inventory-report)

## Get started

- Explore the [DigitalOcean orchestration guide](/orchestration/digitalocean)
- Browse the [DigitalOcean plugin documentation](/plugins/plugin-digitalocean)
- Copy a [blueprint](/blueprints) and run it against your account
- Visit our [partner page](/partners/digitalocean)

If you are running workloads on DigitalOcean and want to see what event-driven orchestration changes, [book a demo](/demo) or join the [Kestra community on Slack](/slack); we would love to hear what you build.
