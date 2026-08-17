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

**We are excited to announce that Kestra is now an official [DigitalOcean](https://www.digitalocean.com/) technology partner. Alongside the partnership, we are shipping a dedicated DigitalOcean plugin covering the whole account surface, six production-tested blueprints, and a full [orchestration guide](/orchestration/digitalocean), so teams running on the developer cloud get the operations layer the control panel never shipped.**

## About DigitalOcean

DigitalOcean is the cloud built for developers and growing digital businesses: droplets you can boot in under a minute, managed Postgres, MySQL, Redis, and Kafka, managed Kubernetes (DOKS), block storage, load balancers, and DNS, all with predictable pricing and an API that is a pleasure to work with. That simplicity is exactly why millions of developers choose it, and exactly why it deserves better automation than cron jobs running doctl scripts on a forgotten VM.

## What the integration covers

The new [`plugin-digitalocean`](/plugins/plugin-digitalocean) turns every resource type on a DigitalOcean account into declarative Kestra tasks:

- Droplets: create, get, list, resize, delete, plus actions for power off, reboot, and snapshots
- Managed databases: create, get, list, resize, and delete clusters across Postgres, MySQL, Redis, MongoDB, Kafka, and OpenSearch
- Domains and DNS records: full record lifecycle for zones managed by DigitalOcean
- Kubernetes (DOKS): cluster lifecycle plus `GetKubeconfig`, which drops the kubeconfig straight into Kestra's internal storage ready for `kubectl`
- Firewalls, volumes, and load balancers: create, attach, update, and delete
- An account-level trigger: `droplet.Trigger` polls the account and fires one execution for every new droplet it discovers, turning the DigitalOcean API into an event source

Every `List` task supports `fetchType` control, returning row data for iteration, counts for reporting, or ion files stored in Kestra's internal storage for downstream analytics.

## The patterns this unlocks

The plugin's real value shows when tasks compose into operations DigitalOcean has no native answer for.

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

finally:
  - id: delete_droplet
    type: io.kestra.plugin.digitalocean.droplet.Delete
    apiToken: "{{ secret('DIGITALOCEAN_TOKEN') }}"
    dropletId: "{{ outputs.create_droplet.id }}"
```

### Business-hours database scaling

DigitalOcean has no scheduled resize. With Kestra, two schedules pass different size slugs into one flow that checks the cluster is healthy, submits the resize, and polls until the migration completes. Scale managed Postgres up before the workday and back down at night, and stop paying peak prices for idle capacity.

### Governance for shadow infrastructure

The droplet trigger fires minutes after anyone creates a droplet, however they created it. A naming-policy check powers off machines provisioned outside your process, reversibly, and posts their full identity to Slack for review.

### Fleet backups, DNS cutovers, and inventory

Tag-filtered nightly snapshots with dated names, verified blue-green DNS cutovers with duplicate cleanup, and a weekly parallel census of every resource type on the account posted to Slack. Each pattern ships as a blueprint you can copy today.

## Six production blueprints, tested end to end

Talk is cheap, so every pattern above ships as a ready-to-run blueprint in the [catalog](/blueprints):

1. [Ephemeral droplet runner with guaranteed teardown](/blueprints/digitalocean-ephemeral-droplet-runner)
2. [Business-hours resize for managed databases](/blueprints/digitalocean-database-business-hours-resize)
3. [Nightly droplet snapshot backups by tag](/blueprints/digitalocean-droplet-snapshot-backup)
4. [New droplet governance guard](/blueprints/digitalocean-new-droplet-governance-guard)
5. [Blue-green DNS cutover](/blueprints/digitalocean-dns-blue-green-cutover)
6. [Weekly account inventory report](/blueprints/digitalocean-account-inventory-report)

Each one was executed end to end against the DigitalOcean API surface before publication, including the failure paths: the teardown blueprint was verified by making the workload fail and confirming the droplet and firewall were still destroyed.

## What's next

The partnership keeps going from here. We are working toward one-click Kestra deployment through the DigitalOcean Marketplace, so spinning up an orchestrator on a droplet or a DOKS cluster becomes a single click. And since DigitalOcean Spaces is S3-compatible, it already works with Kestra's object storage tasks today; deeper coverage is on the roadmap.

## Get started

- Explore the [DigitalOcean orchestration guide](/orchestration/digitalocean)
- Browse the [DigitalOcean plugin documentation](/plugins/plugin-digitalocean)
- Copy a [blueprint](/blueprints) and run it against your account
- Visit our [partner page](/partners/digitalocean)

If you are running workloads on DigitalOcean and want to see what event-driven orchestration changes, [book a demo](/demo) or join the [Kestra community on Slack](/slack); we would love to hear what you build.
