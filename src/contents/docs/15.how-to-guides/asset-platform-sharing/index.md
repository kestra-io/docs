---
title: Share Platform Resources Across Teams with Kestra Assets
h1: Share Platform Resources Across Teams
description: Publish shared infrastructure as Kestra assets in a platform namespace, let other teams reference and select them, and control which flows can change them.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Kestra Concepts
  - DevOps
---

Publish the resources a platform team owns as assets, so other teams can find them, build on them, and show up in their lineage without being able to change them.

When a platform team provisions shared buckets, databases, or clusters, other teams usually learn about them from a wiki page or a chat message. They then hardcode names in their flows, and nobody can tell which teams depend on which resource. If the platform team registers each resource as an asset, consuming flows pick resources from a live list and declare them as inputs, so the dependencies graph shows every team that uses a resource.

## Prerequisites

- A Kestra Enterprise Edition or Cloud instance.
- Two namespaces: `company.platform` for the platform team and `company.marketing` for a consuming team.
- Permission to edit the `company.platform` namespace, to set its allowed namespaces.

## Choose namespaced or Global assets

Decide first where the shared assets live. The choice changes who can see them and which flows can change them:

| | Namespaced in `company.platform` | Global (no namespace) |
| --- | --- | --- |
| Who sees them in the UI | Users with `ASSET` permissions on `company.platform` | Every user with an `ASSET` permission in the tenant |
| Which flows can write them | Flows whose namespace `company.platform` allows | Any flow in the tenant |
| Best for | Resources that one team owns and wants to protect | Catalog entries that every team must see, such as a shared warehouse |

This guide uses namespaced assets so the platform team keeps control over writes. To create Global assets instead, omit `namespace` on the outputs in the next step. See [Namespace and Global assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#namespace-and-global-assets).

## Register the shared resources

This flow in `company.platform` registers two S3 buckets. Replace the log task with the task that provisions the bucket, and keep the `assets` block:

```yaml
id: register_shared_buckets
namespace: company.platform

tasks:
  - id: for_each_bucket
    type: io.kestra.plugin.core.flow.Loop
    values:
      - marketing-exports
      - finance-exports
    tasks:
      - id: register_bucket
        type: io.kestra.plugin.core.log.Log
        message: "Provisioned s3://acme-{{ item.value }}"
        assets:
          outputs:
            - id: "s3.acme-{{ item.value }}"
              namespace: company.platform
              type: company.platform.S3Bucket
              displayName: "acme-{{ item.value }}"
              metadata:
                provider: aws
                region: eu-west-1
                path: "s3://acme-{{ item.value }}"
                provided_by: platform
```

Notice the conventions that let other teams find and reuse the assets:

- The IDs follow one pattern, `s3.<bucket name>`, so consumers can predict them.
- The custom type `company.platform.S3Bucket` names the kind of resource. Consumers filter on it.
- `provided_by: platform` marks every asset the platform team publishes, whatever its type.

## Reference the resources from a consuming team

This flow in `company.marketing` lets the user pick a platform bucket, then exports campaign results to it:

```yaml
id: export_campaign_results
namespace: company.marketing

inputs:
  - id: bucket
    type: SELECT
    expression: '{{ assets(type="company.platform.S3Bucket", metadata={"provided_by": "platform"}) | jq(".[].id") }}'

tasks:
  - id: export
    type: io.kestra.plugin.core.log.Log
    message: "Exporting campaign results to {{ inputs.bucket }}"
    assets:
      inputs:
        - id: "{{ inputs.bucket }}"
      outputs:
        - id: marketing.campaign_results_export
          namespace: company.marketing
          type: io.kestra.plugin.ee.assets.File
          metadata:
            bucket: "{{ inputs.bucket }}"
```

Notice these choices:

- The `bucket` input lists the platform buckets at execution time, so nobody types a bucket name by hand. A bucket the platform team registers later appears in the list without a change to this flow.
- The `assets()` call filters on the type and the `provided_by` metadata key instead of a `namespace` argument. See the [assets() reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#assets-pebble-function).
- The bucket is declared as an input with only its `id`. Referencing an asset as an input records lineage and usage without changing the asset.

:::alert{type="warning"}
Don't add a `type` to an input that references a shared asset. A typed input changes the stored asset's type when the two differ, which rewrites the platform team's asset.
:::

## Protect the resources from writes by other teams

By default, every namespace allows every other namespace, so a flow in `company.marketing` can also declare `s3.acme-marketing-exports` as an output and change its metadata.

To stop that, restrict the namespaces that can access `company.platform`:

1. Open the `company.platform` namespace and go to the **Edit** tab.
2. Under allowed namespaces, select only `company.platform`.
3. Save.

Flows outside `company.platform` can no longer write the platform's assets. If a consuming flow declares one as an output, Kestra rejects the write and the task ends in `WARNING`, or in `FAILED` if the task sets `assetFailureBehavior: FAIL`. Input references keep working.

To let one team write the platform's assets on purpose, add its namespace to the allowed list. Allowed namespaces also control access to the namespace's flows and other resources, so the team gets that access too. See [Allowed namespaces](../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces) and [Cross-namespace writes](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#cross-namespace-writes).

Global assets have no namespace, so this check doesn't apply to them. Any flow in the tenant can write a Global asset.

## Verify the result

- The **Assets** list shows `s3.acme-marketing-exports` and `s3.acme-finance-exports` in `company.platform`, with the `company.platform.S3Bucket` type.
- When you run `export_campaign_results`, the `bucket` input offers both buckets.
- After a run, the bucket's **Dependencies** tab shows `export_campaign_results` reading it and writing `marketing.campaign_results_export`. Its **Executions** tab lists the run.

## Next steps

- [Asset declaration reference](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md)
- [Asset best practices](../../14.best-practices/13.assets/index.md) for ID and metadata conventions across teams
- [Manage assets in the UI, API, and CLI](../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md)
