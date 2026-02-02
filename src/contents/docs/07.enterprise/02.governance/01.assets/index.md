---
title: Assets in Kestra – Track Lineage and Metadata
description: Use Assets in Kestra Enterprise to track workflow lineage and metadata. Manage resources like tables, files, and datasets across your data stack.
sidebarTitle: Assets
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 1.2.0"
---

Track and manage the resources your workflows create and use.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/XhICXP_GXic?si=jUBFcCv7vqSqqvKn" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Track workflow assets and lineage

Assets keeps a live inventory of resources that your workflows interact with. These resources can be database tables, virtual machines, files, or any external system you work with.

You create assets in two ways: automatically through task execution or manually from the Assets UI. Once created, you can view asset details, check which workflow runs created or modified them, and see how assets connect to each other across your workflows.

This feature enables:

- Shipping metadata to lineage providers (e.g., OpenLineage).
- Populating dropdowns or Pebble inputs with live assets (e.g., available VMs).
- Monitoring assets and their state.

## Asset definition

Define assets directly on any task using the `assets` property. Each task can declare `inputs` assets (resources it reads) and `outputs` assets (resources it creates or modifies).

Every asset includes these fields:

| Field | Description |
| --- | --- |
| `id` | unique within a tenant |
| `namespace` | each asset can be associated with a namespace for filtering and RBAC management |
| `type` | use predefined Kestra types like `io.kestra.plugin.ee.assets.Table` or any custom string value |
| `displayName` | optional human-readable name |
| `description` | markdown-supported documentation |
| `metadata` | map of key-value for adding custom metadata to the given asset |



### Data Pipeline Use Cases

Assets are essential for tracking data lineage in analytics and data engineering workflows. The following examples demonstrate how to use assets for simple table creation and complex multi-layer data pipelines.

#### Example 1: Simple Table Creation

**Scenario**: You're creating a new database table from scratch. This is a foundational asset with no upstream dependencies.

```yaml
id: pipeline_with_assets
namespace: company.team

tasks:
  - id: create_trips_table
    type: io.kestra.plugin.jdbc.sqlite.Queries
    url: jdbc:sqlite:myfile.db
    outputDbFile: true
    sql: |
      CREATE TABLE IF NOT EXISTS trips (
          VendorID INTEGER,
          passenger_count INTEGER,
          trip_distance REAL
      );

      INSERT INTO trips (VendorID, passenger_count, trip_distance) VALUES
      (1, 1, 1.5),
      (1, 2, 2.3),
      (2, 1, 0.8),
      (2, 3, 3.1);
    assets:
      outputs:
        - id: trips
          namespace: "{{ flow.namespace }}"
          type: io.kestra.plugin.ee.assets.Table
          metadata:
            database: sqlite
            table: trips
```

**Key points**:
- There are no `inputs` assets as this is a source table with no dependencies
- The `trips` table is registered as an output asset that downstream workflows can reference
- Metadata captures the database type and table name for easier discovery

#### Example 2: Multi-Layer Data Pipeline

**Scenario**: You're building a modern data stack with staging and mart layers. The staging layer reads from an external source, and the mart layer creates aggregated analytics tables.

```yaml
id: data_pipeline_assets
namespace: kestra.company.data

tasks:
  - id: create_staging_layer_asset
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      CREATE TABLE IF NOT EXISTS trips AS
      select VendorID, passenger_count, trip_distance from sample_data.nyc.taxi limit 10;
    assets:
      inputs:
        - id: sample_data.nyc.taxi
      outputs:
          - id: trips
            namespace: "{{flow.namespace}}"
            type: io.kestra.plugin.ee.assets.Table
            metadata:
              model_layer: staging

  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values:
      - passenger_count
      - trip_distance
    tasks:
      - id: create_mart_layer_asset
        type: io.kestra.plugin.jdbc.duckdb.Query
        sql: SELECT AVG({{taskrun.value}}) AS avg_{{taskrun.value}} FROM trips;
        assets:
          inputs:
              - id: trips
          outputs:
              - id: avg_{{taskrun.value}}
                type: io.kestra.plugin.ee.assets.Table
                namespace: "{{flow.namespace}}"
                metadata:
                  model_layer: mart
pluginDefaults:
  - type: io.kestra.plugin.jdbc.duckdb
    values:
      url: "jdbc:duckdb:md:my_db?motherduck_token={{ secret('MOTHERDUCK_TOKEN') }}"
      fetchType: STORE
```

**What's happening in this pipeline**:

1. **External Source Tracking**: The `create_staging_layer_asset` task references `sample_data.nyc.taxi` as an input asset, even though it's managed outside this workflow. This establishes lineage to external data sources.

2. **Staging Layer**: The `trips` table is created and registered with `model_layer: staging` metadata. This becomes an intermediate asset that mart layers will consume.

3. **Dynamic Mart Creation**: The `ForEach` task generates two mart tables:
   - `avg_passenger_count`
   - `avg_trip_distance`

   Both declare `trips` as an input, creating a clear dependency chain.

4. **Complete Lineage Graph**: Kestra automatically builds the dependency graph.

**Benefits of this approach**:
- **Impact Analysis**: If `sample_data.nyc.taxi` changes, you can instantly see that it affects 3 downstream assets
- **Layer Organization**: Filter assets by `model_layer` to view only staging or mart tables
- **Dependency Tracking**: Know exactly which tables depend on others before making schema changes
- **Audit Trail**: Track which workflows created each table and when

Check out an interactive demo to see the Flow in action:

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/MXR1KD6by4izutxRMMNK?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Data Pipeline Assets | Kestra EE" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

---

### Infrastructure Use Case: Team Bucket Provisioning

Assets are particularly valuable for infrastructure management scenarios. This example demonstrates how a DevOps team can provision cloud resources and track their usage across different teams.

**Scenario**: Your DevOps team needs to create dedicated S3 buckets for multiple teams (Business, Data, Finance, Product). By registering these buckets as assets during provisioning, you establish a clear lineage of which workflows and executions interact with each infrastructure component.


The following flow creates S3 buckets for selected teams and registers them as assets:

```yaml
id: infra_assets
namespace: kestra.company.infra

inputs:
  - id: teams
    type: MULTISELECT
    values:
      - Business
      - Data
      - Finance
      - Product

tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ inputs.teams }}"
    tasks:
      - id: create_bucket
        type: io.kestra.plugin.aws.cli.AwsCLI
        commands:
          - aws s3 mb s3://kestra-{{ taskrun.value | slugify }}-bucket
        assets:
          outputs:
            - id: kestra-{{ taskrun.value | slugify }}-bucket
              type: AWS_BUCKET
              metadata:
                provider: s3
                address: s3://kestra-{{ taskrun.value | slugify }}-bucket

pluginDefaults:
  - type: io.kestra.plugin.aws
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
      secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
      region: "{{ secret('AWS_REGION') }}"
      allowFailure: true
```

This flow dynamically creates buckets (e.g., `kestra-data-bucket`, `kestra-finance-bucket`) and registers each as an `AWS_BUCKET` asset with relevant metadata.


Once the infrastructure is provisioned, teams can reference these assets in their workflows. Here's how the Data team uses their bucket:

```yaml
id: upload_file
namespace: kestra.company.data

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/jaffle-csv/raw_customers.csv

  - id: aws_upload
    type: io.kestra.plugin.aws.s3.Upload
    bucket: kestra-data-bucket
    from: '{{ outputs.download.uri }}'
    key: raw_customer.csv
    assets:
      inputs:
        - id: kestra-data-bucket
      outputs:
        - id: raw_customer
          type: io.kestra.plugin.ee.assets.File
          metadata:
            owner: data

pluginDefaults:
  - type: io.kestra.plugin.aws
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
      secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
      region: "{{ secret('AWS_REGION') }}"
```

In this workflow:
- The `aws_upload` task declares `kestra-data-bucket` as an **input asset**, linking it to the infrastructure provisioned earlier
- It also creates an **output asset** (`raw_customer`) representing the uploaded file
- This establishes a complete lineage chain: infrastructure creation → data upload → file asset

**Benefits**: With this approach, you can easily answer questions like:
- Which teams are using which buckets?
- What files have been uploaded to each bucket?
- Which workflows and executions have interacted with a specific infrastructure component?
- When was this infrastructure resource created and by which flow?


## Asset Identifier

An asset is uniquely identified by its `id` and the tenant (`tenantId`) where you create it. You can attach a namespace to an asset to improve filtering, and to restrict visibility so only users or groups with the appropriate RBAC can access the asset.

## Asset Type

Asset types fall into two categories:

- **Kestra-defined asset types**: These predefined types use the `io.kestra.core.models.assets` model and provide structured metadata fields specific to each asset type. In future iterations of the Assets feature, Kestra plugins will allow to automatically generate assets with these types and populate their metadata fields during task execution. For example, a database plugin could automatically create a `Table` asset with the system, database, and schema fields filled in based on the connection details.

The current Kestra-defined asset types are the following:

- `io.kestra.plugin.ee.assets.Dataset`
  - Represents a dataset asset managed by Kestra.
  - Metadata: `system`, `location`, `format`

- `io.kestra.plugin.ee.assets.File`
  - Represents a file asset, such as documents, logs, or other file-based outputs.
  - Metadata: `system`, `path`

- `io.kestra.plugin.ee.assets.Table`
  - Represents a database table asset with schema and data location metadata.
  - Metadata: `system`, `database`, `schema`

- `io.kestra.plugin.ee.assets.VM`
  - Represents a virtual machine asset, including attributes like IP address and provider.
  - Metadata: `provider`, `region`, `state`

- `io.kestra.core.models.assets.External`
  - Represents an external asset that exists outside of Kestra's managed resources.
  - This type is automatically assigned when you reference an asset in `assets.inputs` that doesn't already exist in Kestra. You don't need to explicitly set the type — Kestra will create the asset with the `External` type automatically.
  - This is useful for tracking dependencies on resources managed outside your workflows, such as external database tables, third-party APIs, or manually provisioned infrastructure.


- **Free-form asset types**: You can define asset types using any custom string value to represent asset categories that fit your organization's needs. This lets you create and manage your own asset taxonomies, giving you flexibility to describe resources that are not covered by Kestra's standard models. These assets require manual definition and will not be auto-generated by plugins.



## Populate dropdowns and app inputs

The `assets()` Pebble function allows you to query and retrieve assets dynamically in your workflows. This is particularly useful for populating dropdown inputs or dynamically selecting resources based on filters.

### Function signature

```
assets(type: string, namespace: string, metadata: map)
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | No | Filter assets by type (e.g., `"io.kestra.core.models.assets.Table"`). If omitted, returns all assets. |
| `namespace` | string | No | Filter assets by namespace. |
| `metadata` | map | No | Filter assets by metadata key-value pairs (e.g., `{"key": "value"}`). |


### Return value

Returns an array of asset objects. Each asset object contains the following properties:
- `tenantId` - The tenant ID where the asset is created
- `namespace` - The namespace the asset belongs to
- `id` - The asset identifier
- `type` - The asset type
- `metadata` - Map of custom metadata key-value pairs
- `created` - ISO 8601 timestamp when the asset was created
- `updated` - ISO 8601 timestamp when the asset was last updated
- `deleted` - Boolean indicating if the asset has been deleted


### Examples

**Populate a multiselect dropdown with table assets:**

```yaml
id: select_assets
namespace: company.team

inputs:
  - id: assets
    type: MULTISELECT
    expression: '{{ assets(type="io.kestra.core.models.assets.Table") | jq(".[].id") }}'

tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{inputs.assets}}"
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "{{taskrun.value}}"
```

**Filter assets by namespace:**

```yaml
inputs:
  - id: staging_tables
    type: MULTISELECT
    expression: '{{ assets(type="io.kestra.core.models.assets.Table", namespace="company.team") | jq(".[].id") }}'
```

**Filter assets by metadata:**

```yaml
inputs:
  - id: mart_tables
    type: MULTISELECT
    expression: '{{ assets(metadata={"model_layer": "mart"}) | jq(".[].id") }}'
```

**Get all assets and extract metadata:**

```yaml
id: list_assets_metadata
namespace: company.team
tasks:
  - id: list_all_assets
    type: io.kestra.plugin.core.log.Log
    message: "{{ assets() | jq('.[] | {id: .id, type: .type, metadata: .metadata}') }}"
```

## Export assets with AssetShipper

The `AssetShipper` task allows you to export asset metadata to external systems for lineage tracking, monitoring, or integration with data catalogs. You can ship assets to files or to lineage providers like OpenLineage.

### Export assets to file

Export asset metadata to a file in either ION or JSON format. This is useful for archiving, auditing, or importing into other systems.

```yaml
id: ship_asset_to_file
namespace: kestra.company.data

tasks:
  - id: export_assets
    type: io.kestra.plugin.ee.assets.AssetShipper
    assetExporters:
      - id: file_exporter
        type: io.kestra.plugin.ee.assets.FileAssetExporter
        format: ION
```

You can change the `format` property to `JSON` if you prefer a more widely-compatible format.

### Export assets to OpenLineage

Ship asset metadata to an OpenLineage-compatible lineage provider. This requires mapping Kestra asset fields to OpenLineage conventions.

```yaml
id: ship_asset_to_openlineage
namespace: kestra.company.data

tasks:
  - id: export_to_lineage
    type: io.kestra.plugin.ee.assets.AssetShipper
    assetExporters:
      - id: openlineage_exporter
        type: io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter
        uri: http://host.docker.internal:5000
        mappings:
          io.kestra.plugin.ee.assets.Table:
            namespace: namespace
```

The `mappings` property defines how Kestra asset metadata fields map to OpenLineage dataset facets. Each asset type can have its own mapping configuration. For more information about OpenLineage dataset facets and available fields, see the [OpenLineage Dataset Facets documentation](https://openlineage.io/docs/spec/facets/dataset-facets/).
