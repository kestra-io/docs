---
title: render
---

By default, kestra renders all expressions [only once](../../../15.migrations/recursive-rendering.md). This is safer from a security perspective, and it prevents unintended behavior when parsing JSON elements of a webhook payload that contained a templated string from other applications (such as GitHub Actions or dbt core). However, sometimes recursive rendering is desirable. For example, if you want to parse [flow variables](../../variables.md) that contain Pebble expressions. This is where the `render()` function comes in handy.

The `render()` function is used to enable recursive rendering of Pebble expressions. It is available since the release 0.14.0.

The syntax for the `render()` function is as follows:

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

### Where the `render()` function is needed

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

Here, the task `parse_date` will print the expression without recursively rendering it, so the printed output will be a string of that variable rather than a parsed date:

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
  full_date_concat: "{{ vars.day_of_week ~ ', the ' ~ (trigger.date ?? inputs.date | date('yyyy-MM-dd')) }}"
  greeting_concat: "{{'Hello, ' ~ inputs.user ~ ' on ' ~ vars.full_date }}"
  greeting_brackets: "Hello, {{ inputs.user }} on {{ vars.full_date }}"

tasks:
  - id: not-rendered
    type: io.kestra.core.tasks.log.Log
    message: |
     Concat: {{ vars.greeting_concat }}
     Brackets: {{ vars.greeting_brackets }}
     Full date: {{ vars.full_date }}
     Full date concat: {{ vars.full_date_concat }}

  - id: rendered-recursively
    type: io.kestra.core.tasks.log.Log
    message: |
     Concat: {{ render(vars.greeting_concat) }}
     Brackets: {{ render(vars.greeting_brackets) }}
     Full date: {{ render(vars.full_date) }}
     Full date concat: {{ render(vars.full_date_concat) }}

  - id: rendered-once
    type: io.kestra.core.tasks.log.Log
    message: |
     Concat: {{ render(vars.greeting_concat, recursive=false) }}
     Brackets: {{ render(vars.greeting_brackets, recursive=false) }}
     Full date: {{ render(vars.full_date, recursive=false) }}
     Full date concat: {{ render(vars.full_date_concat, recursive=false) }}

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* * * * *"
```

Note that:
- the ``??`` syntax within `"{{ trigger.date ?? inputs.date | date('EEEE') }}"` is a [null-coalescing operator](https://kestra.io/docs/concepts/expression/operator/null-coalescing) that returns the first non-null value in the expression. For example, if `trigger.date` is null, the expression will return `inputs.date`.
- the `~` sign is a [string concatenation operator](https://kestra.io/docs/concepts/expression/operator/concat) that combines two strings into one.

When you run this flow, you should see the following output in the logs:

```shell
INFO Concat: {{'Hello, ' ~ inputs.user ~ ' on ' ~ vars.full_date }}
Brackets: Hello, {{ inputs.user }} on {{ vars.full_date }}
Full date: {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Full date concat: {{ vars.day_of_week ~ ', the ' ~ (trigger.date ?? inputs.date | date('yyyy-MM-dd')) }}

INFO Concat: Hello, Rick on Saturday, the 2024-02-24
Brackets: Hello, Rick on Saturday, the 2024-02-24
Full date: Saturday, the 2024-02-24
Full date concat: Saturday, the 2024-02-24

INFO Concat: Hello, Rick on {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Brackets: Hello, Rick on {{ vars.day_of_week }}, the {{ trigger.date ?? inputs.date | date('yyyy-MM-dd') }}
Full date: {{ trigger.date ?? inputs.date | date('EEEE') }}, the 2024-02-24
Full date concat: {{ trigger.date ?? inputs.date | date('EEEE') }}, the 2024-02-24
```

You may notice that both the ``vars.greeting_concat`` and ``vars.greeting_brackets`` lead to **the same output**, even though the first one uses the `~` sign for string concatenation within a single Pebble expression `{{ }}`, and the second one uses one string with multiple `{{ }}` expressions to concatenate the strings. Both are fully supported and you can decide which one to use based on your preference.


### Webhook trigger: using `render()` with the `recursive=false` flag

Let's look at how the `render()` function works with the webhook trigger.

Imagine you use a GitHub webhook as a trigger in order to automate deployments after a pull request is merged. Your GitHub webhook payload looks as follows:

```json
{
    "pull_request": {
        "html_url": "https://github.com/kestra-io/kestra/pull/2834",
        "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}."
    }
}
```

The pull request body contains templated variables `${{ env.MYENV }}` and `${{ secrets.GITHUB_TOKEN }}`, which are not meant to be rendered by Kestra, but by GitHub Actions. Processing this webhook payload with recursive rendering would result in an error, as those variables are not defined in the flow execution context.

In order to retrieve elements such as the `pull_request.body` from that webhook's payload without recursively rendering its content, you can leverage the `render()` function with the `recursive=false` flag:

```yaml
id: pebble_in_webhook
namespace: qa

inputs:
  - name: github_url
    type: STRING
    defaults: https://github.com/kestra-io/kestra/pull/2834

  - name: body
    type: JSON
    defaults: |
      {
        "pull_request": {
            "html_url": "https://github.com/kestra-io/kestra/pull/2834",
            "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"
        }
      }

variables:
  body: "{{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}"
  github_url: "{{ trigger.body.pull_request.html_url ?? trigger.body.issue.html_url ?? inputs.github_url }}"

tasks:
  - id: render_once
    type: io.kestra.core.tasks.log.Log
    message: "{{ render(vars.body, recursive=false) }}"

  - id: not_recursive
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

Only the `render_once` task is relevant for this use case, as it will render the pull request's `body` without recursively rendering its content. The flow includes a recursive and non-recursive configuration for easy comparison.
- The `not_recursive` task will print the `{{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}` expression as a string without rendering it.
- The `recursive` task will fail, as it will try to render the webhook's payload containing templating that cannot be parsed by kestra.

Here is how you can call that flow via curl:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "pull_request": {"html_url": "https://github.com/kestra-io/kestra/pull/2834", "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"} }' \
  http://localhost:8080/api/v1/executions/webhook/qa/pebble_in_webhook/test1234
```

On an instance with multi-tenancy enabled, make sure to also pass the tenant ID in the URL:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "pull_request": {"html_url": "https://github.com/kestra-io/kestra/pull/2834"}, "body": "This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}"} }' \
  http://localhost:8080/api/v1/your_tenant/executions/webhook/qa/pebble_in_webhook/test1234
```

You should see similar output in the logs:

```shell
INFO This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}
INFO {{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}
ERROR io.pebbletemplates.pebble.error.PebbleException: Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
ERROR Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
```