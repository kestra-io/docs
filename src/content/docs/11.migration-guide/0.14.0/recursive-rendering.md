---
title: Recursive rendering of Pebble expressions
icon: /docs/icons/migration-guide.svg
release: 0.14.0
---

Since 0.14.0, kestra's templating engine has changed the default rendering behavior to **not recursive**.

## Why the change?

Before the release 0.14, kestra's templating engine has been rendering all expressions **recursively**. While recursive rendering enabled many flexible usage patterns, it also opened up the door to some unintended behavior. For example, if you wanted to parse JSON elements of a webhook payload that contained a templated string from other applications (such as GitHub Actions or dbt core), the recursive rendering would attempt to parse those expressions, resulting in an error.

The release 0.14.0 has changed the default rendering behavior to **not recursive** and introduced a new `render()` function that gives you more control over which expressions should be rendered and how.

## The new `render()` function

The syntax for the `render()` function is as follows:

```yaml
{{ render(expression_string, recursive=true) }} # if false, render only once
```

Here is a simple usage example:

```yaml
id: render_variables_recursively
namespace: company.team

variables:
  trigger_var: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

tasks:
  - id: parse_date
    type: io.kestra.plugin.core.debug.Return
    format: "{{ render(vars.trigger_var) }}" # this will print the recursively-rendered variable

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/1 * * * *"
```

---

## Migrating a 0.13.0 flow to the new rendering behavior in 0.14.0

As you can see in the above example, simply wrapping the Pebble expression in the `render()` function will allow you to easily migrate your existing flows to the kestra version 0.14.0. However, if you have many flows that use the previous recursive rendering behavior, you may perform that migration later. We've added a boolean configuration variable called `recursive-rendering` that allows you to keep the previous recursive rendering behavior and gives you more time to migrate your flows.

## How to keep the previous behavior

To keep the previous (recursive) behavior, add the following configuration:

```yaml
kestra:
  variables:
    recursiveRendering: true # default: false
```

This is an instance-level configuration, so you don't need any changes in your code. We recommend that you migrate your flows to the new rendering behavior as soon as you can, as we believe this more explicit rendering behavior will be more intuitive and less error-prone in the long run.
