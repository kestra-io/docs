---
title: Recursive rendering of Pebble expressions
---

So far, the templating engine has been rendering all expressions **recursively**. While recursive rendering enabled many flexible usage patterns, it also opened up the door to some unintended behavior. For example, if you wanted to parse JSON elements of a webhook payload that contained a templated string from other applications (such as GitHub Actions or dbt core), the recursive rendering would attempt to parse those expressions, resulting in an error.

The release 0.14.0 has changed the default rendering behavior to **not recursive** and introduced a new `render()` function that gives you more control over which expressions should be rendered and how.

## The new `render()` function

The syntax for the new `render()` function is as follows:

```yaml
{{ render(expression_string, recursive=true) }} # if false, render only once
```

The function takes two arguments:
1. The string of an expression to be rendered e.g. `"{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"`
2. A boolean flag that controls whether the rendering should be recursive or not:
   - if `true` (default), the expression will be **rendered recursively**
   - if `false`, the expression will be **rendered only once**.

Let's see some examples of how the `render()` function works and where you need to use it.

### Where the `render()` function is not needed

Let's take the following flow as an example:

```yaml
id: parse_input_and_trigger_expressions
namespace: qa

inputs:
  - name: myinput
    type: STRING
    defaults: hello

tasks:
  - id: parse_date
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

  - id: parse_input
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ inputs.myinput }}"

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* * * * *"
```

Since we don't use any nested expressions (like using trigger or input expressions in variables, or using variables in other variables), this flow will work just fine without having to use the `render()` function.

### Where the new `render()` function is needed

Let's modify our example so that now we store that long expression ``"{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"`` in a variable:

```yaml
id: hello
namespace: dev

variables:
  trigger_var: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

tasks:
  - id: parse_date
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ vars.trigger_var }}" # no render function means no recursive rendering for that trigger_var variable

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    disabled: true
    cron: "* * * * *"
```

Here, the task `parse_date` will print the expression without rendering it, so the printed output will not be a date but just a string of that variable:

```shell
{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}
```

To fix that, simply wrap the `vars.trigger_var` variable in the `render()` function:

```yaml
id: hello
namespace: dev

variables:
  trigger_var: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

tasks:
  - id: parse_date
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ render(vars.trigger_var) }}" # this will print the recursively-rendered expression

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* * * * *"
```

Now you should see the date printed in the logs, e.g. `2024-01-16`.

### Using expressions in namespace variables

Let's assume that you have configured a [namespace variable](https://kestra.io/docs/concepts/expression/02a.expression-types#namespace-variables-ee) `myvar`. That variable uses a Pebble function to retrieve a secret e.g. `{{ secret('MY_SECRET') }}`. By default, kestra will only render the expression without recursively rendering what's inside of the namespace variable:

```yaml
id: namespace_variable
namespace: qa

tasks:
  - id: print_variable
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ namespace.myvar }}"
```

If you want to render the secret contained in that variable, you will need to wrap it in the `render()` function:

```yaml
id: namespaces_variable
namespace: qa

tasks:
  - id: print_variable
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ render(namespace.myvar) }}"
```

### String concatenation

Let's look at another example that will demonstrate how the `render()` function works with string concatenation.

```yaml
id: pebble_string_concatenation
namespace: qa

inputs:
  - name: date
    type: DATETIME
    defaults: 2024-02-24T22:00:00.000Z

  - name: user
    type: STRING
    defaults: Rick

variables:
  day_of_week: "{{ trigger.date ?? inputs.date | date('EEEE') }}"
  full_date: "{{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}"
  full_date_tilde: "{{ vars.day_of_week ~ ', the ' ~ (trigger.date ?? inputs.date | date('yyyy-MM-dd')) }}"
  greeting_tilde: "{{'Hello, ' ~ inputs.user ~ ' on ' ~ vars.full_date }}"
  greeting_brackets: "Hello, {{ inputs.user }} on {{ vars.full_date }}"

tasks:
  - id: not-rendered
    type: io.kestra.core.tasks.log.Log
    message: |
     Tilde: {{ vars.greeting_tilde }}
     Brackets: {{ vars.greeting_brackets }}
     Full date: {{ vars.full_date }}
     Full date tilde: {{ vars.full_date_tilde }}

  - id: rendered-recursively
    type: io.kestra.core.tasks.log.Log
    message: |
     Tilde: {{ render(vars.greeting_tilde) }}
     Brackets: {{ render(vars.greeting_brackets) }}
     Full date: {{ render(vars.full_date) }}
     Full date tilde: {{ render(vars.full_date_tilde) }}

  - id: rendered-once
    type: io.kestra.core.tasks.log.Log
    message: |
     Tilde: {{ render(vars.greeting_tilde, recursive=false) }}
     Brackets: {{ render(vars.greeting_brackets, recursive=false) }}
     Full date: {{ render(vars.full_date, recursive=false) }}
     Full date tilde: {{ render(vars.full_date_tilde, recursive=false) }}

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* * * * *"
```

Here are some things to note about this flow:
- the ``??`` syntax is a [null-coalescing operator](https://kestra.io/docs/concepts/expression/operator/null-coalescing) that returns the first non-null value in the expression. For example, if `trigger.date` is null, the expression will return `inputs.date`.
- the `~` tilde sign is a [string concatenation operator](https://kestra.io/docs/concepts/expression/operator/concat) that combines multiple strings into one.

When you run this flow, you should see the following output in the logs:

```shell
INFO Tilde: {{'Hello, ' ~ inputs.user ~ ' on ' ~ vars.full_date }}
Brackets: Hello, {{ inputs.user }} on {{ vars.full_date }}
Full date: {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Full date tilde: {{ vars.day_of_week ~ ', the ' ~ (trigger.date ?? inputs.date | date('yyyy-MM-dd')) }}

INFO Tilde: Hello, Rick on Saturday, the 2024-02-24
Brackets: Hello, Rick on Saturday, the 2024-02-24
Full date: Saturday, the 2024-02-24
Full date tilde: Saturday, the 2024-02-24

INFO Tilde: Hello, Rick on {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Brackets: Hello, Rick on {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Full date: {{ trigger.date ?? inputs.date | date('EEEE') }}, the 2024-02-24
Full date tilde: {{ trigger.date ?? inputs.date | date('EEEE') }}, the 2024-02-24
```

You may notice that both the ``vars.greeting_tilde`` and ``vars.greeting_brackets`` lead to **the same output**, even though the first one uses the `~` tilde sign for string concatenation within a single Pebble expression `{{ }}`, and the second one uses one string with multiple `{{ }}` expressions to concatenates the strings. Both are fully supported and you can decide which one to use based on your preference.


### Webhook trigger: using `render()` with the `recursive=false` flag

Let's look at how the `render()` function works with the webhook trigger.

Imagine you use a GitHub webhook as a trigger in order to automate deployments after a pull request is merged. Your GitHub webhook payload looks as follows:

```json
{
    "pull_request": {
        "html_url": "https://github.com/kestra-io/kestra/issues/2740",
        "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}."
    }
}
```

The pull request body contains templated variables `${{ env.MYENV }}` and `${{ secrets.GITHUB_TOKEN }}`, which are not meant to be rendered by Kestra, but by GitHub Actions. Processing this webhook payload with recursive rendering would result in an error, as those variables are not defined in the flow execution context.

In order to process that webhook's payload and render its elements such as the `pull_request.body` without recursively rendering its content, you can leverage the `render()` function with the `recursive=false` flag:

```yaml
id: pebble_in_webhook
namespace: qa

inputs:
  - name: github_url
    type: STRING
    defaults: https://github.com/kestra-io/kestra/issues/2740

  - name: body
    type: JSON
    defaults: |
      {
        "pull_request": {
            "html_url": "https://github.com/kestra-io/kestra/issues/2740",
            "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"
        }
      }

variables:
  github_url: "{{ trigger.body.pull_request.html_url ?? trigger.body.issue.html_url ?? inputs.github_url }}"
  body: "{{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}"

tasks:
  - id: render_once
    type: io.kestra.core.tasks.log.Log
    message: "{{ render(vars.body, recursive=false) }}"

  - id: not-recursive
    type: io.kestra.core.tasks.log.Log
    message: "{{ vars.body }}"

  - id: recursive
    type: io.kestra.core.tasks.log.Log
    message: "{{ render(vars.body) }}"
    allowFailure: true # this task will fail because it will try to render the webhook's payload

triggers:
  - id: webhook
    type: io.kestra.core.models.triggers.types.Webhook
    key: test1234
```

Only the `render_once` task is relevant, as it will render the pull request's `body` without recursively rendering its content. The flow includes a `recursive` and `non-recursive` configuration for easy comparison.
- The `not-recursive` task will print the `{{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}` expression as a string without rendering it.
- The `recursive` task will fail, as it will try to render the webhook's payload containing templating that cannot be parsed by kestra.

Here is how you can call that flow via curl:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "pull_request": {"html_url": "https://github.com/kestra-io/kestra/issues/2740", "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"} }' \
  http://localhost:8080/api/v1/executions/webhook/qa/pebble_in_webhook/test1234
```

On an instance with multi-tenancy enabled, make sure to also pass the tenant ID in the URL:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "pull_request": {"html_url": "https://github.com/kestra-io/kestra/issues/2740"}, "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"} }' \
  http://localhost:8080/api/v1/your_tenant/executions/webhook/qa/pebble_in_webhook/test1234
```

You should see similar output in the logs:

```shell
INFO This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}
INFO {{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}
ERROR io.pebbletemplates.pebble.error.PebbleException: Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
ERROR Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
```

---

## Migrating a 0.13.0 flow to the new rendering behavior in 0.14.0

As you've seen in the previous examples, simply wrapping the Pebble expression in the `render()` function will allow you to easily migrate your existing flows to the kestra version 0.14.0. However, if you have many flows that use the previous recursive rendering behavior, you may perform that migration later. We've added a configuration variable that allows you to keep the previous recursive rendering behavior to give you more time to migrate your flows.

## How to keep the previous behavior

If you need more time to migrate your flows, you can keep the previous behavior by adding the following configuration:

```yaml
kestra:
  variables:
    recursive-rendering: true # default: false
```

This is an instance-level configuration, so you don't need any changes in your code. We recommend that you migrate your flows to the new rendering behavior as soon as you can, as we believe this more explicit rendering behavior will be more intuitive and less error-prone in the long run.

