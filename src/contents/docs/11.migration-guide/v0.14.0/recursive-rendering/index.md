---
title: Non-Recursive Pebble Rendering in Kestra 0.14.0
h1: Migrate to Non-Recursive Pebble Expression Rendering
sidebarTitle: Non-Recursive Pebble Rendering
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.14.0
description: Guide to the new non-recursive Pebble expression rendering and the usage of the render() function.
---


## Recursive rendering of Pebble expressions

Since 0.14.0, Kestra's templating engine has changed the default rendering behavior to **not recursive**.

Before the release 0.14, Kestra's templating engine has been rendering all expressions **recursively**. While recursive rendering enabled many flexible usage patterns, it also opened up the door to some unintended behavior. For example, if you wanted to parse JSON elements of a webhook payload that contained a templated string from other applications (such as GitHub Actions or dbt core), the recursive rendering would attempt to parse those expressions, resulting in an error.

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

As you can see in the above example, wrapping the Pebble expression in the `render()` function is all that is needed to migrate existing flows to Kestra 0.14.0. However, if you have many flows that use the previous recursive rendering behavior, you may perform that migration later. A boolean configuration variable `recursive-rendering` is available to keep the previous recursive rendering behavior while you migrate your flows.

## How to keep the previous behavior

To keep the previous (recursive) behavior, add the following configuration:

```yaml
kestra:
  variables:
    recursiveRendering: true # default: false
```

This is an instance-level configuration, so you don't need any changes in your code. Migrating flows to the new rendering behavior as soon as possible is recommended; the explicit rendering behavior is more intuitive and less error-prone.
