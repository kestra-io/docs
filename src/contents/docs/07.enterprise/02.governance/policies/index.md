---
title: Policies
h1: Enforce Governance Rules with Policies
description: Use Policies to inject, validate, and enforce plugin and flow configuration across namespaces and tenants. Policies give platform administrators centralized, observable control over how flows run.
sidebarTitle: Policies
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Policies are a governance feature in Kestra Enterprise that let platform administrators enforce configuration rules across namespaces and tenants. A Policy is a bundle of rules that can inject property values into flows and tasks, strip properties, restrict allowed values, or block non-compliant flows from saving or running.

## Why Policies

Without Policies, ensuring that flows across many namespaces use approved configurations requires manual coordination — authors must set values correctly on every task, and administrators have no way to enforce or verify compliance.

Policies address this with a model that supports:

- **Mutate rules** — inject or remove property values before execution, on flows and plugins alike
- **Validate rules** — block or warn when flows violate configuration requirements
- **Enforcement modes** — control whether a Policy actively blocks, only reports, or is opt-in
- **Inheritance** — rules from parent namespaces apply to children, and children can only tighten them

## Policy structure

A Policy has an `id`, a `description`, an `enforcement` mode, and a list of `rules`.

```yaml
id: prod-cost-controls
description: "Cost guardrails for prod flows."
enforcement: active

rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: flow
    values:
      concurrency:
        limit: 5
  - type: io.kestra.plugin.ee.rules.Restrict
    on: flow
    property: concurrency.limit
    max: 10
    errorMessage: "concurrency.limit cannot exceed 10 in prod."
```

A Policy has no `type` field — each rule's FQN (`mutate.*` / `validate.*`) determines what it does. A single policy can mix mutate and validate rules, which lets a coherent intent (such as "all prod flows: inject a default concurrency, then block values above 10") live in one place.

## Enforcement modes

| Mode | Behavior |
|------|----------|
| `active` | Rules are enforced on save and before execution. Block violations reject the operation. Default. |
| `evaluate` | Rules are checked and violations are reported in the Governance UI, but nothing is blocked. Use this for staged rollout — watch the report, then flip to `active`. |
| `disabled` | The Policy is inactive. Rules are not checked. |
| `reference` | The Policy is opt-in. It only applies to flows or tasks that explicitly list it via `policyRefs:`. |

## Rule types

### Mutate rules

Mutate rules change the resolved configuration before execution. They do not alter the stored flow YAML — the injection or deletion happens at resolution time. Every mutation is visible to the author in the flow editor's merged preview.

**`io.kestra.plugin.ee.rules.Add`** — inject values into flows or plugin instances. With `override: false` (the default), the author's explicit value wins and the policy injects only when the property is absent. With `override: true`, the policy value always wins.

Add rules can target flow-level properties (like `retry`, `concurrency`, or `labels`) with `on: flow`, or individual plugin instances with `on: plugin`.

```yaml
# Inject flow-level defaults — retry, concurrency, and a team label
- type: io.kestra.plugin.ee.rules.Add
  on: flow
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
  on: plugin
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  values:
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"

# Force a region value — override any author-supplied value
- type: io.kestra.plugin.ee.rules.Add
  on: plugin
  override: true
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  values:
    region: eu-west-1
```

Injected `values` may contain Pebble expressions such as `{{ secret('…') }}`. These are evaluated at runtime as plugin properties.

**`io.kestra.plugin.ee.rules.Delete`** — remove specific properties from matching flows or plugin instances at resolution time. Delete always wins over an author-supplied value, and is always visible in the merged preview.

```yaml
# Strip hardcoded credentials — a central injection policy supplies them
- type: io.kestra.plugin.ee.rules.Delete
  on: plugin
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.aws
  properties:
    - accessKeyId
    - secretKeyId
```

:::alert{type="warning"}
If an `Add` and a `Delete` rule both target the same property in the same scope chain, Kestra raises a save-time conflict error and cites both sources. Express delete-then-re-inject as a single `Add` with `override: true` instead.
:::

### Validate rules

Validate rules check flow or plugin properties at save time and before execution. Each validate rule has an `action` of `block` (default) or `warn`.

:::alert{type="info"}
Validation always runs against the **post-injection** resolved flow. An `Add` rule can satisfy a `Require` rule, and a `Restrict` rule catches a bad value regardless of whether the author or a Policy supplied it.
:::

**`io.kestra.plugin.ee.rules.Deny`** — reject a plugin type wholesale. Requires `on: plugin`. Matches every instance of the plugin wherever it appears — tasks, errors, nested in flowables, triggers, and task runners.

```yaml
- type: io.kestra.plugin.ee.rules.Deny
  on: plugin
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
  on: flow
  property: concurrency.limit
  max: 10
  errorMessage: "concurrency.limit cannot exceed 10 in prod."

# Allow only approved task runners
- type: io.kestra.plugin.ee.rules.Restrict
  on: plugin
  property: taskRunner.type
  enum:
    - io.kestra.plugin.scripts.runner.docker.Docker
    - io.kestra.plugin.scripts.runner.kubernetes.Kubernetes
  errorMessage: "Only Docker and Kubernetes task runners are allowed in prod."

# Enforce a naming convention — warn only
- type: io.kestra.plugin.ee.rules.Restrict
  on: flow
  property: id
  regex: "^[a-z][a-z0-9]*(-[a-z0-9]+)*$"
  action: warn
  errorMessage: "Flow ids should be kebab-case (e.g. daily-orders-sync)."
```

**`io.kestra.plugin.ee.rules.Require`** — mandate that one or more properties are set and non-empty. Empty string, whitespace-only, `[]`, and `{}` do not satisfy the rule; `0` and `false` do.

```yaml
# Every flow must carry a team label
- type: io.kestra.plugin.ee.rules.Require
  on: flow
  properties:
    - labels.team
  errorMessage: "Every flow must declare labels.team."

# Every script task must declare an explicit task runner
- type: io.kestra.plugin.ee.rules.Require
  on: plugin
  where:
    - field: type
      operator: STARTS_WITH
      value: io.kestra.plugin.scripts
  properties:
    - taskRunner
  errorMessage: "Every script task must declare an explicit taskRunner."
```

## Rule targeting

### `on` field

Each rule declares `on: flow` to target the flow's own properties, or `on: plugin` to target every plugin instance in the flow — tasks including nested ones, triggers, and task runners.

There is no flow-level `where:` filter. To target flows, use scope placement: author the policy at the namespace that owns the subtree, and inheritance carries it down. A tenant-scoped policy applies to every flow in the tenant.

### `where` clause

The `where` clause narrows which plugin instances a rule applies to. It is only valid on `on: plugin` rules. Each condition specifies a `field`, an `operator`, and a `value`. Multiple conditions combine with AND.

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
| `GREATER_THAN` | Numeric greater-than comparison |
| `LESS_THAN` | Numeric less-than comparison |
| `IS_NULL` | Property is null or absent |
| `IS_NOT_NULL` | Property is set and non-null |

```yaml
where:
  - field: type
    operator: STARTS_WITH
    value: io.kestra.plugin.scripts.python
```

`field` is a property path on the matched target — `type` is the most common, matching on the plugin's class name.

## Override behavior

For `mutate.Add` rules:

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

A Policy with `enforcement: reference` is not applied automatically. It applies only to flows or tasks that explicitly list it using `policyRefs:`. This lets teams share opt-in configuration bundles — named runner profiles, database connections, or compliance defaults that flows can adopt voluntarily.

```yaml
# Policy: db-analytics
id: db-analytics
description: "Analytics warehouse connection."
enforcement: reference
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
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
enforcement: reference
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
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
# The flow attaches the bundle per task
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

Reference policies are exempt from monotonic inheritance — they are convenience bundles, not governance rules.

## Policy inheritance

Policies from a parent namespace automatically apply to all child namespaces. Children can add stricter validate rules but cannot relax rules inherited from a parent — a child cannot lower a `max`, widen an `enum`, or downgrade a rule from `block` to `warn`.

For `override: true` mutate rules, the outermost scope wins. A tenant-level policy with `override: true` cannot be overridden by a namespace-level policy.

## Visibility

When you open a flow in the Kestra UI editor, a Policies panel shows:

- **Merged preview** — every injected value, every `override: true` replacement, and every `Delete` removal, each annotated with its source policy. Forced values are never invisible.
- **Violation reports** — which rules are violated, with per-flow drill-down and a Fix path.

When saving a flow violates an `active` Policy with `action: block`, Kestra rejects the save with a message that cites the Policy ID, scope, rule, and the admin-authored `errorMessage`. The flow is never auto-disabled; it must be corrected before it can be saved.

```
⛔ Cannot save flow `daily-encrypt` in namespace `company.team`:
   Policy `no-bigquery` (tenant `acme`), rule 1 (validate.Deny):
   Task `extract` uses `io.kestra.plugin.gcp.bigquery.Query`.
   → BigQuery plugins are disabled — contact the data platform team.

⚠️ Policy `prod-cost-controls`, rule 4 (validate.Require, warn):
   Task `train-model` does not set `timeout`.
```

## Creating and managing policies

Create and manage Policies from the Kestra UI under **Namespaces → [your namespace] → Policies**, or via the API. Policies can also be exported as YAML and imported into other namespaces or environments.
