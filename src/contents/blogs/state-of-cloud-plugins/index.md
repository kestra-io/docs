---
title: "State of Cloud Plugins in Kestra"
description: "Kestra's cloud catalog used to mean three providers. In 2026 it stopped meaning that. Where every cloud plugin stands today, how deep each one goes into the orchestrator itself, and what is still missing."
date: 2026-09-06T10:00:00
category: Solutions
authors:
  - name: "Jérémy Maire"
    linkedin: https://www.linkedin.com/in/jeremymaire/
    image: jmaire
    role: Plugins and Ecosystem Engineer
image: ./main.jpg
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "Which cloud providers does Kestra support?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Kestra ships plugins for Google Cloud (plugin-gcp), AWS (plugin-aws), Azure (plugin-azure), Huawei Cloud (plugin-huawei), DigitalOcean (plugin-digitalocean), Cloudflare (plugin-cloudflare), and Clever Cloud (plugin-clevercloud). Google Cloud, AWS, Azure, and Huawei Cloud also have Enterprise Edition counterparts adding task runners and log exporters."
    - "@type": "Question"
      name: "What is the difference between a cloud plugin and a task runner in Kestra?"
      acceptedAnswer:
        "@type": "Answer"
        text: "A cloud plugin's tasks call the provider's services from inside a flow, for example running a BigQuery query. A task runner works in the opposite direction: it takes your script and runs it on the provider's compute, such as AWS Batch, Azure Batch, Google Cloud Run, or Huawei CCI. Task runners for cloud providers are available in the Enterprise Edition."
    - "@type": "Question"
      name: "Can Kestra store its internal data on a cloud provider?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Yes. Kestra's internal storage backend can be Amazon S3, Google Cloud Storage, Azure Blob Storage, Huawei OBS, Cloudflare R2, MinIO, or SeaweedFS. In the Enterprise Edition, secrets can also be read from AWS Secrets Manager, Azure Key Vault, or Google Secret Manager."
    - "@type": "Question"
      name: "Does Kestra have a Scaleway, OVHcloud, or Oracle Cloud plugin?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Not yet. All three are tracked as open issues: a Scaleway plugin covering Object Storage, Compute Instances, Serverless, Managed Databases, networking, Queues and Topics, Kubernetes Kapsule, and Generative APIs; an OVHcloud compute plugin covering Public Cloud instances, bare metal servers, and Managed Kubernetes; and an Oracle Cloud Infrastructure plugin suite."
---

For most of Kestra's life, "cloud plugin" meant one of three things. [`plugin-gcp`](/plugins/plugin-gcp) landed in January 2020, [`plugin-aws`](/plugins/plugin-aws) five months later, [`plugin-azure`](/plugins/plugin-azure) in 2022. Then nothing else for a long time.

That changed this year. Since February the catalog has picked up Cloudflare, Huawei Cloud, Clever Cloud, and DigitalOcean, which is more new cloud providers in seven months than in the previous six years combined. Two things drove it: our user base stopped being predominantly American, and sovereignty requirements went from a procurement checkbox to a hard constraint on where workloads can run.

This is a status report on all of it. What ships today, how deep each plugin goes, and where the gaps still are.

## What a cloud plugin actually plugs into

Worth settling first, because it is the part people underestimate. A cloud plugin in Kestra can hook into four separate layers of the orchestrator, and how many of those it covers tells you far more about its maturity than its task count does.

| Layer | What it does | Example |
|-------|--------------|---------|
| Tasks and triggers | Call the provider's services from inside a flow | `io.kestra.plugin.gcp.bigquery.Query` |
| Task runner (EE) | Run *your* script on the provider's compute | AWS Batch, Azure Batch, Cloud Run, Huawei CCI |
| Internal storage | Kestra's own object store lives on the provider | `storage-s3`, `storage-gcs`, `storage-obs` |
| Secret manager (EE) | Kestra reads secrets from the provider's vault | AWS Secrets Manager, Azure Key Vault |

The first layer is the obvious one. The other three are what make a plugin feel like Kestra running natively on a provider rather than an API wrapper pointed at it. Task runners in particular reverse the direction of the relationship: your flow stops reaching out to the cloud, and the cloud starts running your workload and reporting back.

Every section below is really answering the same question, which is how far up that stack a given provider goes.

## The big three

No surprises. Google Cloud, AWS, and Azure are the only providers covering all four layers, and the numbers reflect it.

| Plugin | Tasks | Triggers | Task runners (EE) | Storage | Secrets (EE) |
|--------|-------|----------|-------------------|---------|--------------|
| [`plugin-gcp`](/plugins/plugin-gcp) | 74 | 8 | 3 | GCS | Google Secret Manager |
| [`plugin-aws`](/plugins/plugin-aws) | 61 | 8 | 2 | S3 | AWS Secrets Manager |
| [`plugin-azure`](/plugins/plugin-azure) | 58 | 10 | 2 | Blob Storage | Azure Key Vault |

The task runners deserve a closer look, because each provider converged on the same pair: one container-based runner, and one that runs directly on a machine.

On AWS that is `Batch` (backed by ECS on Fargate or EC2, or by EKS) and `Ec2`, which launches an instance and drives it through Systems Manager Run Command. Commands run natively on the instance, with no container and no inbound SSH, which is the only way to run commercial software whose license binds to a specific AMI (Amazon Machine Image) or instance identity. Azure mirrors the pair with `Batch` and `VirtualMachine`, the latter going through the Azure Run Command API, so the VM needs no public IP and no inbound rules at all.

Google Cloud gets three, because Google has three plausible answers to "where should this container run": `Batch`, `CloudRun`, and `ComputeEngine`.

The Cloud Run runner carries the most instructive piece of hard-won detail in the catalog. Cloud Run logs come back through Cloud Logging, whose read API is capped at 60 requests per minute per project, and Google does not raise that quota. In practice you get a handful of concurrent Cloud Run tasks before log lines, and therefore task outputs, start going missing without any error to explain it. So the runner grew a `useBucketForLog` option that writes stdout and stderr into the staging GCS bucket instead, since Cloud Storage meters reads per bucket rather than per project. Nobody designs that in up front. It is the sort of thing six years of production use buys you.

## The 2026 arrivals

### Huawei Cloud

[`plugin-huawei`](/plugins/plugin-huawei) shipped in May and is by some distance the most complete newcomer: 37 tasks, 8 triggers, an EE counterpart with a task runner and a log exporter, and `storage-obs` as an internal storage backend. Three of the four layers inside four months.

It was deliberately built as a service-by-service mirror of the AWS plugin, and almost every task names its AWS counterpart in its own documentation.

| Huawei service | Kestra tasks | AWS equivalent |
|----------------|--------------|----------------|
| OBS | `Upload`, `Download`, `List`, `Copy`, `DeleteList` | S3 |
| DIS | `PutRecords`, `Consume`, `RealtimeTrigger` | Kinesis |
| DLI | `Query` | Athena |
| FunctionGraph | `Invoke` | Lambda |
| SMN | `Publish` | SNS |
| EventGrid | `PutEvents` | EventBridge |
| MRS | `CreateClusterAndSubmitJob`, `SubmitJob` | EMR |
| SWR | `GetAuthToken` | ECR |
| RFS | `Create`, `Delete` | CloudFormation |
| GeminiDB | `GetItem`, `PutItem`, `Query`, `Scan` | DynamoDB |

If you already run AWS flows, porting them is mostly swapping `type:` lines. For anything without a dedicated task there is `koocli.KooCLI`, which runs `hcloud` commands in a container with credentials injected from the plugin's connection properties, including on the EU sovereign region `eu-west-101`.


### DigitalOcean

[`plugin-digitalocean`](/plugins/plugin-digitalocean) arrived in July with 39 tasks, following the [DigitalOcean partnership](/blogs/digitalocean-partnership). Coverage tracks what people actually run there: `droplet`, `volume`, `database`, `kubernetes`, `loadbalancer`, `firewall`, and `domain`.

It is a provisioning and lifecycle plugin far more than a data plugin. Plenty of teams are spinning droplets up and down on a schedule and would rather do it next to everything else they orchestrate.

### Cloudflare

[`plugin-cloudflare`](/plugins/plugin-cloudflare) is the odd one in the set, and the more interesting for it: 29 tasks across `zones`, `dns`, `cache`, `waf`, `workers`, `d1`, `compute`, and `models`, plus `storage-cloudflare` for putting Kestra's internal storage on R2.

Cloudflare is not an IaaS and the plugin does not pretend otherwise. Purging a cache, updating a WAF rule, querying D1, deploying a Worker: these are edge operations, and in practice they show up as the last step of a deployment pipeline rather than the first step of a data pipeline. The `models` package covering Workers AI is the part I would watch, since inference at the edge is one of the few genuinely new shapes in this area.

## Sovereignty, and the European question

We get asked about this constantly now.

What ships today is [`plugin-clevercloud`](/plugins/plugin-clevercloud), added in May: 29 tasks and 4 triggers against the French PaaS. The plugin's shape follows the platform's shape, so instead of buckets and queues you get `applications` (create, scale, redeploy, restart, stop, environment variables), `addons` (provision a managed database, link it to an app, read back its connection credentials), `deployments` (including a `WaitForState` that polls until a deploy lands on `OK`, `FAIL`, or `CANCELLED`), `logs` (fetch a historical window, stream live, manage drains), and `organisations` for membership.

The triggers are the part worth building on. `deployments.Trigger` fires when a deploy reaches a target state and deliberately ignores `UNDEPLOY` records, so scaling events do not masquerade as releases. `logs.LogPatternTrigger` fires on a regex match in application logs and returns every matching line from that poll rather than only the first, which matters when an incident produces a burst rather than a single line. Between them you can run a deploy-and-verify loop on a European platform without your telemetry leaving it.


## What is next

Three cloud providers are tracked as open issues today, and two of them are European.

[`kestra-io/plugin-scaleway#2`](https://github.com/kestra-io/plugin-scaleway/issues/2) is planned to cover Object Storage (S3-compatible), Compute Instances, Serverless Functions and Containers, Managed Databases, VPC and networking, Queues and Topics (SQS and SNS-compatible), Kubernetes Kapsule, and Generative APIs.

[`kestra-ee#7957`](https://github.com/kestra-io/kestra-ee/issues/7957) covers OVHcloud compute: Public Cloud instances, bare metal servers, and Managed Kubernetes.

[`kestra-ee#7942`](https://github.com/kestra-io/kestra-ee/issues/7942) scopes a full Oracle Cloud Infrastructure suite. OCI comes up most often from teams already running Oracle databases who want the surrounding infrastructure orchestrated from the same place.

If your provider is on none of those lists, the fastest way to change that is open [an issue on GitHub](https://github.com/kestra-io/kestra/issues/new/choose) or contact us via our Slack.

:::alert{type="info"}
Every plugin mentioned here is browsable on the [Plugins page](https://kestra.io/plugins?category=CLOUD) under the CLOUD category, with the full task list and property reference for each.
:::


