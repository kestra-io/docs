---
title: Policies
h1: Enforce Governance Rules with Policies
description: Use Policies to inject, validate, and enforce plugin and flow configuration across namespaces and tenants. Policies give platform administrators centralized, observable control over how flows run.
sidebarTitle: Policies
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Policies let platform administrators inject, validate, and enforce configuration rules across namespaces and tenants. 

A Policy bundles rules that inject property values, strip properties, restrict allowed values, or block non-compliant flows from saving or running.

## Why Policies

Without Policies, ensuring that flows across many namespaces use approved configurations requires manual coordination — authors must set values correctly on every task, and administrators have no way to enforce or verify compliance.

Policies address this with a model that supports:

- **Mutate rules** — inject or remove property values before execution, on flows and plugins alike
- **Validate rules** — block or warn when flows violate configuration requirements
- **Enforcement modes** — control whether a Policy actively blocks, only reports, or is opt-in
- **Inheritance** — rules from parent namespaces apply to children, and children can only tighten them

## Policy structure

A Policy has an `id`, an optional `description`, an optional `displayName` shown in the Governance UI, an `enforcement` mode, and a list of `rules`.

```yaml
id: prod-cost-controls
displayName: "Prod Cost Controls"
description: "Cost guardrails for prod flows."
enforcement: ACTIVE

rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: FLOW
    values:
      concurrency:
        limit: 5
  - type: io.kestra.plugin.ee.rules.Restrict
    on: FLOW
    property: concurrency.limit
    max: 10
    errorMessage: "concurrency.limit cannot exceed 10 in prod."
```

A Policy has no `type` field of its own — each rule has a `type` that selects one of the five rule types. A single policy can mix mutate and validate rules, which lets a coherent intent (such as "all prod flows: inject a default concurrency, then block values above 10") live in one place.

## Enforcement modes

| Mode | Behavior |
|------|----------|
| `ACTIVE` | Rules are enforced on save and before execution. Block violations reject the operation. Default. |
| `EVALUATE` | Validate rule violations are reported in the Governance UI without blocking. Mutate rules (`Add`, `Delete`) are suppressed — no values are injected or removed, and the Governance UI shows no violations for them. Use this mode to audit validate rule compliance before enabling enforcement; it is not useful for auditing mutate rule coverage. |
| `DISABLED` | The Policy is inactive. Rules are not checked. |
| `REFERENCE` | The Policy is opt-in. It only applies to flows or tasks that explicitly list it via `policyRefs:`. Use reference policies for opt-in configuration injection (`Add` rules); validate rules are not enforced. |

## Rule targeting

Every rule has two targeting fields: `on` selects whether the rule applies to the flow itself or to plugin instances within it, and `where` filters which plugin instances match.

### `on` field

Each rule declares `on: FLOW` to target the flow's own properties, or `on: PLUGIN` to target every plugin instance in the flow — tasks including nested ones, triggers, and task runners.

There is no flow-level `where:` filter. To target flows, use scope placement: place the Policy at the namespace that owns the subtree, and inheritance carries it down. A tenant-scoped policy applies to every flow in the tenant.

### `where` clause

The `where` clause narrows which plugin instances a rule applies to. It is only valid on `on: PLUGIN` rules. Each condition specifies a `field`, an `operator`, and a `value`. Multiple conditions combine with AND.

| Operator | Behavior |
|----------|----------|
| `EQUAL_TO` | Exact match |
| `NOT_EQUAL_TO` | Not an exact match |
| `STARTS_WITH` | Prefix match |
| `ENDS_WITH` | Suffix match |
| `CONTAINS` | Substring match |
| `IN` | Value is in a list |
| `NOT_IN` | Value is not in a list |
| `REGEX` | Full regular expression match |
| `IS_NULL` | Property is null or absent |
| `IS_NOT_NULL` | Property is set and non-null |

```yaml
where:
  - field: type
    operator: STARTS_WITH
    value: io.kestra.plugin.scripts.python
```

`field` is a property path on the matched target — `type` is the most common, matching on the plugin's class name.

## Rule types

Rules come in two families: mutate rules change the resolved configuration before execution, and validate rules check it at save time and before execution.

### Mutate rules

Mutate rules change the resolved configuration before execution. They do not alter the stored flow YAML — the injection or deletion happens at resolution time. Every mutation is visible to the author in the flow editor's merged preview.

**`io.kestra.plugin.ee.rules.Add`** — inject values into flows or plugin instances. With `override: false` (the default), the author's explicit value wins and the policy injects only when the property is absent. With `override: true`, the policy value always wins.

Add rules can target flow-level properties (like `retry`, `concurrency`, or `labels`) with `on: FLOW`, or individual plugin instances with `on: PLUGIN`.

```yaml
# Inject flow-level defaults — retry, concurrency, and a team label
- type: io.kestra.plugin.ee.rules.Add
  on: FLOW
  values:
    retry:
      type: constant
      maxAttempt: 3
      interval: PT1M
    concurrency:
      limit: 5
    labels:
      team: data-platform

# Inject credentials into every AWS plugin instance
- type: io.kestra.plugin.ee.rules.Add
  on: PLUGIN
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  values:
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"

# Force a region value — override any author-supplied value
- type: io.kestra.plugin.ee.rules.Add
  on: PLUGIN
  override: true
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  values:
    region: eu-west-1
```

Injected `values` may contain Pebble expressions such as `{{ secret('…') }}`. These are evaluated at runtime as plugin properties.

:::alert{type="info"}
When injecting a nested object, keys from the flow and the policy are merged. If both supply a list at the same path, the policy's list replaces the flow's list entirely — lists are not combined.
:::

**`io.kestra.plugin.ee.rules.Delete`** — remove specific properties from matching flows or plugin instances at resolution time. Delete always wins over an author-supplied value, and is always visible in the merged preview.

```yaml
# Strip hardcoded credentials — a central injection policy supplies them
- type: io.kestra.plugin.ee.rules.Delete
  on: PLUGIN
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  properties:
    - accessKeyId
    - secretKeyId
```

:::alert{type="warning"}
If an `Add` and a `Delete` rule both target the same property in the same scope chain, Kestra raises a conflict error at save time. Express delete-then-re-inject as a single `Add` with `override: true` instead.
:::

### Validate rules

Validate rules check flow or plugin properties at save time and before execution. Each validate rule has an `action` of `block` (default) or `warn`.

:::alert{type="info"}
Validation runs after all `Add` and `Delete` rules have been applied. An `Add` rule can satisfy a `Require` rule, and a `Restrict` rule catches a bad value regardless of whether the author or a Policy supplied it.
:::

**`io.kestra.plugin.ee.rules.Deny`** — reject a plugin type wholesale. Requires `on: PLUGIN`. Matches every instance of the plugin wherever it appears — tasks, error handlers, triggers, and task runners.

```yaml
- type: io.kestra.plugin.ee.rules.Deny
  on: PLUGIN
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.gcp.bigquery
  errorMessage: "BigQuery plugins are disabled — contact the data platform team."
```

**`io.kestra.plugin.ee.rules.Restrict`** — constrain a property to an allowed range or set of values. Requires at least one of: `min`, `max`, `enum`, `regex`, `equals`. If the property is absent, no violation is raised — pair with a `Require` or `Add` rule for guaranteed presence.

```yaml
# Cap concurrency on flow-level properties
- type: io.kestra.plugin.ee.rules.Restrict
  on: FLOW
  property: concurrency.limit
  max: 10
  errorMessage: "concurrency.limit cannot exceed 10 in prod."

# Allow only approved task runners
- type: io.kestra.plugin.ee.rules.Restrict
  on: PLUGIN
  property: taskRunner.type
  enum:
    - io.kestra.plugin.scripts.runner.docker.Docker
    - io.kestra.plugin.scripts.runner.kubernetes.Kubernetes
  errorMessage: "Only Docker and Kubernetes task runners are allowed in prod."

# Enforce a naming convention — warn only
- type: io.kestra.plugin.ee.rules.Restrict
  on: FLOW
  property: id
  regex: "^[a-z][a-z0-9]*(-[a-z0-9]+)*$"
  action: warn
  errorMessage: "Flow ids should be kebab-case (e.g. daily-orders-sync)."
```

**`io.kestra.plugin.ee.rules.Require`** — mandate that one or more properties are set and non-empty. Empty string, whitespace-only, `[]`, and `{}` do not satisfy the rule; `0` and `false` do.

```yaml
# Every flow must carry a team label
- type: io.kestra.plugin.ee.rules.Require
  on: FLOW
  properties:
    - labels.team
  errorMessage: "Every flow must declare labels.team."

# Every script task must declare an explicit task runner
- type: io.kestra.plugin.ee.rules.Require
  on: PLUGIN
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.scripts
  properties:
    - taskRunner
  errorMessage: "Every script task must declare an explicit taskRunner."
```

## Override behavior

For `Add` rules:

- `override: false` (default) — if the author sets a value, it is used. The policy injects only when the property is absent.
- `override: true` — the policy value always wins. The replacement is annotated in the merged preview so the author can see it.

When multiple policies with `override: true` apply to the same property, the outermost scope wins: a tenant-level policy with `override: true` cannot be overridden by a namespace-level policy.

### Choosing between `override: true` and `Restrict(equals:)`

Both approaches pin a property to a specific value. The difference is posture:

| | `Add(override: true)` | `Add` + `Restrict(equals:)` |
|-|----------------------|----------------------------|
| Author sets a different value | Silently corrected at runtime; visible in merged preview | Rejected at save; author is told to fix it |
| Requires | One rule | Two rules in the same policy |
| Personas | Platform teams — "just make it right" | Compliance teams — "make the author fix it" |

Both can live in the same policy.

## Reference policies

A Policy with `enforcement: REFERENCE` is not applied automatically. It applies only to flows or tasks that explicitly list it using `policyRefs:`. This lets teams share opt-in configuration bundles — named runner profiles, database connections, or compliance defaults that flows can adopt voluntarily.

```yaml
# Policy: db-analytics
id: db-analytics
description: "Analytics warehouse connection."
enforcement: REFERENCE
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.jdbc.postgresql
    values:
      url: jdbc:postgresql://analytics:5432/dw
      username: "{{ secret('DW_USER') }}"
      password: "{{ secret('DW_PASSWORD') }}"
```

```yaml
# Policy: db-orders
id: db-orders
description: "Orders OLTP connection."
enforcement: REFERENCE
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.jdbc.postgresql
    values:
      url: jdbc:postgresql://orders:5432/oltp
      username: "{{ secret('ORDERS_USER') }}"
      password: "{{ secret('ORDERS_PASSWORD') }}"
```

```yaml
# Attach the bundle per task — each task opts into the policy it needs
id: orders-to-warehouse
namespace: acme.data
tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.postgresql.Query
    policyRefs:
      - db-orders
  - id: load
    type: io.kestra.plugin.jdbc.postgresql.Query
    policyRefs:
      - db-analytics
```

`policyRefs` is valid at the flow level, on individual tasks, and on triggers. Flow-level `policyRefs` applies the bundle to all tasks in the flow:

```yaml
# Flow-level policyRefs — applies the bundle to all tasks
id: daily-report
namespace: company.team
policyRefs:
  - pydata-defaults
tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    script: |
      print("done")
```

Triggers also support `policyRefs`:

```yaml
id: event-pipeline
namespace: acme.data
tasks:
  - id: process
    type: io.kestra.plugin.jdbc.postgresql.Query
    sql: SELECT 1
triggers:
  - id: on-file
    type: io.kestra.plugin.aws.s3.Trigger
    policyRefs:
      - aws-s3-credentials
    bucket: my-bucket
    prefix: "data/"
```

Reference policies do not propagate through namespace inheritance — flows and tasks must opt in explicitly using `policyRefs:`. Reference policies are designed for opt-in configuration injection: use `Add` rules to supply credentials, defaults, or runner configuration that teams can adopt voluntarily. Validate rules (`Deny`, `Restrict`, `Require`) are not enforced in `REFERENCE` mode.

## Visibility

The Policy overview page (accessible from the tenant **Policies** menu or **Namespaces → [namespace] → Policies**) lists every flow violating the policy's validate rules, with a finding count per flow and a **Fix** button.

The Fix dialog shows:
- The policy and flow names
- The rule action (`block` or `warn`) and your `errorMessage`
- The rule type and the property path that triggered the violation
- A diff preview of the suggested change

`block` and `warn` findings require manual corrections — use **Open flow** to go directly to the flow editor. The **Apply** button applies auto-fixable suggestions where available.

When saving a flow violates an `ACTIVE` Policy, Kestra rejects the save and shows the policy name, which rule was violated, and the admin-authored `errorMessage`. The flow is never auto-disabled; it must be corrected before it can be saved. Warnings from `action: warn` rules are surfaced separately without blocking the save.

When a flow is open in the editor, the Policies panel shows a **Mutation preview** toggle that surfaces injected values from `Add` rules, `override: true` replacements, and `Delete` removals, each annotated with the source policy that supplied them.

## Policy scope and inheritance

Policies apply along a scope chain, from outermost to innermost:

| Scope | Where defined | Who can edit |
|---|---|---|
| `STATIC` | `kestra.policies` in server configuration | Infrastructure / platform team |
| `INSTANCE` | Tenant root (no specific namespace) | Superadmin |
| `TENANT` | Tenant-level via API or UI | Tenant admin |
| `NAMESPACE` | Namespace-level via API or UI | Namespace admin with `POLICY` permission |

An optional `target` field lets you narrow a policy's reach within its scope: `INSTANCE` and `STATIC` policies can list specific `tenants`; `TENANT` policies can list specific namespace subtrees under `namespaces`. Absent means the full scope.

```yaml
# TENANT policy targeting only the `analytics` and `ml` namespace subtrees
id: data-team-policy
enforcement: ACTIVE
target:
  namespaces:
    - analytics
    - ml
rules:
  - type: io.kestra.plugin.ee.rules.Require
    on: FLOW
    properties:
      - labels.team
```

Policies from parent namespaces automatically apply to all child namespaces. Children can add stricter validate rules but cannot relax rules inherited from a parent.

For `override: false` `Add` rules, the innermost scope wins — a namespace policy fills a property that a tenant policy left unset. For `override: true` `Add` rules, the outermost scope wins — a static or tenant policy with `override: true` cannot be overridden by a namespace policy.

## Static policies

Static policies are declared in server configuration under `kestra.policies`. They form the outermost scope, are cross-tenant, and are read-only through the API. Use them for installation-wide governance that no namespace or tenant can override.

```yaml
kestra:
  policies:
    - id: instance-defaults
      description: "Global task runner and cost controls."
      rules:
        - type: io.kestra.plugin.ee.rules.Add
          on: PLUGIN
          override: true
          where:
            - field: type
              operator: STARTS_WITH
              value: io.kestra.plugin.aws
          values:
            region: eu-west-1
        - type: io.kestra.plugin.ee.rules.Restrict
          on: FLOW
          property: concurrency.limit
          max: 20
          errorMessage: "concurrency.limit cannot exceed 20."
```

- `id` is required (lowercase alphanumeric and hyphens, RFC 1123 label format).
- Do not set `scope`, `tenantId`, or `namespace` — static policies are always installation-wide.
- A malformed static policy prevents server startup (fail-closed). Validate in a staging environment before deploying.

Static policies are the replacement for the removed `kestra.plugins.defaults` server configuration key. See the [pluginDefaults Removed migration guide](../../../11.migration-guide/v2.0.0/plugin-defaults-removed/index.md) for the full conversion.

## Creating and managing policies

Create and manage Policies from the Kestra UI in two places:

- **Tenant-level**: navigate to the tenant administration menu and open **Policies** to manage tenant-scoped policies.
- **Namespace-level**: open **Namespaces → [your namespace] → Policies** to manage policies scoped to that namespace.

You can also create and manage Policies via the API:

```
POST /api/v1/{tenant}/policies                            # tenant-scoped
POST /api/v1/{tenant}/namespaces/{namespace}/policies     # namespace-scoped
```

Policies can also be exported as YAML and imported into other namespaces or environments.

## Verifying policy behavior

### Preview the effective policy chain

Before saving a flow, preview what policies will inject and which rules will flag violations:

```
POST /api/v1/{tenant}/flows/policies/preview
```

Send the flow source YAML in the request body. The response returns the mutated source with per-property attribution — each injected value is annotated with the policy ID and scope that supplied it.

### Dry-run a policy against saved flows

Evaluate a policy against flows already in a namespace without enforcing it:

```
GET /api/v1/{tenant}/policies/{id}/evaluate
GET /api/v1/{tenant}/namespaces/{namespace}/policies/{id}/evaluate
```

The response lists every flow that would violate the policy's validate rules, grouped by rule. Use this to audit your compliance baseline before switching a policy from `EVALUATE` to `ACTIVE`.

## RBAC

Managing Policies requires the `POLICY` permission on the target resource. This permission is separate from namespace edit rights — a user who can edit flows in a namespace does not automatically have permission to manage its Policies.

Permissions: `VIEW`, `CREATE`, `UPDATE`, `DELETE`.
