---
title: "kestractl: Kestra CLI for Flows, IAM, and Plugins"
h1: Manage Kestra Flows, IAM, and Plugins with kestractl
sidebarTitle: kestractl
icon: /src/contents/docs/icons/bash.svg
editions: ["OSS","EE"]
description: Manage Kestra flows, executions, namespaces, plugins, and IAM resources from the command line without a UI.
---

Use `kestractl` to manage flows, executions, triggers, namespaces, namespace files, key-value pairs, plugins, IAM resources, dashboards, apps, assets, blueprints, test suites, execution logs, secrets, and server administration. Most commands interact with the Kestra host API; `workers registration-tokens generate` runs entirely offline.

For server components and system maintenance commands (starting standalone servers, server-side plugin installation), see the [Kestra Server CLI](../kestra-server/index.md).

## Installation

Source code and releases are available at [github.com/kestra-io/kestractl](https://github.com/kestra-io/kestractl).

```bash
curl -fsSL https://raw.githubusercontent.com/kestra-io/kestractl/main/install-scripts/install.sh | bash
```

## Quick Setup

### Open Source (basic auth)

```bash
kestractl config add default http://localhost:8080 main --username YOUR_USERNAME --password YOUR_PASSWORD --default
```

### Enterprise (API token)

```bash
kestractl config add default https://kestra.example.com production --token YOUR_TOKEN --default
```

Your configuration is saved at `~/.kestractl/config.yaml` and the default context is used automatically.

```yaml
contexts:
  default:
    host: https://kestra.example.com
    tenant: production
    auth_method: token
    token: YOUR_TOKEN
default_context: default
```

For basic auth contexts, `auth_method` is `basicAuth` and the file stores `username` and `password` instead of a token.

## Usage

### Examples

```bash
# Deploy flows, then run one and wait for completion
kestractl flows deploy ./flows --namespace prod --override --fail-fast
kestractl executions run prod nightly-refresh --wait --output json
```

```bash
# Sync namespace files for a release
kestractl nsfiles upload prod ./assets --path resources --override --fail-fast
```

```bash
# List flows as JSON
kestractl flows list my.namespace --output json
```

### Command groups

- `config`: manage authentication contexts.
- `flows`: list, get, deploy, validate, enable, disable, delete, export, import, and sync flows.
- `executions`: run, inspect, control, and bulk-manage executions.
- `triggers`: list, enable, disable, unlock, delete, manage backfills, and export triggers.
- `namespaces`: list, get, create, update, delete namespaces and manage their plugin defaults.
- `nsfiles`: list, get, upload, and delete namespace files.
- `kv`: list, set (with optional TTL), update, get, and delete key-value pairs. Note: `kv list` requires token auth and returns 401 with basic auth.
- `dashboards`: list, get, create, update, and delete dashboards. Requires Kestra EE.
- `apps`: list, get, deploy, update, and delete apps. Requires Kestra EE.
- `assets`: list, get, create, and delete assets. Requires Kestra EE.
- `blueprints`: search and retrieve community blueprints; manage internal flow blueprints (EE).
- `test-suites`: create, run, validate, and manage test suites and their results. Requires Kestra EE.
- `users`: list, get, create, update, delete, set group membership, set passwords, and manage API tokens for users. Requires Kestra EE; operates at the instance level (not tenant-scoped).
- `groups`: list, get, create, update, delete groups and manage their members. Requires Kestra EE; tenant-scoped.
- `roles`: list, get, create, update, and delete roles with resource-level permissions. Requires Kestra EE; tenant-scoped.
- `service-accounts` (aliases: `service-account`, `sa`): list, get, create, update, delete service accounts and manage their API tokens. Requires Kestra EE; instance-level (not tenant-scoped).
- `bindings`: list, get, create (including bulk), and delete role bindings. Requires Kestra EE; tenant-scoped.
- `invitations`: list, get, create, and delete user invitations. Requires Kestra EE; tenant-scoped.
- `logs`: list, search, download, and delete execution logs.
- `secrets`: list, set, patch, and delete secrets. Requires Kestra EE.
- `server`: view license info, list server actions, and generate statistics reports. `server license` requires Kestra EE.
- `plugins`: list compatible plugins for a Kestra version and download them to a local directory.
- `workers`: manage worker registration tokens.

Use `kestractl --help` or `kestractl <command> --help` for the full command reference.

## Flow management

```bash
# List flows (all namespaces, or filter by namespace)
kestractl flows list
kestractl flows list my.namespace --output json

# List flows in a namespace with pagination
kestractl flows list-by-namespace my.namespace --page 1 --size 50

# List deprecated flows
kestractl flows list-deprecated

# Search flows across all namespaces (paginated; no query filter)
kestractl flows search
kestractl flows search --page 1 --size 50

# List distinct namespaces that have flows
kestractl flows namespaces

# Get a flow's YAML source (aliases: show, describe)
kestractl flows get my.namespace my-flow

# Get a specific task definition within a flow
kestractl flows task my.namespace my-flow my-task-id

# Deploy flows
kestractl flows deploy path/to/flow.yaml
kestractl flows deploy ./flows/ --namespace prod --override --fail-fast

# Import flows from a ZIP archive
kestractl flows import flows.zip

# Validate a flow or directory
kestractl flows validate path/to/flow.yaml
kestractl flows validate ./flows/

# Validate a task or trigger definition from a YAML file
kestractl flows validate-task    --file task.yaml
kestractl flows validate-trigger --file trigger.yaml

# Enable / disable / delete a flow
kestractl flows enable  my.namespace my-flow
kestractl flows disable my.namespace my-flow
kestractl flows delete  my.namespace my-flow

# Bulk operations by query
kestractl flows enable-by-query  --namespace my.namespace
kestractl flows disable-by-query --namespace my.namespace
kestractl flows delete-by-query  --namespace my.namespace --query old-

# Search flows by source content
kestractl flows search-by-source --query "http.request"

# Bulk-update flows from a YAML file
kestractl flows bulk-update --file flows.yaml

# Export flows
kestractl flows export            --namespace my.namespace --output-file flows.zip
kestractl flows export-by-ids     my.namespace/flow-a my.namespace/flow-b --output-file export.zip
kestractl flows export-by-query   --namespace my.namespace --output-file export.zip

# Sync an entire namespace from a YAML file (deletes flows absent from the file)
kestractl flows namespace-sync my.namespace flows.yaml --delete --override

# Manage flow revisions
kestractl flows revisions        my.namespace my-flow
kestractl flows delete-revisions my.namespace my-flow --revisions 5

# Manage concurrency limits
kestractl flows concurrency-limits
kestractl flows update-concurrency my.namespace my-flow --running 10

# Generate a graph topology from a flow source file (without deploying)
kestractl flows generate-graph-from-source --file flow.yaml

# Show the graph topology of an existing deployed flow
kestractl flows graph my.namespace my-flow
kestractl flows graph my.namespace my-flow --revision 3 --output json
kestractl flows graph my.namespace my-flow --subflow task-a --subflow task-b

# List available Pebble expressions for a flow YAML file
kestractl flows expressions --file my-flow.yaml
kestractl flows expressions --file my-flow.yaml --task-id my-task

# Show namespace-level or flow-level dependency trees
kestractl flows namespace-dependencies my.namespace
kestractl flows dependencies           my.namespace my-flow
```

## Execution management

```bash
# Run a flow and optionally wait for completion
kestractl executions run my.namespace my-flow
kestractl executions run my.namespace my-flow --wait --output json

# List executions
kestractl executions list --namespace my.namespace --flow my-flow

# Get execution details (aliases: show, describe)
kestractl executions get 2TLGqHrXC9k8BczKJe5djX

# Get the latest execution per flow
kestractl executions latest --flow my.namespace:my-flow --flow my.namespace:other-flow

# Watch an execution in real time (alias: follow) — exits non-zero on FAILED, KILLED, or CANCELLED
kestractl executions watch 2TLGqHrXC9k8BczKJe5djX

# Control execution state
kestractl executions kill      2TLGqHrXC9k8BczKJe5djX
kestractl executions pause     2TLGqHrXC9k8BczKJe5djX
kestractl executions resume    2TLGqHrXC9k8BczKJe5djX
kestractl executions restart   2TLGqHrXC9k8BczKJe5djX
kestractl executions force-run 2TLGqHrXC9k8BczKJe5djX
kestractl executions unqueue   2TLGqHrXC9k8BczKJe5djX

# Replay an execution
kestractl executions replay             2TLGqHrXC9k8BczKJe5djX

# Replay from a specific task run (optionally targeting a revision or setting breakpoints)
kestractl executions replay-with-inputs 2TLGqHrXC9k8BczKJe5djX --task-run-id <taskRunId>
kestractl executions replay-with-inputs 2TLGqHrXC9k8BczKJe5djX --revision 3

# Bulk operations by IDs (positional execution IDs)
kestractl executions kill-bulk        id1 id2 id3
kestractl executions pause-bulk       id1 id2 id3
kestractl executions resume-bulk      id1 id2 id3
kestractl executions restart-bulk     id1 id2 id3
kestractl executions replay-bulk      id1 id2 id3
kestractl executions force-run-bulk   id1 id2 id3
kestractl executions delete-bulk      id1 id2 id3
kestractl executions unqueue-bulk     id1 id2 id3
kestractl executions set-labels-bulk  env=prod --ids id1 --ids id2
kestractl executions change-status-by-ids --status SUCCESS id1 id2

# Bulk operations by query
kestractl executions kill-by-query      --namespace my.namespace --flow my-flow
kestractl executions pause-by-query     --namespace my.namespace
kestractl executions resume-by-query    --namespace my.namespace
kestractl executions restart-by-query   --namespace my.namespace
kestractl executions replay-by-query    --namespace my.namespace --latest-revision
kestractl executions force-run-by-query --namespace my.namespace
kestractl executions delete-by-query    --namespace my.namespace --delete-logs --delete-storage
kestractl executions unqueue-by-query   --namespace my.namespace
kestractl executions set-labels-by-query env=prod --namespace my.namespace

# Filter bulk operations by field (FIELD:OPERATION:VALUE)
kestractl executions kill-by-query --filter STATE:EQUALS:RUNNING

# Labels
kestractl executions set-labels 2TLGqHrXC9k8BczKJe5djX env=prod team=platform

# Trigger an execution via webhook (--method GET|POST|PUT; --path appends a URL suffix)
kestractl executions trigger-webhook my.namespace my-flow my-webhook-key
kestractl executions trigger-webhook my.namespace my-flow my-webhook-key --method POST
kestractl executions trigger-webhook my.namespace my-flow my-webhook-key --method PUT --path extra/segment

# Graph and flow info
kestractl executions flow-graph      2TLGqHrXC9k8BczKJe5djX
kestractl executions flow-info       my.namespace my-flow
kestractl executions flow-info-by-id 2TLGqHrXC9k8BczKJe5djX

# Download output files
kestractl executions download-file  2TLGqHrXC9k8BczKJe5djX --path outputs/result.csv
kestractl executions file-metadata  2TLGqHrXC9k8BczKJe5djX --path outputs/result.csv

# Evaluate a Pebble expression against an execution
kestractl executions eval-expression 2TLGqHrXC9k8BczKJe5djX "{{ outputs.myTask.value }}"

# Force-change execution or task run status
kestractl executions change-status   2TLGqHrXC9k8BczKJe5djX SUCCESS
kestractl executions update-taskrun  2TLGqHrXC9k8BczKJe5djX <taskRunId> SUCCESS

# Search executions for a specific flow
kestractl executions search-by-flow --namespace my.namespace --flow-id my-flow

# Bulk status change by query
kestractl executions update-status-by-query --namespace my.namespace --new-status KILLED

# Delete an execution
kestractl executions delete 2TLGqHrXC9k8BczKJe5djX
```

## Execution logs

```bash
# List log entries for an execution
kestractl logs list <execution_id>
kestractl logs list <execution_id> --min-level WARNING --task-id my-task

# Search logs across all executions
kestractl logs search --namespace my.namespace --flow-id my-flow --min-level ERROR
kestractl logs search --query "timeout" --page 1 --size 50

# Download logs for an execution to a file
kestractl logs download <execution_id> --output-file execution.log
kestractl logs download <execution_id> --task-id my-task --output-file task.log

# Delete logs for an execution or all logs for a flow
kestractl logs delete          <execution_id>
kestractl logs delete-flow     my.namespace my-flow
kestractl logs delete-flow     my.namespace my-flow --trigger-id my-trigger
```

## Trigger management

```bash
# List all triggers
kestractl triggers list

# List triggers for a specific flow
kestractl triggers search-for-flow my.namespace my-flow

# Enable / disable / unlock a trigger
kestractl triggers enable  my.namespace my-flow my-trigger
kestractl triggers disable my.namespace my-flow my-trigger
kestractl triggers unlock  my.namespace my-flow my-trigger

# Restart or update a trigger
kestractl triggers restart my.namespace my-flow my-trigger
kestractl triggers update  my.namespace my-flow my-trigger --disabled

# Delete a trigger
kestractl triggers delete my.namespace my-flow my-trigger

# Bulk operations by IDs (format: namespace/flowId/triggerId)
kestractl triggers delete-by-ids  my.ns/my-flow/sched my.ns/my-flow/webhook
kestractl triggers unlock-by-ids  my.ns/my-flow/sched
kestractl triggers disable-by-ids my.ns/my-flow/sched
kestractl triggers enable-by-ids  my.ns/my-flow/sched

# Bulk operations by query
kestractl triggers delete-by-query  --namespace my.namespace
kestractl triggers unlock-by-query  --namespace my.namespace
kestractl triggers disable-by-query --namespace my.namespace
kestractl triggers enable-by-query  --namespace my.namespace

# Backfill management (single trigger)
kestractl triggers create-backfill \
  --namespace my.namespace --flow-id my-flow --trigger-id my-trigger \
  --start 2024-01-01T00:00:00Z --end 2024-02-01T00:00:00Z
kestractl triggers backfill-pause   my.namespace my-flow my-trigger
kestractl triggers backfill-unpause my.namespace my-flow my-trigger
kestractl triggers backfill-delete  my.namespace my-flow my-trigger

# Backfill management by IDs
kestractl triggers pause-backfill-by-ids   my.ns/my-flow/sched
kestractl triggers unpause-backfill-by-ids my.ns/my-flow/sched
kestractl triggers delete-backfill-by-ids  my.ns/my-flow/sched

# Backfill management by query
kestractl triggers pause-backfill-by-query   --namespace my.namespace
kestractl triggers unpause-backfill-by-query --namespace my.namespace
kestractl triggers delete-backfill-by-query  --namespace my.namespace

# Export all triggers as CSV
kestractl triggers export-csv
kestractl triggers export-csv --output-file triggers.csv
```

## Namespace management

```bash
# List namespaces
kestractl namespaces list
kestractl namespaces list --query my.namespace

# Search namespaces
kestractl namespaces search --query my.namespace

# Autocomplete namespace names (useful for scripting)
kestractl namespaces autocomplete --query my.

# Get namespace details (includes variables in output)
kestractl namespaces get my.namespace

# Create / update / delete a namespace
kestractl namespaces create my.namespace
kestractl namespaces update my.namespace --description "Production namespace"
kestractl namespaces delete my.namespace

# Set namespace variables inline (repeatable; takes precedence over --variables-file on key conflicts)
kestractl namespaces create my.namespace --variable env=prod --variable region=eu-west-1
kestractl namespaces update my.namespace --variable env=prod --variable region=eu-west-1

# Set namespace variables from a YAML or JSON file
kestractl namespaces update my.namespace --variables-file vars.yaml

# Combine both — inline flags override file entries on conflict
kestractl namespaces update my.namespace --variables-file vars.yaml --variable env=prod

# View inherited secrets and variables
kestractl namespaces inherited-secrets   my.namespace
kestractl namespaces inherited-variables my.namespace

# View plugin defaults for a namespace (includes inherited configuration)
kestractl namespaces plugin-defaults my.namespace

# Export / import plugin defaults
kestractl namespaces export-plugin-defaults my.namespace --output-file defaults.yaml
kestractl namespaces import-plugin-defaults my.namespace --file defaults.yaml
```

:::alert{type="warning"}
`--variable` and `--variables-file` replace the namespace's full variable set on each `create` or `update` call. To preserve existing variables, include them in the file or repeat them as `--variable` flags.
:::

## Key-value pairs

```bash
# List keys in a namespace
kestractl kv list my.namespace

# Set a key with an optional TTL (ISO 8601 duration)
kestractl kv set my.namespace STRING  api_key  "abc123"
kestractl kv set my.namespace NUMBER  retries  3
kestractl kv set my.namespace BOOLEAN enabled  true
kestractl kv set my.namespace JSON    settings '{"feature":true}'
kestractl kv set my.namespace STRING  session_token "abc" --ttl PT1H
kestractl kv set my.namespace STRING  cache_key     "val" --ttl P7D

# Update an existing key (fails if the key does not exist)
kestractl kv update my.namespace NUMBER retries 5
kestractl kv update my.namespace STRING session_token "new" --ttl PT30M

# Read and delete keys
kestractl kv get    my.namespace api_key
kestractl kv delete my.namespace api_key

# Bulk-delete multiple keys
kestractl kv delete-all my.namespace api_key session_token

# List KV pairs inherited from parent namespaces
kestractl kv list-inherited my.namespace
```

## Secrets management (Enterprise Edition)

```bash
# List secret keys in a namespace
kestractl secrets list my.namespace

# Create or replace a secret
kestractl secrets set my.namespace my-secret "the-value"
kestractl secrets set my.namespace my-secret "the-value" --description "API key for external service"

# Update secret metadata without changing the value
kestractl secrets patch my.namespace my-secret --description "Updated description"

# Delete a secret
kestractl secrets delete my.namespace my-secret
```

## Dashboards (Enterprise Edition)

```bash
# List dashboards
kestractl dashboards list
kestractl dashboards list --query my-dashboard --output json

# Get dashboard details (aliases: show, describe)
kestractl dashboards get <id>

# Create a dashboard from a YAML file
kestractl dashboards create --file my-dashboard.yaml

# Update an existing dashboard
kestractl dashboards update <id> --file my-dashboard.yaml

# Delete a dashboard
kestractl dashboards delete <id>

# Validate a dashboard or chart definition
kestractl dashboards validate       --file my-dashboard.yaml
kestractl dashboards validate-chart --file my-chart.yaml

# Preview a chart's data without saving it
kestractl dashboards preview-chart --file my-chart.yaml --output json

# Fetch data for a chart of an existing dashboard
kestractl dashboards chart-data <dashboard-id> <chart-id>
kestractl dashboards chart-data <dashboard-id> <chart-id> --file filters.yaml --output json

# Export chart data as CSV
kestractl dashboards export-chart-csv      --file my-chart.yaml --output-file chart.csv
kestractl dashboards export-chart-data-csv <dashboard-id> <chart-id> --output-file chart.csv
kestractl dashboards export-chart-data-csv <dashboard-id> <chart-id> --file filters.yaml --output-file chart.csv
```

## Apps (Enterprise Edition)

Apps are low-code interfaces built on top of flows.

```bash
# List apps
kestractl apps list
kestractl apps list --output json

# Get app details (aliases: show, describe)
kestractl apps get <id>

# Deploy an app from a YAML file (creates or replaces)
kestractl apps deploy --file my-app.yaml

# Update an existing app
kestractl apps update <id> --file my-app.yaml

# Enable / disable an app
kestractl apps enable  <uid>
kestractl apps disable <uid>

# Export all apps as a ZIP archive
kestractl apps export --output-file apps.zip

# Import apps from a ZIP archive
kestractl apps import --file apps.zip

# Bulk enable / disable / delete multiple apps
kestractl apps bulk-enable  uid-1 uid-2 uid-3
kestractl apps bulk-disable uid-1 uid-2 uid-3
kestractl apps bulk-delete  uid-1 uid-2 --yes

# List all tags used across apps
kestractl apps tags

# Search apps from the catalog
kestractl apps catalog
kestractl apps catalog --query reporting --output json

# Inspect files produced by an app execution view
kestractl apps file-meta    <view-id> --path /path/to/file
kestractl apps file-preview <view-id> --path /path/to/file --max-rows 50
kestractl apps file-preview <view-id> --path /path/to/file --max-rows 50 --encoding UTF-8

# Download logs for an app execution
kestractl apps logs <view-id> --min-level ERROR --output-file app.log
kestractl apps logs <view-id> --execution-id <exec-id> --task-id my-task --output-file app.log

# Delete an app
kestractl apps delete <id>
```

## Assets (Enterprise Edition)

```bash
# List assets
kestractl assets list
kestractl assets list --output json

# Get asset details (aliases: show, describe)
kestractl assets get <id>

# Create an asset from a YAML definition file
kestractl assets create --file my-asset.yaml

# Delete an asset
kestractl assets delete <id>

# Show an asset's dependency graph
kestractl assets dependencies <id>
kestractl assets dependencies <id> --expand-all --output json
kestractl assets dependencies <id> --destination-only --output json

# Bulk-delete assets by IDs or by query filters
kestractl assets delete-by-ids id1 id2 id3
kestractl assets delete-by-query --namespace my.namespace
kestractl assets delete-by-query --filter NAMESPACE:EQUALS:my.namespace --purge

# Inspect and manage lineage events
kestractl assets lineage-events list --output json
kestractl assets lineage-events delete-by-query --namespace my.namespace

# Inspect and manage asset usages
kestractl assets usages list --output json
kestractl assets usages delete-by-query --namespace my.namespace
```

## Blueprints

Community blueprints are available to all editions. Internal flow blueprints require Kestra EE.

```bash
# Search and retrieve community blueprints
kestractl blueprints community search --query "kafka"
kestractl blueprints community search --query "etl" --kind FLOW --output json
kestractl blueprints community search --tag python --tag sql
kestractl blueprints community get    <id>
kestractl blueprints community source <id>

# Show the graph topology of a community blueprint
kestractl blueprints community graph <id> --output json
kestractl blueprints community graph <id> --kind FLOW --output json

# Manage internal flow blueprints (Enterprise Edition)
kestractl blueprints flow list
kestractl blueprints flow get    <id>
kestractl blueprints flow get    <id> --legacy
kestractl blueprints flow create --title "My Blueprint" --source-file blueprint.yaml --tag etl
kestractl blueprints flow update <id> --title "My Blueprint" --source-file blueprint.yaml
kestractl blueprints flow delete <id>

# Generate a flow from a flow blueprint template
kestractl blueprints flow use-template <id> --input env=prod --input region=eu

# Manage custom (internal) blueprints (Enterprise Edition)
kestractl blueprints custom get    <id>
kestractl blueprints custom source <id>
kestractl blueprints custom create --title "My Blueprint" --source-file blueprint.yaml
kestractl blueprints custom update <id> --title "My Blueprint" --source-file blueprint.yaml
kestractl blueprints custom delete <id>
```

## Test suites (Enterprise Edition)

```bash
# List test suites
kestractl test-suites list
kestractl test-suites list --namespace my.namespace

# Get a test suite
kestractl test-suites get my.namespace my-test-suite

# Create / update / delete a test suite
kestractl test-suites create --file suite.yaml
kestractl test-suites update my.namespace my-test-suite --file suite.yaml
kestractl test-suites delete my.namespace my-test-suite

# Validate a test suite definition without creating it
kestractl test-suites validate --file suite.yaml

# Run a test suite or all suites matching a query
kestractl test-suites run          my.namespace my-test-suite
kestractl test-suites run-by-query --namespace my.namespace

# Bulk enable / disable / delete
kestractl test-suites enable-bulk  my.namespace/suite-a my.namespace/suite-b
kestractl test-suites disable-bulk my.namespace/suite-a
kestractl test-suites delete-bulk  my.namespace/suite-a my.namespace/suite-b

# Retrieve results
kestractl test-suites search-results --namespace my.namespace
kestractl test-suites last-result    --ids my.namespace/suite-a --ids my.namespace/suite-b
kestractl test-suites get-result     <result_id>
```

## IAM management (Enterprise Edition)

The `users`, `groups`, `roles`, `service-accounts`, `bindings`, and `invitations` command groups require Kestra Enterprise Edition. `users` and `service-accounts` operate at the instance level while `groups`, `roles`, `bindings`, and `invitations` are tenant-scoped and use the active tenant from your context.

### Users

:::alert{type="warning"}
Use `--user-password` to set a user's password — **not** `--password`. The `--password` flag authenticates the CLI itself with basic auth. Passing a user's new password to `--password` sends it as your own credentials.
:::

```bash
# List / filter users
kestractl users list
kestractl users list --query alice --output json

# Autocomplete user names
kestractl users autocomplete --query ali

# Get user details
kestractl users get <user_id>

# Create a user (--email is required)
kestractl users create --email alice@example.com --first-name Alice --last-name Smith --user-password 'S3cret!'
kestractl users create --email bob@example.com --superadmin
kestractl users create --email bot@example.com --restricted

# Grant a user access to specific tenants (--tenant-grant is repeatable)
kestractl users create --email ops@example.com --tenant-grant main --tenant-grant staging

# Update a user — only the flags you pass change; other attributes are preserved
kestractl users update <user_id> --first-name Alicia --last-name Jones
kestractl users update <user_id> --superadmin=false
kestractl users update <user_id> --tenant-grant main

# Set a user's password
kestractl users set-password <user_id> --user-password 'N3wPass!'

# Change your own password
kestractl users change-my-password --old-password 'OldPass!' --new-password 'N3wPass!'

# Grant or revoke super-admin status
kestractl users set-super-admin <user_id> --super-admin
kestractl users set-super-admin <user_id> --super-admin=false

# Mark a user as restricted, or lift the restriction
kestractl users set-restricted <user_id> --restricted=true
kestractl users set-restricted <user_id> --restricted=false

# Delete an auth method for a user
kestractl users delete-auth-method <user_id> BASIC_AUTH

# Assign a user to groups in the active tenant
# Passing no --group clears all group memberships for that tenant
kestractl users set-groups <user_id> --group <group_id>

# Impersonate a user (returns an impersonation token)
kestractl users impersonate <user_id>

# Revoke all refresh tokens for a user
kestractl users revoke-refresh-token <user_id>

# Delete a user — prompts for confirmation; skip with --yes
kestractl users delete <user_id>
kestractl users delete <user_id> --yes

# Manage a user's API tokens (the full token value is shown only once, at creation)
kestractl users tokens create <user_id> --name ci-token --description "CI pipeline token"
kestractl users tokens list <user_id>
kestractl users tokens delete <user_id> <token_id>
```

### Groups

```bash
# List / filter groups
kestractl groups list
kestractl groups list --query admins --output json

# Autocomplete group names
kestractl groups autocomplete --query adm

# Look up multiple groups by IDs
kestractl groups list-by-ids <id1> <id2>

# Get group details
kestractl groups get <group_id>

# Create a group (--name is required; --member is repeatable for initial members)
kestractl groups create --name admins --description 'Platform admins'
kestractl groups create --name admins --member <user_id> --member <user_id>

# Update a group — only the flags you pass change; other attributes are preserved
kestractl groups update <group_id> --name platform-admins
kestractl groups update <group_id> --description 'Updated description'

# Set a user's group membership (replaces all current memberships in this group)
kestractl groups set-membership <group_id> <user_id>

# Delete a group — prompts for confirmation; skip with --yes
kestractl groups delete <group_id>
kestractl groups delete <group_id> --yes

# Manage group members
kestractl groups members list <group_id>
kestractl groups members add <group_id> <user_id>
kestractl groups members remove <group_id> <user_id>
```

### Roles

A role carries a `permissions` payload: a map of resource (e.g. `FLOW`, `EXECUTION`, `NAMESPACE`) to a list of actions (e.g. `VIEW`, `LIST`, `EXECUTE`). Provide permissions either inline with the repeatable `--permission TYPE:ACTION[,ACTION]` flag or from a YAML/JSON file with `--permissions-file` — not both at once.

For the full list of resources and their valid actions, see the [RBAC permissions reference](../../07.enterprise/03.auth/rbac/permissions-reference/index.md).

:::alert{type="warning"}
Passing `--permission` or `--permissions-file` on `roles update` **replaces the entire permissions block** — it does not merge with the existing permissions. Omit both flags on update if you only want to change the name or description.
:::

```bash
# List / filter roles
kestractl roles list
kestractl roles list --query editor --output json
kestractl roles list --page 1 --size 50 --sort name:asc

# Autocomplete role names
kestractl roles autocomplete --query edi

# Look up multiple roles by IDs
kestractl roles list-from-ids <id1> <id2>

# Get role details, including its permissions
kestractl roles get <role_id>

# Create a role (--name required; at least one --permission or --permissions-file required)
kestractl roles create --name operator \
  --description "Can edit and execute flows, monitor executions" \
  --permission FLOW:VIEW,LIST,CREATE,UPDATE,DELETE,EXECUTE,DISABLE,ENABLE \
  --permission EXECUTION:VIEW,LIST,ACCESS_LOGS,ACCESS_FILES,FOLLOW

# Create a role from a permissions file (YAML or JSON)
kestractl roles create --name viewer --permissions-file perms.yaml
```

```yaml
# perms.yaml
FLOW:
  - VIEW
  - LIST
EXECUTION:
  - VIEW
  - LIST
  - ACCESS_LOGS
  - FOLLOW
```

```bash
# Update a role — only the flags you pass change; other attributes are preserved
# Exception: --permission replaces the entire permissions block
kestractl roles update <role_id> --description "Updated description"
kestractl roles update <role_id> --permission FLOW:VIEW,LIST,CREATE,UPDATE,DELETE
kestractl roles update <role_id> --default

# Delete a role — prompts for confirmation; skip with --yes
kestractl roles delete <role_id>
kestractl roles delete <role_id> --yes
```

### Service accounts

Service accounts are instance-level resources. The command can be shortened to `service-account` or `sa`.

`update` is a partial update — only `--name` and `--description` are accepted. Super-admin status, tenant grants, and group membership cannot be changed with `update`. Pass at least one of `--name` or `--description`; passing neither returns an error.

```bash
# List service accounts
kestractl service-accounts list
kestractl service-accounts list --output json
kestractl service-accounts list --page 1 --size 50 --sort name:asc

# Get service account details
kestractl service-accounts get <service_account_id>

# Create a service account (--name is required; lowercase alphanumeric and dashes)
kestractl service-accounts create --name ci-bot --description "CI pipeline"

# Create a super-admin service account with tenant access (--tenant-grant is repeatable)
kestractl service-accounts create --name ops-bot --superadmin --tenant-grant main

# Update name or description only (at least one flag required)
kestractl service-accounts update <service_account_id> --description "Updated description"
kestractl service-accounts update <service_account_id> --name new-bot-name

# Grant or revoke super-admin status
kestractl service-accounts set-super-admin <service_account_id> --super-admin
kestractl service-accounts set-super-admin <service_account_id> --super-admin=false

# Delete a service account — prompts for confirmation; skip with --yes
kestractl service-accounts delete <service_account_id>
kestractl service-accounts delete <service_account_id> --yes

# Manage API tokens (the full token value is shown only once, at creation)
kestractl service-accounts tokens create <service_account_id> --name deploy-token --description "CD pipeline token"
kestractl service-accounts tokens create <service_account_id> --name short-lived --max-age P30D --extended
kestractl service-accounts tokens list <service_account_id>
kestractl service-accounts tokens delete <service_account_id> <token_id>
```

### Bindings

A binding assigns a role to a user or group, optionally scoped to a namespace. Bindings are tenant-scoped.

```bash
# List all bindings
kestractl bindings list

# Filter by subject type or ID
kestractl bindings list --type USER --external-id <user_id>
kestractl bindings list --type GROUP --external-id <group_id>

# Filter by namespace
kestractl bindings list --namespace company.team

# Get binding details
kestractl bindings get <binding_id>

# Assign a role to a user tenant-wide
kestractl bindings create --type USER --external-id <user_id> --role <role_id>

# Assign a role to a group scoped to a namespace
kestractl bindings create --type GROUP --external-id <group_id> --role <role_id> \
  --namespace company.team

# Create multiple bindings from a JSON file
kestractl bindings bulk-create --file bindings.json

# Delete a binding — prompts for confirmation; skip with --yes
kestractl bindings delete <binding_id>
kestractl bindings delete <binding_id> --yes
```

### Invitations

Invitations let you grant users access to a tenant. Pre-assign roles and groups so the invitee receives them upon acceptance.

:::alert{type="info"}
If the invitee already has a Kestra user account, or if you pass `--create-user-if-not-exist`, the server grants tenant access directly and no invitation email is sent.
:::

```bash
# List all invitations
kestractl invitations list

# Filter by status or email
kestractl invitations list --status PENDING
kestractl invitations list --email jane@example.com

# List invitations for a specific email address
kestractl invitations list-by-email user@example.com

# Get invitation details
kestractl invitations get <invitation_id>

# Invite a user and pre-assign a role
kestractl invitations create --email jane@example.com --role <role_id>

# Invite a user into one or more groups (--group is repeatable)
kestractl invitations create --email jane@example.com --group <group_id> --group <group_id>

# Grant superadmin on acceptance
kestractl invitations create --email jane@example.com --superadmin

# Grant access directly, creating the user account if it does not exist
kestractl invitations create --email jane@example.com --create-user-if-not-exist

# Delete (revoke) an invitation — prompts for confirmation; skip with --yes
kestractl invitations delete <invitation_id>
kestractl invitations delete <invitation_id> --yes
```

## Server administration

```bash
# Show license details (type, expiry, max servers, standalone mode, Worker Groups support) — Enterprise Edition
kestractl server license

# List available server actions returned by the API
kestractl server actions

# Generate a statistics report (optional start date)
kestractl server generate
kestractl server generate --from 2024-01-01
```

## Plugin management

The `plugins` command group manages the plugins a Kestra worker needs to start. Use it when deploying standalone or remote workers without Docker, where plugins must be pre-installed as JAR files.

### `kestractl plugins list <version>`

List all compatible plugins for a given Kestra version. Output is a single space-separated line of `groupId:artifactId:version` coordinates.

```bash
kestractl plugins list 2.0.0
```

Use `--output json` for full plugin metadata (groupId, artifactId, license, version).

| Flag | Default | Description |
|---|---|---|
| `--edition` | `ALL` | Filter by edition: `ALL`, `OSS`, or `EE` |
| `--from-config` | — | Derive required core plugins from one or more config files (see below) |
| `--output` | `table` | Output format: `table` (space-separated coordinates) or `json` |

### `kestractl plugins download [version]`

Download plugins to a local directory. By default, all compatible plugins for the given version are downloaded from Maven Central.

```bash
kestractl plugins download 2.0.0
```

The version argument is required unless `--plugins` is set.

| Flag | Default | Description |
|---|---|---|
| `--plugins-dir` | `./plugins` | Directory to write downloaded JARs into |
| `--edition` | `ALL` | Filter by edition: `ALL`, `OSS`, or `EE` |
| `--plugins` | — | Explicit coordinates to download (`groupId:artifactId:version`, space-separated or repeated); bypasses API lookup and makes version optional |
| `--from-config` | — | Download only the core plugins required by one or more config files; requires a version argument (see below) |
| `--concurrency` | `1` | Number of parallel downloads |
| `--keep-only-last-version` | `true` | Remove older versions of each plugin from the plugins directory after downloading |
| `--force-redownload` | `false` | Re-download plugins even if they already exist |
| `--global-timeout` | `5m` | Maximum total time for all downloads |
| `--maven-repository` | Maven Central | Custom Maven repository base URL |
| `--maven-username` | — | Username for Maven basic authentication |
| `--maven-password` | — | Password for Maven basic authentication |

The global `--header` flag (see [Global flags](#global-flags)) adds arbitrary HTTP headers to all requests, including Maven downloads — use it for bearer token authentication against a private registry.

#### Custom Maven registry authentication

```bash
# Basic auth
kestractl plugins download 2.0.0 \
  --maven-repository https://nexus.example.com/repository/maven-central \
  --maven-username myuser \
  --maven-password mypassword

# Bearer token (--header is a global flag)
kestractl plugins download 2.0.0 \
  --maven-repository https://nexus.example.com/repository/maven-central \
  --header "Authorization:Bearer <token>"
```

### Bootstrap core plugins with `--from-config`

Use `--from-config` when you need to determine which core infrastructure plugins a standalone worker needs before it can start. Pass one or more Kestra `application.yaml` files and the command reads four keys, mapping each to the plugin it requires:

- `kestra.storage.type`
- `kestra.secret.type`
- `kestra.queue.type`
- `kestra.repository.type`

Bundled backends produce no output. Only backends that ship as a separate plugin appear in the output.

| Category | Bundled (no plugin needed) | Requires a plugin |
|---|---|---|
| Storage (`kestra.storage.type`) | `local` | `s3`, `gcs`, `azure`, `minio`, `seaweedfs`, `cloudflare`, `obs` |
| Secret (`kestra.secret.type`) | `jdbc`, `elasticsearch` | `vault`, `aws-secret-manager`, `azure-key-vault`, `google-secret-manager`, `cyberark`, `doppler`, `1password`, `beyondtrust`, `delinea` |
| Queue (`kestra.queue.type`) | `memory`, `h2`, `postgres`, `mysql`, `kafka` | — |
| Repository (`kestra.repository.type`) | `memory`, `h2`, `postgres`, `mysql` | `elasticsearch`, `opensearch` |

**Example:** a worker using S3 storage and AWS Secrets Manager needs two plugins:

```bash
kestractl plugins list 2.0.0 --from-config /etc/kestra/application.yaml
# → io.kestra.storage:storage-s3:1.4.1
```

If all configured backends are bundled, the command exits cleanly with:

```plaintext
No core plugins required by the provided configuration (all configured backends are bundled in Kestra).
```

If a config key contains an unrecognized type, the command fails and lists supported values:

```plaintext
Error: unknown kestra.storage.type "unknownbackend" — no known core plugin mapping (supported: azure, cloudflare, gcs, local, minio, obs, s3, seaweedfs)
```

#### Multiple config files

Pass `--from-config` multiple times to merge configs. The last non-empty value per category wins — later files override earlier ones:

```bash
kestractl plugins download 2.0.0 \
  --from-config /etc/kestra/application.yaml \
  --from-config /etc/kestra/application-prod.yaml
```

#### Pipe pattern

`--from-config` and `--plugins` are mutually exclusive on `download`. Use the pipe pattern to preview the required plugins before downloading:

```bash
kestractl plugins download 2.0.0 \
  --plugins "$(kestractl plugins list 2.0.0 --from-config /etc/kestra/application.yaml)"
```

#### Enterprise plugin registry

External secret managers (`aws-secret-manager`, `azure-key-vault`, `google-secret-manager`, and others) and the Elasticsearch/OpenSearch repository backends are not published to Maven Central. Use `--maven-repository` with your Kestra plugin registry credentials to download them.

## Worker management

### `kestractl workers registration-tokens generate`

Generate a worker registration token. This command runs entirely offline — no running Kestra instance is required.

```bash
kestractl workers registration-tokens generate
```

The token is printed to stdout in the format `kwreg_<random>_<checksum>`.

When deploying a standalone worker, you also need to download the core infrastructure plugins it requires. See [Bootstrap core plugins with `--from-config`](#bootstrap-core-plugins-with---from-config).

## Configuration

### Global flags

- `--host` - Kestra host URL
- `--tenant` - Tenant name
- `--token` / `-t` - API token (Enterprise)
- `--username` - Basic auth username (Open Source)
- `--password` - Basic auth password (Open Source)
- `--output` / `-o` - Output format (`table` or `json`)
- `--config` - Custom config file path (default: `~/.kestractl/config.yaml`)
- `--verbose` / `-v` - Verbose output (warning: prints credentials in HTTP requests)

### Config file and contexts

Manage contexts with `kestractl config add`, `kestractl config show`, `kestractl config use`, and `kestractl config remove`.

### Environment variables

Environment variables override config file settings. Use either `KESTRACTL_TOKEN` or `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD`.

```bash
export KESTRACTL_HOST=http://localhost:8080
export KESTRACTL_TENANT=main
export KESTRACTL_TOKEN=YOUR_TOKEN
export KESTRACTL_USERNAME=admin
export KESTRACTL_PASSWORD=admin
export KESTRACTL_OUTPUT=json
```

### Configuration precedence

1. **Command-line flags** (`--host`, `--token`, etc.)
2. **Environment variables** (`KESTRACTL_HOST`, `KESTRACTL_TOKEN`, etc.)
3. **Config file** (`~/.kestractl/config.yaml` or custom via `--config`)
4. **Default values**

### Override per command

```bash
kestractl flows get my.namespace my-flow \
  --host https://kestra.example.com \
  --tenant production \
  --token YOUR_TOKEN
```
