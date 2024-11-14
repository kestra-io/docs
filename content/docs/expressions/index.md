---
title: Expressions
icon: /docs/icons/expression.svg
---

Expressions & Context Variables Reference.

## Overview

Kestra's expressions use [Pebble templating engine](../05.concepts/06.pebble.md) along with flow's execution context variables to dynamically render various flow properties. This page will guide you through different types of expressions and how to use them in your flows.

## Using Expressions

To dynamically render values within your flows, you can add an expression wrapped in curly brackets as follows `{{ your_expression }}`.

Flows, tasks, executions, triggers, and schedules have many built-in expressions. For example:
- `{{ flow.id }}` allows accessing the identifier of a flow within an execution
- `{{ inputs.myinput }}` allows accessing the execution's input value
- `{{ outputs.mytask.myoutput }}` allows accessing the output of a task.

## Flow and Execution expressions

Flow and Execution expressions allow using the current execution context to set task properties. For example, you can use the `{{ execution.startDate }}` within a file name.

Some expressions, such as flow properties (e.g. `flow.id`, `flow.namespace`, etc.), fetch execution metadata stored in the execution context. Other expressions (such as FILE-type inputs and outputs) fetch data stored in Kestra's internal storage or in environment variables.

The execution context includes the following variables:
- `flow`
- `execution`
- `inputs`
- `outputs`
- environment variables available as `envs`
- global variables available as `globals`.

### Default execution context variables
The following table lists default execution context variables available in Kestra:

| Parameter                     | Description                                                                                                                       |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `{{ flow.id }}`               | The identifier of the flow.                                                                                                       |
| `{{ flow.namespace }}`        | The name of the flow namespace.                                                                                                   |
| `{{ flow.tenantId }}`         | The identifier of the tenant (EE only).                                                                                           |
| `{{ flow.revision }}`         | The revision of the flow.                                                                                                         |
| `{{ execution.id }}`          | The execution ID, a generated unique id for each execution.                                                                       |
| `{{ execution.startDate }}`   | The start date of the current execution, can be formatted with `{{ execution.startDate \| date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}`. |
| `{{ execution.originalId }}`  | The original execution ID, this id will never change even in case of replay and keep the first execution ID.                      |
| `{{ task.id }}`               | The current task ID                                                                                                               |
| `{{ task.type }}`             | The current task Type (Java fully qualified class name).                                                                          |
| `{{ taskrun.id }}`            | The current task run ID.                                                                                                          |
| `{{ taskrun.startDate }}`     | The current task run start date.                                                                                                  |
| `{{ taskrun.parentId }}`      | The current task run parent identifier. Only available with tasks inside a Flowable Task.                                         |
| `{{ taskrun.value }}`         | The value of the current task run, only available with tasks wrapped in Flowable Tasks.                                           |
| `{{ taskrun.attemptsCount }}` | The number of attempts for the current task (when retry or restart is performed).                                                 |
| `{{ parent.taskrun.value }}`  | The value of the closest (first) parent task run, only available with tasks inside a Flowable Task.                               |
| `{{ parent.outputs }}`        | The outputs of the closest (first) parent task run Flowable Task, only available with tasks wrapped in a Flowable Task.           |
| `{{ parents }}`               | The list of parent tasks, only available with tasks wrapped in a Flowable Task.                                                   |
| `{{ labels }}`                | The executions labels accessible by keys, for example: `{{ labels.myKey1 }}` .                                                    |

If execution is created from a `Schedule` trigger, these expressions are also available:

| Parameter | Description |
| ---------- | ----------- |
|  `{{ trigger.date }}` | The date of the current schedule. |
|  `{{ trigger.next }}` | The date of the next schedule. |
|  `{{ trigger.previous }}` | The date of the previous schedule. |

If execution is created from a `Flow` trigger, these expressions are also available:

| Parameter | Description |
| ---------- | ----------- |
|  `{{ trigger.executionId }}` | The ID of the execution that triggers the current flow. |
|  `{{ trigger.namespace }}` | The namespace of the flow that triggers the current flow. |
|  `{{ trigger.flowId }}` | The ID of the flow that triggers the current flow. |
|  `{{ trigger.flowRevision }}` | The revision of the flow that triggers the current flow. |

All these expressions can be accessed using the Pebble template syntax `{{ expression }}`:

```yaml
id: expressions
namespace: company.team

tasks:
  - id: echo
    type: io.kestra.plugin.core.debug.Return
    format: |
      taskid: {{ task.id }}
      date: {{  execution.startDate | date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}
```

::alert{type="info"}
`{{ execution.startDate | date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}` uses the `date` filter to format the `execution.startDate` variable with the date pattern `yyyy-MM-dd HH:mm:ss.SSSSSS`.
::

### Environment variables

By default, Kestra allows access to environment variables that start with `KESTRA_` unless configured otherwise in the `variables` [configuration](../configuration/index.md).

To access an environment variable `KESTRA_FOO` from one of your tasks, you can use `{{ envs.foo }}`. The variable's name is the part after the `KESTRA_` prefix in **lowercase**.

### Global variables

You can define global variables in your Kestra's [configuration](../configuration/index.md) and access them using `{{ globals.foo }}`.

### Flow variables

You can declare variables at the flow level in the `variables` property to avoid hardcoing values in your tasks. Then, you can access their values anywhere in the flow using the `vars.my_variable` syntax, for example:

```yaml
id: flow_variables
namespace: company.team

variables:
  my_variable: "my_value"

tasks:
  - id: print_variable
    type: io.kestra.plugin.core.debug.Return
    format: "{{ vars.my_variable }}"
```

### Inputs

You can use any flow inputs using `inputs.inputName`, for example:

```yaml
id: render_inputs
namespace: company.team

inputs:
  - id: myInput
    type: STRING

tasks:
  - id: myTask
    type: io.kestra.plugin.core.debug.Return
    format: "{{ inputs.myInput }}"
```

### Secrets

You can retrieve secrets in your flow using the `secret()` function. Secrets are stored in a secure way and can be accessed as follows:

```yaml
id: use_secret_in_flow
namespace: company.team

tasks:
  - id: myTask
    type: io.kestra.plugin.core.debug.Return
    format: "{{ secret('MY_SECRET') }}"
```

Secrets can be provided on both open-source and [Enterprise Edition](/enterprise). Check the [Secrets](../05.concepts/04.secret.md) documentation for more details.

### Namespace variables (EE)

Namespace variables are key-value pairs defined in a YAML configurtion. They can be nested and used in your flows using the dot notation e.g. `{{ namespace.myproject.myvariable }}`. To define namespace variables, go to `Namespaces` in the Kestra UI, select the namespace, and add the variables in the `Variables` tab.

Namespace variables are scoped to the specific namespace and are inherited by child namespaces. Your flow then refers to these variables using the `namespace.your_variable` syntax, for example:

```yaml
id: namespace_variables
namespace: company.team

tasks:
  - id: myTask
    type: io.kestra.plugin.core.debug.Return
    format: "{{ namespace.your_variable }}"
```

Note that if your namespace variable contains Pebble expressions like e.g. `{{ secret('GITHUB_TOKEN') }}`, you must use the `render` function to render the variable. Assuming the following code has been added to the Variables tab in a Namespace UI:

```yaml
github:
  token: "{{ secret('GITHUB_TOKEN') }}"
```

To reference the `github.token` namespace variable in your flow, you need to wrap it in the `render` function:

```yaml
id: recursive_namespace_variables_rendering
namespace: company.team
tasks:
  - id: myTask
    type: io.kestra.plugin.core.debug.Return
    format: "{{ render(namespace.github.token) }}"
```

The `render()` function is required to parse Namespace or Flow variables that contain Pebble expressions, as this function allows for recursive rendering. If you don't use the `render` function, the variable will be rendered as a string, and the Pebble expressions within the variable will not be evaluated.

### Outputs

You can use any task output attributes using `"{{ outputs.taskId.outputAttribute }}"`, where:
- the `taskId` is the ID of the task
- the `outputAttribute` is the attribute of the task output you want to use; each task can emit various output attributes — check the task documentation for the list of output attributes for any given task.

Example of a flow using `outputs` to pass data between tasks:

```yaml
id: pass_data_between_tasks
namespace: company.team

tasks:
  - id: first
    type: io.kestra.plugin.core.debug.Return
    format: First output value

  - id: second-task
    type: io.kestra.plugin.core.debug.Return
    format: Second output value

  - id: print_both_outputs
    type: io.kestra.plugin.core.log.Log
    message: |
      First: {{ outputs.first.value }}
      Second: {{ outputs['second-task'].value }}
```

::alert{type="info"}
The `Return`-type task has an output attribute `value` which is used by the `print_both_outputs` task.
The `print_both_outputs` task demonstrates two ways to access task outputs:
1. Using the dot notation `{{ outputs.first.value }}`
2. Using the subscript notation `{{ outputs['second-example'].value }}` — the square brackets are needed if your task ID contains special characters, such as hyphens. We generally using the `camelCase` or `snake_case` notations for task IDs to avoid this issue.
::

---

## Pebble templating: example

Pebble templating offers a myriad of ways to parse expressions.

The example below will parse the Pebble expressions within the `variables` based on the `inputs` and `trigger` values. Both variables use the Null-Coalescing Operator `??` to use the first non-null value.

Here, the first variable `trigger_or_yesterday` will evaluate to a `trigger.date` if the flow runs on schedule. Otherwise, it will evaluate to the yesterday's date by using the `execution.startDate` minus one day.

The second variable `input_or_yesterday` will evaluate to the `mydate` input if it's provided. Otherwise, it will evaluate to the yesterday's date calculated using the `execution.startDate` and subtracting one day with the help of the `dateAdd` function.

```yaml
id: render_complex_expressions
namespace: company.team

inputs:
  - id: mydate
    type: DATETIME
    required: false

variables:
  trigger_or_yesterday: "{{ trigger.date ?? (execution.startDate | dateAdd(-1, 'DAYS')) }}"
  input_or_yesterday: "{{ inputs.mydate ?? (execution.startDate | dateAdd(-1, 'DAYS')) }}"

tasks:
  - id: yesterday
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.trigger_or_yesterday) }}"

  - id: input_or_yesterday
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.input_or_yesterday) }}"
```

Note how we use the `render` function to render the variables. This function is required to render a variable that contains Pebble expressions, allowing for recursive rendering. If you don't use the `render` function, the variable will be rendered as a string, and the Pebble expressions within the variable will not be evaluated.

---

## Expression Usage

This page summarizes the main syntax of filters, functions, and control structures available in Pebble templating.


### Syntax Reference

There are two primary delimiters used within a Pebble template: `{{ ... }}` and `{% ... %}`.

`{{ ... }}` is used to output the result of an expression. Expressions can be very simple (ex. a variable name) or much more complex.

`{% ... %}` is used to change the control flow of the template; it can contain an `if`-statement, define a parent template, define a new `block`, etc.

To prevent Pebble from processing a variable with its templating rules, you can use the `raw` tag to escape the delimiters. This will keep Pebble from interpreting expressions or control structures within `{{ ... }}` or `{% ... %}` blocks, allowing the content to be output exactly as written.

You can use the dot (`.`) notation to access child attributes e.g. when dealing with JSON-like map objects. If any nested attribute contains a special character, you can wrap that attribute in square brackets (e.g. `{{ foo['foo-bar'] }}`):

```twig
{{ foo.bar }} # Attribute 'bar' of 'foo'
{{ foo.bar.baz }} # Attribute 'baz' of attribute 'bar' of 'foo'
{{ foo['foo-bar'] }} # Attribute 'foo-bar' of 'foo'
{{ foo['foo-bar']['foo-baz'] }} # Attribute 'foo-baz' of attribute 'foo-bar' of 'foo'
```

::alert{type="warning"}
When using task, variable or output names containing a hyphen symbol `-`, make sure to use the subscript notation (`[]`) e.g. `"{{ outputs.mytask.myoutput['foo-bar'] }}"` because `-` is a special character in the Pebble templating engine.
::

If `foo` would be a List, then `foo[idx]` can be used to access the elements of index `idx` of the foo variable.

### Filters

You can use filters in your expressions using a pipe symbol (`|`). Multiple filters can be chained, and the output of one filter is applied to the next one.

```twig
{{ "When life gives you lemons, make lemonade." | upper | abbreviate(13) }}
```
The above example will output the following:

```twig
WHEN LIFE ...
```

### Functions

Whereas filters are intended to transform existing values, functions are intended to generate new values. Similar to many programming languages, functions are invoked via their name followed by parentheses `function_name()`.

```twig
{{ max(user.score, highscore) }}
```
The above example will output the maximum of the two variables `user.score` and `highscore`.

### Control Structure

Pebble provides several tags for looping and conditional logic.

Example of a `for` loop:

```twig
{% for article in articles %}
    {{ article.title }}
{% else %}
    "There are no articles."
{% endfor %}
```

Example of an `if` statement:

```twig
{% if category == "news" %}
    {{ news }}
{% elseif category == "sports" %}
    {{ sports }}
{% else %}
    "Please select a category"
{% endif %}
```

### Macros

Macros are lightweight, re-usable templates that you can leverage to build custom functions:

```twig
{% macro input(type, name) %}
	{{ name }} is of type {{ type }}
{% endmacro %}
```

The above `macro` will be invoked like a regular function:

```twig
{{ input("text", "hello") }}
# Output: hello is of type text
```

A macro does not have access to the main context; the only variables it can access are its local arguments.

Here is an example flow showing the usage of a macro:

```yaml
id: macro_example
namespace: company.team

tasks:
  - id: log_output
    type: io.kestra.plugin.core.log.Log
    message: |
      {% macro input(type, name) %}{{ name }} is of type {{ type }}{% endmacro %}
      {{ input("text", "John") }}
      {{ input("number", 1) }}
```

### Named Arguments

In filters, functions, or macros, you can use named arguments. Named arguments allow you to be more explicit on which arguments are passed and avoid mandating to pass default values.

```twig
{{ stringDate | date(existingFormat="yyyy-MMMM-d", format="yyyy/MMMM/d") }}
```

Positional arguments can be used in conjunction with named arguments, but all positional arguments must come before any named arguments (similarly to how the same works in Python):

```twig
{{ stringDate | date("yyyy/MMMM/d", existingFormat="yyyy-MMMM-d") }}
```

Named arguments can be used in macros to define default values for unused arguments:

```twig
{% macro input(type="text", name, value) %}
	type is "{{ type }}", name is "{{ name }}", and value is "{{ value }}"
{% endmacro %}

{{ input(name="country") }}

# will output: type is "text", name is "country", and value is ""
```

### Comments

You add comments using the `{# ... #}` delimiters. These comments will not appear in the rendered output.

```twig
{# THIS IS A COMMENT #}
{% for article in articles %}
  {{ article.title }} has content {{ article.content }}
{% endfor %}
```

Keep in mind that in Kestra's YAML syntax, you can also simply use the `#` symbol to add comments.

### Literals

The simplest form of expressions are literals. Literals are Pebble representations for Java types such as strings and numbers.
- `"Hello World"`: Everything between two double or single quotes is a string. You can use a backslash to escape quotation marks within the string.
- `"Hello #{who}"`: String interpolation is also possible using `#{}`. In this example, if the value of the variable `who` is `"world"`, then the expression will be evaluated to `"Hello world"`.
- `100 + 10l * 2.5`: Integers, longs and floating point numbers are similar to their Java counterparts.
- `true` or `false`: Boolean values equivalent to their Java counterparts.
- `null`: Represents no specific value, similar to its Java counterpart; `none` is an alias for null.

### Collections

Both lists and maps can be created directly within the template.
- `["apple", "banana", "pear"]`: A list of strings
- `{"apple":"red", "banana":"yellow", "pear":"green"}`: A map of strings

The collections can contain expressions.

### Math

Pebble allows you to calculate values using basic mathematical operators. The following operators are supported:
- `+`: Addition
- `-`: Subtraction
- `/`: Division
- `%`: Modulus
- `*`: Multiplication

### Logical Operators

You can combine multiple expressions with the following logical operators:
- `and`: Returns true if both operands are true
- `or`: Returns true if either operand is true
- `not`: Negates an expression
- `(...)`: Groups expressions together

### Comparisons

The following comparison operators are supported in any expression: `==`, `!=`, `<`, `>`, `>=`, and `<=`.

```twig
{% if user.age >= 18 %}
  ...
{% endif %}
```

### Tests

The `is` operator performs tests. Tests can be used to test an expression for certain qualities. The right operand is the name of the test:

```twig
{% if 3 is odd %}
  ...
{% endif %}
```

Tests can be negated by using the `is not` operator:

```twig
{% if name is not null %}
  ...
{% endif %}
```


### Conditional (Ternary) Operator

The conditional operator `?` is similar to its Java counterpart:

```twig
{{ foo ? "yes" : "no" }}
```

### Null-Coalescing Operator

The null-coalescing operator allows to quickly test if a variable is defined (exists) and to use an alternative value if not:

```twig
{% set baz = "baz" %}
{{ foo ?? bar ?? baz }}

{# results in: 'baz' #}

{{ foo ?? bar ?? raise }}
{# results: an exception because none of the 3 vars is defined  #}
```

### Operator Precedence

Operators in Pebble are evaluated in a specific order. Here is a list of operators in order of precedence, from highest to lowest:
- `.`
- `|`
- `%`, `/`, `*`
- `-`, `+`
- `==`, `!=`, `>`, `<`, `>=`, `<=`
- `is`, `is not`
- `and`
- `or`.

### Parent tasks with Flowable tasks

When using nested Flowable Tasks, only the direct parent task is accessible via `taskrun.value`. To access a parent task higher up the tree, you can use the `parent` and the `parents` expressions.

The following flow shows how to access the parent tasks:

```yaml
id: each_switch
namespace: company.team

tasks:
  - id: simple
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"

  - id: hierarchy_1
    type: io.kestra.plugin.core.flow.EachSequential
    value: ["a", "b"]
    tasks:
      - id: hierarchy_2
        type: io.kestra.plugin.core.flow.Switch
        value: "{{ taskrun.value }}"
        cases:
          a:
            - id: hierarchy_2_a
              type: io.kestra.plugin.core.debug.Return
              format: "{{ task.id }}"
          b:
            - id: hierarchy_2_b
              type: io.kestra.plugin.core.debug.Return
              format: "{{ task.id }}"

            - id: hierarchy_2_b_second
              type: io.kestra.plugin.core.flow.EachSequential
              value: ["1", "2"]
              tasks:
              - id: switch
                type: io.kestra.plugin.core.flow.Switch
                value: "{{ taskrun.value }}"
                cases:
                  1:
                    - id: switch_1
                      type: io.kestra.plugin.core.debug.Return
                      format: "{{ parents[0].taskrun.value }}"
                  2:
                    - id: switch_2
                      type: io.kestra.plugin.core.debug.Return
                      format: "{{ parents[0].taskrun.value}} {{ parents[1].taskrun.value }}"
  - id: simple_again
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

The `parent` variable gives direct access to the first parent, while the `parents[INDEX]` gives you access to the parent higher up the tree.


---

## Filters

Filters can be used in expressions to perform some transformations on variables such as formatting a date, converting a string to uppercase, or joining a list of strings.

Filters are separated from the variable name by a pipe symbol `|`. Multiple filters can be chained together so that the output of one filter is applied to the next one.

The following example turns the name into title case:
```twig
{{ name | title }}
```

Filters that accept arguments have parentheses around the arguments. This example joins the elements of a list into a string, with list elements separated by commas:
```twig
{{ list | join(', ') }}
```

To apply a filter on a section of code, wrap it with the `filter` tag:

```twig
{% filter lower | title %}
	hello
{% endfilter %}
```


## JSON Filters

JSON filters are used to manipulate JSON objects, often API responses.

### toJson

The `toJson` filter will convert any object to a JSON string.

The following expression `{{ [1, 2, 3] | toJson  }}` will result in the JSON string `'[1, 2, 3]'`.

Similarly:
- `{{ true | toJson }}` will result in `'true'`
- `{{ "foo" | toJson }}` will result in `'"foo"'`

::alert{type="info"}
If you were using Kestra in a version prior to [v0.18.0](/blogs/2024-08-06-release-0-18.md), this filter used to be named `json`. We've renamed it to `toJson` for more clarity. The renaming has been implemented in a non-breaking way — using `json` will raise a warning in the UI but it will still work.
::


### jq

The `jq` filter apply a [JQ expression](https://stedolan.github.io/jq/) to a variables. The filter always return an array of result and will be formatted as json. You can use the filter [first](./object.md#first) in order to return the first (and potentially the only) result of the jq filter.

```twig
{{ [1, 2, 3] | jq('.')  }}
{# results in: '[1, 2, 3]' #}

{{ [1, 2, 3] | jq('.[0]') | first }}
{# results in: '1' #}
```


Another example, if the current context is:
```json
{
  "outputs": {
    "task1": {
      "value": 1,
      "text": "awesome1"
    },
    "task2": {
      "value": 2,
      "text": "awesome2"
    }
  }
}
```

```twig
{{ outputs | jq('.task1.value') | first }}
```

the output will be `1`.


**Arguments**
- `expression`: the jq expression to apply

### Manipulating JSON payload

Here is a detailed example having multiple JSON manipulations. In this example, we take a JSON payload as input, and perform multiple manipulations on it to derive different outputs.

```yaml
id: myflow
namespace: company.myteam

inputs:
  - id: payload
    type: JSON
    defaults: |-
      {
        "name": "John Doe",
        "score": {
          "English": 72,
          "Maths": 88,
          "French": 95,
          "Spanish": 85,
          "Science": 91
        },
        "address": {
          "city": "Paris",
          "country": "France"
        },
        "graduation_years": [2020, 2021, 2022, 2023]
      }

tasks:
  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message:
      - "Student name: {{ inputs.payload.name }}" # Extracting a value from a JSON payload
      - "Score in languages: {{ inputs.payload.score.English + inputs.payload.score.French + inputs.payload.score.Spanish }}" # Extracting the numbers from JSON payload, and suming them up
      - "Total subjects: {{ inputs.payload.score | length }}" # Counting the length of map
      - "Total score: {{ inputs.payload.score | values | jq('reduce .[] as $num (0; .+$num)') | first }}" # logic to get all the values in the `score` map and add them to get the total score
      - "Complete address: {{ inputs.payload.address.city }}, {{ inputs.payload.address.country | upper }}" # String concatenation, and conversion
      - "Total years for graduation: {{ inputs.payload.graduation_years | length }}" # Counting the length of array
      - "Started college in: {{ inputs.payload.graduation_years | first }}" # Getting the first value from an array
      - "Completed college in: {{ inputs.payload.graduation_years | last }}" # Getting the last value from an array
```

This flow will log the following statements:

```
Student name: John Doe
Score in languages: 252
Total subjects: 5
Total score: 431
Complete address: Paris, FRANCE
Total years for graduation: 4
Started college in: 2020
```

---

## Numeric Filters

Numeric filters are used to format numbers or convert strings to numbers.

Each section below represents a built-in filter.

- [abs](#abs)
- [number](#number)
- [numberFormat](#numberformat)

### abs

The `abs` filter is used to obtain the absolute value.

```twig
{{ -7 | abs }}

{# output: 7 #}
```

### number

The `number` filter return a parsed number from a string. If no type is passed, we try to infer the appropriate type.


```twig
{{ "12.3" | number | className }}
{# will output: java.lang.Float #}

{{ "9223372036854775807" | number('BIGDECIMAL') | className }}
{# will output: java.math.BigDecimal #}
```

**Arguments**
- type:
  - `INT`
  - `FLOAT`
  - `LONG`
  - `DOUBLE`
  - `BIGDECIMAL`
  - `BIGINTEGER`

### numberFormat

The `numberFormat` filter is used to format a decimal number. Behind the scenes it uses `java.text.DecimalFormat`.
```twig
{{ 3.141592653 | numberFormat("#.##") }}
```
The above example will output the following:
```twig
3.14
```

**Arguments**
- format

### replace

The `replace` filter formats a given string by replacing the placeholders (placeholders are free-form) or using regular expression:
```twig
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
```

```twig
{{ 'aa1bb2cc3dd4ee5' | replace({'(\d)': '-$1-'}, regexp=true) }}
```

**Arguments**
- `replace_pairs`: an object with key the search string and value the replace string
- `regexp`: use regexp for search and replace pattern (default is `false`)

---

## Object Filters (Maps, Arrays and More)

Object filters help you manipulate maps and arrays.

Each section below represents a built-in filter.

- [chunk](#chunk)
- [className](#classname)
- [first](#first)
- [join](#join)
- [keys](#keys)
- [last](#last)
- [merge](#merge)
- [reverse](#reverse)
- [rsort](#rsort)
- [slice](#slice)
- [sort](#sort)
- [split](#split)

### chunk

The `chunk` filter returns partitions of `size` from a list.
```twig
{{ [[1,2,3,4,5,6,7,8,9]] | chunk(2) }}
{# results in: '[[1,2],[3,4],[5,6],[7,8],[9]]' #}
```

**Arguments**
- `size`: the size of the chunk

### className

The `className` filter return a string with the current class name.

```twig
{{ "12.3" | number | className }}
{# will output: java.lang.Float #}
```

### first

The `first` filter will return the first item of a collection, or the first letter of a string.

```twig
{{ users | first }}
{# will output the first item in the collection named 'users' #}

{{ 'Mitch' | first }}
{# will output 'M' #}
```

### join

The `join` filter will concatenate all items of a collection into a string. An optional argument can be given
to be used as the separator between items.

```twig
{#
    List<String> names = new ArrayList<>();
    names.add("Alex");
    names.add("Joe");
    names.add("Bob");
#}
{{ names | join(',') }}
{# will output: Alex,Joe,Bob #}
```

**Arguments**
- separator

### keys

The `keys` filter will return the keys from a collection, or list of index of an array.

```twig
{{ {'this': 'foo', 'that': 'bar'} | keys }}
{# will output the keys from this map '['this', 'that']' #}


{{ [0, 1, 3] | keys }}
{# will output the key from this array '[0, 1, 2]' #}
```

### values

The `values` filter will return the values from a map:

```twig
{{ {'this': 'foo', 'that': 'bar'} | values }}
{# will output the values from this map '['foo', 'bar']' #}
```

Here is how you can test that expression in a flow:

```yaml
id: expression
namespace: company.myteam
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ {'this': 'foo', 'that': 'bar'} | values }}"
```

### last

The `last` filter will return the last item of a collection, or the last letter of a string.
```twig
{{ users | last }}
{# will output the last item in the collection named 'users' #}

{{ 'Mitch' | last }}
{# will output 'h' #}
```

### length

The `length` filter returns the number of items of collection, map or the length of a string:

```twig
{% if users | length > 10 %}
    ...
{% endif %}
```

### merge

The `merge` filter merge items of type Map, List or Array:
```twig
{{ [1, 2] | merge([3, 4]) }}
```

### reverse

The `reverse` filter reverses a List:
```twig
{% for user in users | reverse %} {{ user }} {% endfor %}
```

### rsort

The `rsort` filter will sort a list in reversed order. The items of the list must implement `Comparable`.
```twig
{% for user in users | rsort %}
	{{ user.name }}
{% endfor %}
```

### slice

The `slice` filter returns a portion of a list, array, or string.
```twig
{{ ['apple', 'peach', 'pear', 'banana'] | slice(1,3) }}
{# results in: [peach, pear] #}


{{ 'Mitchell' | slice(1,3) }}
{# results in: 'it' #}
```

**Arguments**
- `fromIndex`: 0-based and inclusive
- `toIndex`: 0-based and exclusive

### sort

The `sort` filter will sort a list. The items of the list must implement `Comparable`.
```twig
{% for user in users | sort %}
	{{ user.name }}
{% endfor %}
```

### split

The `split` filter splits a string by the given delimiter and returns a list of strings.
```twig
{% set foo = "one,two,three" | split(',') %}
{# foo contains ['one', 'two', 'three'] #}
```

You can also pass a limit argument:
- If `limit` is positive, then the pattern will be applied at most n - 1 times, the array's length will be no greater than n, and the array's last entry will contain all input beyond the last matched delimiter;
- If `limit` is negative, then the pattern will be applied as many times as possible and the array can have any length;
- If `limit` is zero, then the pattern will be applied as many times as possible, the array can have any length, and trailing empty strings will be discarded;

```twig
{% set foo = "one,two,three,four,five" | split(',', 3) %}
{# foo contains ['one', 'two', 'three,four,five'] #}
```

**Arguments**
- delimiter: The delimiter
- limit: The limit argument

---

## String Filters

String filters are used to manipulate strings i.e. textual data.

Each section below represents a built-in filter.

- [abbreviate](#abbreviate)
- [base64decode](#base64decode)
- [base64encode](#base64encode)
- [capitalize](#capitalize)
- [default](#default)
- [escapeChar](#escapechar)
- [lower](#lower)
- [replace](#replace)
- [sha256](#sha256)
- [startsWith](#startswith)
- [slugify](#slugify)
- [substringAfter](#substringafter)
- [substringAfterLast](#substringafterlast)
- [substringBefore](#substringbefore)
- [substringBeforeLast](#substringbeforelast)
- [title](#title)
- [trim](#trim)
- [upper](#upper)
- [urldecode](#urldecode)
- [urlencode](#urlencode)

### abbreviate

The `abbreviate` filter will abbreviate a string using an ellipsis. It takes one argument which is the max
width of the desired output including the length of the ellipsis.

```twig
{{ "this is a long sentence." | abbreviate(7) }}
```

The above example will output the following:

```twig
this...
```

**Arguments**
- length


### base64decode

The `base64decode` filter takes the given input, base64-decodes it, and returns the byte array converted to UTF-8 string.

Applying the filter on an incorrect base64-encoded string will throw an exception.

```twig
{{ "dGVzdA==" | base64decode }}
```

The above example will output the following:

```
test
```

### base64encode

The `base64encode` filter takes the given input, converts it to an UTF-8 String (`.toString()`) and Base64-encodes it.

```twig
{{ "test" | base64encode }}
```

The above example will output the following:
```
dGVzdA==
```

### capitalize

The `capitalize` filter will capitalize the first letter _of the string_.
```twig
{{ "article title" | capitalize }}
```

The above example will output the following:

```twig
Article title
```

### title

The `title` filter will capitalize the first letter _of each word_.

```twig
{{ "article title" | title }}
```

The above example will output the following:
```twig
Article Title
```

### default

The `default` filter will render a default value if and only if the object being filtered is empty.
A variable is empty if it is null, an empty string, an empty collection, or an empty map.

```twig
{{ user.phoneNumber | default("No phone number") }}
```

In the following example, if `foo`, `bar`, or `baz` are null the output will become an empty string which is a perfect use case for the default filter:
```twig
{{ foo.bar.baz | default("No baz") }}
```

Note that the default filter will suppress any `AttributeNotFoundException` exceptions that will usually be thrown.

**Arguments**
- default

### escapeChar

The `escapeChar` filter sanitizes given string using a selected string escape sequence.

Precede every `'` character with `\`:

```twig
{{ "Can't be here" | escapeChar('single') }}
{# results in: Can\'t be here #}
```

Precede every `"` character with `\`:

```twig
{{ '"Quoted"' | escapeChar('double') }}
{# results in: \"Quoted\" #}
```

Safely pass a rendered Pebble variable as literal value to a shell, replacing every `'` character with the `'\''` escape sequence:

```twig
{# inputs.param value set to: Can't be here #}
echo '{{ inputs.param | escapeChar('shell') }}'
{# results in: echo 'Can'\''t be here' #}
```

**Arguments**

- `type`: escape sequence type `single`, `double`, or `shell`

### lower

The `lower` filter makes an entire string lower case.

```twig
{{ "THIS IS A LOUD SENTENCE" | lower }}
```

The above example will output the following:
```twig
this is a loud sentence
```

### replace

The `replace` filter formats a given string by replacing the placeholders (placeholders are free-form) or using regular expression:
```twig
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
```

```twig
{{ 'aa1bb2cc3dd4ee5' | replace({'(\d)': '-$1-'}, regexp=true) }}
```

**Arguments**
- `replace_pairs`: an object with key the search string and value the replace string
- `regexp`: use regexp for search and replace pattern (default is `false`)

### sha256

The `sha256` filter returns the SHA-256 hash of the given UTF-8 String.

```twig
{{ "test" | sha256 }}
```

The above example will output the following:
```
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

### startsWith

The `startsWith()` filter returns `true` if the input string starts with the specified prefix. This filter is useful for string comparisons and conditional logic in your workflows.

```yaml
id: compare_strings
namespace: company.team

inputs:
  - id: myvalue
    type: STRING
    defaults: "hello world!"

tasks:
  - id: log_true
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | startsWith('hello') }}"

  - id: log_false
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | startsWith('Hello') }}"
```

### slugify

The `slugify` filter removes non-word characters (alphanumerics and underscores) and converts spaces to hyphen. Also strips leading and trailing whitespace.

```twig
{{ "Joel is a slug" | slugify }}
{# will output 'joel-is-a-slug' #}
```

### substringAfter

The `substringAfter` filter returns the substring before the first occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringAfter('.') }}
{# results in: 'b.c' #}
```

**Arguments**
- `separator`: the string to search for

### substringAfterLast

The `substringAfterLast` filter returns the substring after the last occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringAfterLast('.') }}
{# results in: 'c' #}
```

**Arguments**
- `separator`: the string to search for

### substringBefore

The `substringBefore` filter returns the  substring before the first occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringBefore('.') }}
{# results in: 'a' #}
```

**Arguments**
- `separator`: the string to search for

### substringBeforeLast

The `substringBeforeLast` filter returns the substring before the last occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringBeforeLast('.') }}
{# results in: 'a.b' #}
```

**Arguments**
- `separator`: the string to search for

### trim

The `trim` filter is used to trim whitespace off the beginning and end of a string.
```twig
{{ "    This text has too much whitespace.    " | trim }}
```

The above example will output the following:
```twig
This text has too much whitespace.
```

### upper

The `upper` filter makes an entire string upper case.

```twig
{{ "this is a quiet sentence." | upper }}
```

The above example will output the following:
```twig
THIS IS A QUIET SENTENCE.
```

### urldecode

The `urldecode` translates a string into `application/x-www-form-urlencoded` format using the "UTF-8" encoding scheme.

```twig
{{ "The+string+%C3%BC%40foo-bar" | urldecode }}
```

The above example will output the following:
```twig
The string ü@foo-bar
```

### urlencode

The `urlencode` translates a string into `application/x-www-form-urlencoded` format using the "UTF-8" encoding scheme.

```twig
{{ "The string ü@foo-bar" | urlencode }}
```

The above example will output the following:
```twig
The+string+%C3%BC%40foo-bar
```

---

## Temporal Filters

Temporals filters are used to format dates and timestamps.

- [date](#date)
- [dateAdd](#dateadd)
- [timestamp](#timestamp)
- [timestampMicro](#timestampmicro)
- [timestampNano](#timestampnano)

### date

The `date` filter formats a date in a variety of formats. It can handle `java.util.Date`,
Java 8 `java.time` constructs like `OffsetDateTime` and timestamps in milliseconds from the epoch.
The filter will construct a `java.text.SimpleDateFormat` or `java.time.format.DateTimeFormatter` using the provided
pattern and then use this newly created format to format the provided date object. If you don't provide a pattern,
either `DateTimeFormatter.ISO_DATE_TIME` or `yyyy-MM-dd'T'HH:mm:ssZ` will be used.

```twig
{{ user.birthday | date("yyyy-MM-dd") }}
```

An alternative way to use this filter is to use it on a string but then provide two arguments:
the first is the desired pattern for the output, and the second is the existing format used to parse the
input string into a `java.util.Date` object.

```twig
{{ "July 24, 2001" | date("yyyy-MM-dd", existingFormat="MMMM dd, yyyy") }}
```

The above example will output the following:
```twig
2001-07-24
```

**Time zones**

If the provided date has time zone info (e.g. `OffsetDateTime`) then it will be used. If the provided date has no
time zone info, by default the system time zone will be used. If you need to use a specific
time zone then you can pass in a `timeZone` parameter any string that's understood by `ZoneId` / `ZoneInfo`:
```twig
{# the timeZone parameter will be ignored #}
{{ someOffsetDateTime | date("yyyy-MM-dd'T'HH:mm:ssX", timeZone="UTC") }}
{# the provided time zone will override the system default #}
{{ someInstant | date("yyyy-MM-dd'T'HH:mm:ssX", timeZone="Pacific/Funafuti") }}
```

**format & existingFormat**

Format can be:
- [DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) format
- `iso` = `yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX`
- `iso_sec` = `yyyy-MM-dd'T'HH:mm:ssXXX`
- `sql` = `yyyy-MM-dd HH:mm:ss.SSSSSS`
- `sql_seq` = `yyyy-MM-dd HH:mm:ss`
- `iso_date_time`
- `iso_date`
- `iso_time`
- `iso_local_date`
- `iso_instant`
- `iso_local_date_time`
- `iso_local_time`
- `iso_offset_time`
- `iso_ordinal_date`
- `iso_week_date`
- `iso_zoned_date_time`
- `rfc_1123_date_time`

**Arguments**
- `format`: the output format
- `existingFormat`: the input format if the based variable is a string
- `timeZone`:  the timezone to use
- `locale`: the locale to use

### dateAdd

The `dateAdd` filter adds a unit and formats a date with the same behavior as [date](#date) filters.

```twig
{{ user.birthday | dateAdd(-1, 'DAYS') }}
```

**Arguments**
- amount: an integer value positive or negative
- unit:
  - `NANOS`
  - `MICROS`
  - `MILLIS`
  - `SECONDS`
  - `MINUTES`
  - `HOURS`
  - `HALF_DAYS`
  - `DAYS`
  - `WEEKS`
  - `MONTHS`
  - `YEARS`
  - `DECADES`
  - `CENTURIES`
  - `MILLENNIA`
  - `ERAS`
- format: see [date](#date)
- existingFormat [date](#date)
- timeZone [date](#date)
- locale [date](#date)


### timestamp

The `timestamp` filter will convert a date to a unix timestamps in second. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.


```twig
{{ now() | timestamp(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone


### timestampMicro

The `timestampMicro` filter will convert a date to a unix timestamps in microsecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.


```twig
{{ now() | timestampMicro(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone

### timestampNano

The `timestampNano` filter will convert a date to a unix timestamps in nanosecond. You can convert a string with `existingFormat` and change `timeZone` with same arguments from [date](#date) filter.

```twig
{{ now() | timestampNano(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone

---

## Temporal Filters in action

Let us create a sample flow to understand the temporal filters.

```yaml
id: temporal-dates
namespace: company.myteam

tasks:
  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message:
      - "Present timestamp: {{ now() }}"
      - "Formatted timestamp: {{ now() | date('yyyy-MM-dd') }}"
      - "Previous day: {{ now() | dateAdd(-1, 'DAYS') }}"
      - "Next day: {{ now() | dateAdd(1, 'DAYS') }}"
      - "Different timezone: {{ now() | timestamp(timeZone='Asia/Kolkata') }}"
      - "Different timezone (in macro): {{ now() | timestampMicro(timeZone='Asia/Kolkata') }}"
      - "Different timezone (in nano): {{ now() | timestampNano(timeZone='Asia/Kolkata') }}"
```

The logs of this flow will be:

```
Present timestamp: 2024-07-09T06:17:01.171193Z
Formatted timestamp: 2024-07-09
Previous day: 2024-07-08T06:17:01.174686Z
Next day: 2024-07-10T06:17:01.176138Z
Different timezone: 1720505821
Different timezone (in macro): 1720505821000180275
Different timezone (in nano): 1720505821182413000
```

---

## YAML Filters

YAML filters are used to turn YAML strings into objects.


### yaml

This filter, added in [kestra 0.16.0](https://github.com/kestra-io/kestra/pull/3283), is used to parse a YAML string into an object. That object can then be transformed using the Pebble templating engine.

The filter is useful when working with the [TemplatedTask](/plugins/tasks/templating/io.kestra.plugin.core.templating.TemplatedTask) added in [#3191](https://github.com/kestra-io/kestra/pull/3191).


```twig
{{ "foo: bar" | yaml }}
```

::collapse{title="Full workflow example using the filter in a templated task"}

```yaml
id: yaml_filter
namespace: company.team

labels:
  label: value

inputs:
  - name: string
    type: STRING
    required: false
    defaults: "string"

  - name: int
    type: INT
    required: false
    defaults: 123

  - name: bool
    type: BOOLEAN
    required: false
    defaults: true

  - name: float
    type: FLOAT
    required: false
    defaults: 1.23

  - name: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - name: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - name: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - name: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

  - name: nested.object
    type: STRING
    required: false
    defaults: "value"

  - name: nested.object.child
    type: STRING
    required: false
    defaults: "value"

variables:
  string: "string"
  int: 123
  bool: true
  float: 1.23
  instant: "1918-02-24T00:00:00Z"
  date: "1991-08-20"
  time: "23:59:59"
  duration: "PT5M6S"
  json:
    string: string
    integer: 123
    float: 1.23
    boolean: false
    'null':
    object: {}
    array:
      - string
      - 123
      - 1.23
      - false
      -
      - {}
      - []
  uri: "https://kestra.io"
  object:
    key: "value"
    child:
      key: "value"
  array:
    - Value 1
    - Value 2
    - Value 3
  yaml: |
    string: string
    integer: 123
    float: 1.23
    boolean: false
    'null':
    object: {}
    array:
      - string
      - 123
      - 1.23
      - false
      -
      - {}
      - []

tasks:
  - id: yaml_filter
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ "string" | yaml }}
      {{ 1 | yaml }}
      {{ 1.123 | yaml }}
      {{ true | yaml }}
      {{ 1 | yaml }}
      {{ [1, true, "string", [0, false, "string"]] | yaml }}
      {{ {"key": "value", "object": {"a":"b"}} | yaml }}

  - id: yaml_kestra
    type: "io.kestra.plugin.core.log.Log"
    disabled: false
    message: |
      ---
      # flow
      {{ flow       ?? null | yaml }}
      ---
      # execution
      {{ execution ?? null | yaml }}
      ---
      # task
      {{ task      ?? null | yaml }}
      ---
      # taskrun
      {{ taskrun   ?? null | yaml }}
      ---
      # parent
      {{ parent    ?? null | yaml }}
      ---
      # parents
      {{ parents   ?? null | yaml }}
      ---
      # trigger
      {{ trigger   ?? null | yaml }}
      ---
      # vars
      {{ vars      ?? null | yaml }}
      ---
      # inputs
      {{ inputs    ?? null | yaml }}
      ---
      # outputs
      {{ outputs   ?? null | yaml }}
      ---
      # labels
      {{ labels    ?? null | yaml }}


  - id: yaml_function
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ yaml(vars.yaml) }}

  - id: yaml2yaml
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ yaml(vars.yaml) | yaml }}
```
::

### indent

When constructing YAML from multiple objects, this filter can apply indentation to strings, adding `amount` number of spaces before each line except for the first line.

The `prefix` property defines what is used to indent the lines. By default, prefix is `" "` (a space).

The syntax:

```twig
indent(amount, prefix=" ")
```

### nindent

Use `nindent` to add a new line (hence the `n` in `nindent`) before the code and then indent all lines by adding `amount` number of spaces before each line. The `amount` is a required property defining how many times prefix is repeated before each line.

The `prefix` property defines what is used to indent the lines. By default, prefix is `" "` (a space).

The syntax:

```twig
nindent(amount, prefix=" ")
```

::collapse{title="Full workflow example using the indent filter"}

```yaml
id: templated_task
namespace: company.team

labels:
  my-label: "will-be-sent-to-k8s"
  other-label: "value"

inputs:
  # using nested inputs to define types and default values for `resources` object
  - name: resources.limits.cpu
    type: STRING
    defaults: "1"
    required: true

  - name: resources.limits.memory
    type: STRING
    defaults: "1000Mi"
    required: true

  - name: resources.requests.cpu
    type: STRING
    required: false # optional; it can be skipped when running the flow

  - name: resources.requests.memory
    type: STRING
    required: false # optional; it can be skipped when running the flow

# using variables to explicitly define lists
variables:
  env: # is presented as a list of objects
    - name: "var_string"
      value: "VALUE"
    - name: "var_int"
      value: 123

tasks:
  - id: dynamic
    type: io.kestra.plugin.core.templating.TemplatedTask
    spec: |
      id: "{{ flow.namespace | slugify }}-{{ flow.id | slugify }}"
      type: io.kestra.plugin.kubernetes.PodCreate
      namespace: kestra
      metadata:
        labels:
          {{ labels | yaml | indent(4) }} # indenting from the next line, 4 spaces here
      spec:
        containers:
        - name: debug
          image: alpine:latest
          env: {{ variables.env | yaml | indent(6) }} # adding a newline and indenting at 6 spaces
          command:
            - 'bash'
            - '-c'
            - 'printenv'
        resources:
          {{ inputs.resources | yaml | indent(2, "  ") }} # indenting from the next line by 2 times "  " (two spaces)
```
::


::collapse{title="Sample code for testing the indent filter"}

```yaml
id: indent_filter
namespace: company.team

labels:
  label: value

inputs:
  - id: string
    type: STRING
    required: false
    defaults: "string"

  - id: int
    type: INT
    required: false
    defaults: 123

  - id: bool
    type: BOOLEAN
    required: false
    defaults: true

  - id: float
    type: FLOAT
    required: false
    defaults: 1.23

  - id: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - id: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - id: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - id: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

variables:
  inputEmptyLines: "\n\n"
  inputString: 'string'
  inputInteger: 1
  inputStringWithCRLF: "first line\r\nsecond line"
  inputStringWithLF: "first line\nsecond line"
  inputStringWithCR: "first line\rsecond line"
  inputWithTab: "first line\nsecond line"

  indentEmptyLines: "\n  \n  "
  indentString: "string"
  indentInteger: "1"
  indentStringWithCRLF: "first line\r\n  second line"
  indentStringWithLF: "first line\n  second line"
  indentStringWithCR: "first line\r  second line"
  indentWithTab: "first line\n\t\tsecond line"

tasks:
  - id: debug
    description: "Debug task run"
    type: "io.kestra.plugin.core.log.Log"
    level: INFO
    message: |
      {
        "flow"      : {{ flow      ?? 'null' }},
        "execution" : {{ execution ?? 'null' }},
        "task"      : {{ task      ?? 'null' }},
        "taskrun"   : {{ taskrun   ?? 'null' }},
        "parent"    : {{ parent    ?? 'null' }},
        "parents"   : {{ parents   ?? 'null' }},
        "trigger"   : {{ trigger   ?? 'null' }},
        "vars"      : {{ vars      ?? 'null' }},
        "inputs"    : {{ inputs    ?? 'null' }},
        "outputs"   : {{ outputs   ?? 'null' }},
        "labels"    : {{ labels    ?? 'null' }}
      }

  - id: inputs-string
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.string | indent(2)) == "" + inputs.string  }} - {{ inputs.string | indent(2) }}

  - id: inputs-int
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.int | indent(2)) == "" + inputs.int  }} - {{ inputs.int | indent(2) }}

  - id: inputs-bool
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.bool | indent(2)) == "" + inputs.bool  }} - {{ inputs.bool | indent(2) }}

  - id: inputs-float
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.float | indent(2)) == "" + inputs.float  }} - {{ inputs.float | indent(2) }}

  - id: inputs-instant
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.instant | indent(2)) == "" + inputs.instant  }} - {{ inputs.instant | indent(2) }}

  - id: inputs-date
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.date | indent(2)) == "" + inputs.date  }} - {{ inputs.date | indent(2) }}

  - id: inputs-json
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.json | indent(2)) == "" + inputs.json  }} - {{ inputs.json | indent(2) }}

  - id: inputs-uri
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.uri | indent(2)) == "" + inputs.uri  }} - {{ inputs.uri | indent(2) }}

  - id: variables-inputNull
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (null | indent(2)) == "" }} - {{ (null | indent(2)) }}

  - id: variables-inputEmpty
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ ("" | indent(2)) == "" }} - {{ ("" | indent(2)) }}

  - id: variables-inputEmptyLines
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputEmptyLines | indent(2)) == vars.indentEmptyLines }} - {{ (vars.inputEmptyLines | indent(2)) }}

  - id: variables-inputString
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputString | indent(2)) == vars.indentString }} - {{ (vars.inputString | indent(2)) }}

  - id: variables-inputInteger
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputInteger | indent(2)) == vars.indentInteger }} - {{ (vars.inputInteger | indent(2)) }}

  - id: variables-inputStringWithCRLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCRLF | indent(2)) == vars.indentStringWithCRLF }} - {{ (vars.inputStringWithCRLF | indent(2)) }}

  - id: variables-inputStringWithLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithLF | indent(2)) == vars.indentStringWithLF }} - {{ (vars.inputStringWithLF | indent(2)) }}

  - id: variables-inputStringWithCR
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCR | indent(2)) == vars.indentStringWithCR }} - {{ (vars.inputStringWithCR | indent(2)) }}

  - id: variables-inputWithTab
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputWithTab | indent(2)) == vars.indentWithTab }} - {{ (vars.inputWithTab | indent(2, "\t")) }}
```
::

::collapse{title="Sample code for testing the nindent filter"}

```yaml
id: nindent_filter
namespace: company.team

labels:
  label: value

inputs:
  - id: string
    type: STRING
    required: false
    defaults: "string"

  - id: int
    type: INT
    required: false
    defaults: 123

  - id: bool
    type: BOOLEAN
    required: false
    defaults: true

  - id: float
    type: FLOAT
    required: false
    defaults: 1.23

  - id: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - id: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - id: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - id: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

variables:
  inputEmptyLines: "\n\n"
  inputString: 'string'
  inputInteger: 1
  inputStringWithCRLF: "first line\r\nsecond line"
  inputStringWithLF: "first line\nsecond line"
  inputStringWithCR: "first line\rsecond line"
  inputWithTab: "first line\nsecond line"

  nindentEmptyLines: "\n  \n  \n  "
  nindentString: "\n  string"
  nindentInteger: "\n  1"
  nindentStringWithCRLF: "\r\n  first line\r\n  second line"
  nindentStringWithLF: "\n  first line\n  second line"
  nindentStringWithCR: "\r  first line\r  second line"
  nindentWithTab: "\n\t\tfirst line\n\t\tsecond line"


tasks:
  - id: debug
    description: "Debug task run"
    type: "io.kestra.plugin.core.log.Log"
    level: INFO
    # disabled: true
    message: |
      {
        "flow"      : {{ flow      ?? 'null' }},
        "execution" : {{ execution ?? 'null' }},
        "task"      : {{ task      ?? 'null' }},
        "taskrun"   : {{ taskrun   ?? 'null' }},
        "parent"    : {{ parent    ?? 'null' }},
        "parents"   : {{ parents   ?? 'null' }},
        "trigger"   : {{ trigger   ?? 'null' }},
        "vars"      : {{ vars      ?? 'null' }},
        "inputs"    : {{ inputs    ?? 'null' }},
        "outputs"   : {{ outputs   ?? 'null' }},
        "labels"    : {{ labels    ?? 'null' }}
      }

  - id: inputs-string
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.string | nindent(2)) == "" + inputs.string  }} - {{ inputs.string | nindent(2) }}

  - id: inputs-int
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.int | nindent(2)) == "" + inputs.int  }} - {{ inputs.int | nindent(2) }}

  - id: inputs-bool
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.bool | nindent(2)) == "" + inputs.bool  }} - {{ inputs.bool | nindent(2) }}

  - id: inputs-float
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.float | nindent(2)) == "" + inputs.float  }} - {{ inputs.float | nindent(2) }}

  - id: inputs-instant
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.instant | nindent(2)) == "" + inputs.instant  }} - {{ inputs.instant | nindent(2) }}

  - id: inputs-date
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.date | nindent(2)) == "" + inputs.date  }} - {{ inputs.date | nindent(2) }}

  - id: inputs-json
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.json | nindent(2)) == "" + inputs.json  }} - {{ inputs.json | nindent(2) }}

  - id: inputs-uri
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.uri | nindent(2)) == "" + inputs.uri  }} - {{ inputs.uri | nindent(2) }}

  - id: variables-inputNull
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (null | nindent(2)) == "" }} - {{ (null | nindent(2)) }}

  - id: variables-inputEmpty
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ ("" | nindent(2)) == "" }} - {{ ("" | nindent(2)) }}

  - id: variables-inputEmptyLines
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputEmptyLines | nindent(2)) == vars.nindentEmptyLines }} - {{ (vars.inputEmptyLines | nindent(2)) }}

  - id: variables-inputString
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputString | nindent(2)) == vars.nindentString }} - {{ (vars.inputString | nindent(2)) }}

  - id: variables-inputInteger
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputInteger | nindent(2)) == vars.nindentInteger }} - {{ (vars.inputInteger | nindent(2)) }}

  - id: variables-inputStringWithCRLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCRLF | nindent(2)) == vars.nindentStringWithCRLF }} - {{ (vars.inputStringWithCRLF | nindent(2)) }}

  - id: variables-inputStringWithLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithLF | nindent(2)) == vars.nindentStringWithLF }} - {{ (vars.inputStringWithLF | nindent(2)) }}

  - id: variables-inputStringWithCR
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCR | nindent(2)) == vars.nindentStringWithCR }} - {{ (vars.inputStringWithCR | nindent(2)) }}

  - id: variables-inputWithTab
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputWithTab | nindent(2)) == vars.nindentWithTab }} - {{ (vars.inputWithTab | nindent(2, "\t")) }}
```
::

---

## Function

Functions can be called to generate content. Functions are called by their name followed by parentheses `()` and may have arguments.

For instance, the range function returns a list containing an arithmetic progression of integers:

```twig
{% for i in range(0, 3) %}
{{ i }},
{% endfor %}
```

Each header below represents a built-in function.

### block

The `block` function is used to render the contents of a block more than once. It is not to be confused
with the block *tag* which is used to declare blocks.

The following example will render the contents of the "post" block twice; once where it was declared
and again using the `block` function:
```twig
{% block "post" %} content {% endblock %}

{{ block("post") }}
```
The above example will output the following:
```
content

content
```

### currentEachOutput

The `currentEachOutput` function retrieves the current output of a sibling task when using an [EachSequential](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachSequential) task.

Look at the following flow:

```yaml
tasks:
  - id: each
    type: io.kestra.plugin.core.flow.EachSequential
    tasks:
      - id: first
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}}"
      - id: second
        type: io.kestra.plugin.core.debug.Return
        format: "{{ outputs.first[taskrun.value].value }}"
    value: ["value 1", "value 2", "value 3"]
```

To retrieve the output of the `first` task from the `second` task, you need to use the special `taskrun.value` variable to lookup for the execution of the `first` task that is on the same sequential execution as the `second` task.
And when there are multiple levels of EachSequential, you must use the special `parents` variable to lookup the correct execution. For example, `outputs.first[parents[1].taskrun.value][parents[0].taskrun.value]` for a 3-level EachSequential.

The `currentEachOutput` function will facilitate this by looking up the current output of the sibling task, so you don't need to use the special variables `taskrun.value` and `parents`.

The previous example can be rewritten as follow:

```yaml
tasks:
  - id: each
    type: io.kestra.plugin.core.flow.EachSequential
    tasks:
      - id: first
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}}"
      - id: second
        type: io.kestra.plugin.core.debug.Return
        format: "{{ currentEachOutput(outputs.first).value }}"
    value: ["value 1", "value 2", "value 3"]
```

And this works no matter the number of levels of EachSequential tasks used.

### fromJson

The `fromJson` function will convert any JSON string to an object allowing to access its properties using the dot notation:

```twig
{{ fromJson('[1, 2, 3]')[0] }}
{# results in: '1' #}

{{ fromJson('{"foo": [666, 1, 2]}').foo[0] }}
{# results in: '666' #}

{{ fromJson('{"bar": "\u0063\u0327"}').bar }}
{# results in: 'ç' #}
```

::alert{type="info"}
If you were using Kestra in a version prior to [v0.18.0](/blogs/2024-08-06-release-0-18.md), this function used to be named `json()`. We've renamed it to `fromJson` for more clarity. The renaming has been implemented in a non-breaking way — using `json()` will raise a warning in the UI but it will still work.
::


### yaml

The `yaml` function will convert any string to an object allowing to access its properties.

```twig
"{{ yaml('foo: [666, 1, 2]').foo[0] }}"
{# results in: '666' #}

{{ yaml(yaml_object) | jq(...) | yaml }}
{# prints the yaml_object as a yaml string #}
```

### max

The `max` function will return the largest of it's numerical arguments.
```twig
{{ max(user.age, 80) }}
```

### min

The `min` function will return the smallest of it's numerical arguments.
```twig
{{ min(user.age, 80) }}
```

### now

The `now` function will return the actual datetime. The arguments are the same as the [date](./03.filter/temporal.md#date) filter except the format is different.

```twig
{{ now() }}
{{ now(timeZone="Europe/Paris") }}
```

**Arguments**
- existingFormat
- timeZone
- locale

### parent

The `parent` function is used inside of a block to render the content that the parent template would
have rendered inside of the block had the current template not overridden it. It is similar to Java's `super` keyword.

Let's assume you have a template, "parent.peb" that looks something like this:
```twig
{% block "content" %}
	parent contents
{% endblock %}
```

And then you have another template, "child.peb" that extends "parent.peb":
```twig
{% extends "parent.peb" %}

{% block "content" %}
	child contents
	{{ parent() }}
{% endblock %}
```

The output will look something like the following:
```twig
parent contents
child contents
```

### range

The `range` function will return a list containing an arithmetic progression of numbers:
```twig
{% for i in range(0, 3) %}
    {{ i }},
{% endfor %}

{# outputs 0, 1, 2, 3, #}
```

When step is given (as the third parameter), it specifies the increment (or decrement):
```twig
{% for i in range(0, 6, 2) %}
    {{ i }},
{% endfor %}

{# outputs 0, 2, 4, 6, #}
```

Pebble built-in .. operator is just a shortcut for the range function with a step of 1+
```twig
{% for i in 0..3 %}
    {{ i }},
{% endfor %}

{# outputs 0, 1, 2, 3, #}
```

### printContext

The `printContext` function is used to debug and print all variables defined.

```twig

{{ printContext() }}
```
The above example will output the following:
```json
{"outputs": {...}, "execution": {...}, ...}
```

### read

Read an internal storage file and return its content as a string. This function accepts one of the following:
1. A path to a Namespace File e.g. `{{ read('myscript.py') }}`
2. An internal storage URI e.g. `{{ read(inputs.myfile) }}` or `{{ read(outputs.extract.uri) }}`.

Reading namespace files is restricted to **files in the same namespace** as the flow using this function.

Reading internal storage files is restricted to the **current execution**. Specifically, those are files created by the current flow's execution or the parent flow execution (for flows triggered by a [Subflow](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Subflow) task or a [ForEachItem](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.ForEachItem) task).

```twig
# Read a namespace file from the path `subdir/file.txt`
{{ read('subdir/file.txt') }}

# Read an internal storage file from the `uri` output of the `readFile` task
{{ read(outputs.readFile.uri) }}

# Read an internal storage file from an input named `file`
{{ read(inputs.file) }}
```

### render

By default, kestra renders all expressions [only once](../11.migration-guide/0.14.0/recursive-rendering.md). This is safer from a security perspective, and it prevents unintended behavior when parsing JSON elements of a webhook payload that contained a templated string from other applications (such as GitHub Actions or dbt core). However, sometimes recursive rendering is desirable. For example, if you want to parse flow variables that contain Pebble expressions. This is where the `render()` function comes in handy.

The `render()` function is used to enable recursive rendering of Pebble expressions. It is available since the release 0.14.0.

The syntax for the `render()` function is as follows:

```twig
{{ render(expression_string, recursive=true) }} # if false, render only once
```

The function takes two arguments:
1. The string of an expression to be rendered e.g. `"{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"`
2. A boolean flag that controls whether the rendering should be recursive or not:
   - if `true` (default), the expression will be **rendered recursively**
   - if `false`, the expression will be **rendered only once**.

Let's see some examples of how the `render()` function works and where you need to use it.

### Where the `render()` function is NOT needed

Let's take the following flow as an example:

```yaml
id: parse_input_and_trigger_expressions
namespace: company.team

inputs:
  - id: myinput
    type: STRING
    defaults: hello

tasks:
  - id: parse_date
    type: io.kestra.plugin.core.debug.Return
    format: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

  - id: parse_input
    type: io.kestra.plugin.core.debug.Return
    format: "{{ inputs.myinput }}"

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* * * * *"
```

Since we don't use any nested expressions (like using trigger or input expressions in variables, or using variables in other variables), this flow will work just fine without having to use the `render()` function.

### Where the `render()` function is needed

Let's modify our example so that now we store that long expression ``"{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"`` in a variable:

```yaml
id: hello
namespace: company.team

variables:
  trigger_var: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

tasks:
  - id: parse_date
    type: io.kestra.plugin.core.debug.Return
    format: "{{ vars.trigger_var }}" # no render function means no recursive rendering for that trigger_var variable

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    disabled: true
    cron: "* * * * *"
```

Here, the task `parse_date` will print the expression without recursively rendering it, so the printed output will be a string of that variable rather than a parsed date:

```twig
{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}
```

To fix that, simply wrap the `vars.trigger_var` variable in the `render()` function:

```yaml
id: hello
namespace: company.team

variables:
  trigger_var: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"

tasks:
  - id: parse_date
    type: io.kestra.plugin.core.debug.Return
    format: "{{ render(vars.trigger_var) }}" # this will print the recursively-rendered expression

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* * * * *"
```

Now you should see the date printed in the logs, e.g. `2024-01-16`.

### Using expressions in namespace variables

Let's assume that you have configured a [namespace variable](./02.expression-types.md#namespace-variables-ee) `myvar`. That variable uses a Pebble function to retrieve a secret e.g. `{{ secret('MY_SECRET') }}`. By default, kestra will only render the expression without recursively rendering what's inside of the namespace variable:

```yaml
id: namespace_variable
namespace: company.team

tasks:
  - id: print_variable
    type: io.kestra.plugin.core.debug.Return
    format: "{{ namespace.myvar }}"
```

If you want to render the secret contained in that variable, you will need to wrap it in the `render()` function:

```yaml
id: namespaces_variable
namespace: company.team

tasks:
  - id: print_variable
    type: io.kestra.plugin.core.debug.Return
    format: "{{ render(namespace.myvar) }}"
```

### String concatenation

Let's look at another example that will demonstrate how the `render()` function works with string concatenation.

```yaml
id: pebble_string_concatenation
namespace: company.team

inputs:
  - id: date
    type: DATETIME
    defaults: 2024-02-24T22:00:00.000Z

  - id: user
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
    type: io.kestra.plugin.core.log.Log
    message: |
     Concat: {{ vars.greeting_concat }}
     Brackets: {{ vars.greeting_brackets }}
     Full date: {{ vars.full_date }}
     Full date concat: {{ vars.full_date_concat }}

  - id: rendered-recursively
    type: io.kestra.plugin.core.log.Log
    message: |
     Concat: {{ render(vars.greeting_concat) }}
     Brackets: {{ render(vars.greeting_brackets) }}
     Full date: {{ render(vars.full_date) }}
     Full date concat: {{ render(vars.full_date_concat) }}

  - id: rendered-once
    type: io.kestra.plugin.core.log.Log
    message: |
     Concat: {{ render(vars.greeting_concat, recursive=false) }}
     Brackets: {{ render(vars.greeting_brackets, recursive=false) }}
     Full date: {{ render(vars.full_date, recursive=false) }}
     Full date concat: {{ render(vars.full_date_concat, recursive=false) }}

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* * * * *"
```

Note that:
- the ``??`` syntax within `"{{ trigger.date ?? inputs.date | date('EEEE') }}"` is a [null-coalescing operator](./05.operator.md#null-coalescing) that returns the first non-null value in the expression. For example, if `trigger.date` is null, the expression will return `inputs.date`.
- the `~` sign is a [string concatenation operator](./05.operator.md#concat) that combines two strings into one.

When you run this flow, you should see the following output in the logs:

```
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
namespace: company.team

inputs:
  - id: github_url
    type: STRING
    defaults: https://github.com/kestra-io/kestra/pull/2834

  - id: body
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
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.body, recursive=false) }}"

  - id: not_recursive
    type: io.kestra.plugin.core.log.Log
    message: "{{ vars.body }}"

  - id: recursive
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.body) }}"
    allowFailure: true # this task will fail because it will try to render the webhook's payload

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
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

```
INFO This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}
INFO {{ trigger.body.pull_request.body ?? trigger.body.issue.body ?? inputs.body }}
ERROR io.pebbletemplates.pebble.error.PebbleException: Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
ERROR Missing variable: 'env' on 'This PR replaces the ${{ env.GITHUB_TOKEN }} with a more secure ${{ secrets.GITHUB_TOKEN }}' at line 1 (?:?)
```

### renderOnce

The `renderOnce()` function is used to enable one-time rendering of nested Pebble expressions. It is available since the release 0.16.0 and is equivalent to [render(expression_string, recursive=false)](#render).

This function is syntactic sugar to reduce overhead brought by the recursive rendering default behaviour. It can be used to use `vars` easily as they may contain themselves pebble expressions.

Basically, if `vars.a={{ vars.b }}`, `vars.b=42` then `renderOnce(vars.a)=42`. Note that if `vars.b={{ vars.c }}`, `renderOnce(vars.a)={{ vars.c }}`.

The syntax for the `renderOnce()` function is as follows:

```yaml
{{ renderOnce(expression_string) }}
```

### secret

The `secret()` function is used to retrieve a secret from a secret backend based on the key provided as input to that function.

Here is an example flow that retrieves the Personal Access Token secret stored using the secret key `GITHUB_ACCESS_TOKEN`:


```yaml
id: secret
namespace: company.team

tasks:
  - id: githubPAT
    type: io.kestra.plugin.core.log.Log
    message: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
```

The `secret('key')` function will lookup up the configured secret manager backend for a secret value using the key `GITHUB_ACCESS_TOKEN`. If the key is missing, an exception will be raised. The example flow shown above will look up the secret value by key and will log the output with the secret value.

::alert{type="warning"}
The purpose of this example is to show how to use secrets in your flows. In practice, **you should avoid logging sensitive information**.
::

There are some differences between the secret management backend in the Open-Source and Enterprise editions. By default, Kestra provides a secret management backend based on environment variables. Each environment variable starting with `SECRET_` will be available as a secret, and its value must be base64-encoded.

The above example will:
1. retrieve the secret `GITHUB_ACCESS_TOKEN` from an environment variable `SECRET_GITHUB_ACCESS_TOKEN`
2. base64-decode it at runtime.


---

## Operator

Operators are used to perform logical operations within templated expressions such as comparing values and performing arithmetic operations.

### Comparison operators

Pebble provides the following comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`. All of them except for `==`
are equivalent to their Java counterparts. The `==` operator uses `Java.util.Objects.equals(a, b)` behind the
scenes to perform null safe value comparisons.

> `equals` is an alias for `==`

```twig
{% if user.name equals "Mitchell" %}
	...
{% endif %}
```

### concat

The `concat` operator can be used to concatenate 2 strings:

```twig
{{ "apple" ~ "pear" ~ "banana" }}
{# results in: 'applepearbanana' #}
```

### contains

The `contains` operator can be used to determine if a collection, map, or array contains a particular item.
```twig
{% if ["apple", "pear", "banana"] contains "apple" %}
	...
{% endif %}
```

When using maps, the contains operator checks for an existing key.

```twig
{% if {"apple":"red", "banana":"yellow"} contains "banana" %}
	...
{% endif %}
```

The operator can be used to look for multiple items at once:

```twig
{% if ["apple", "pear", "banana", "peach"] contains ["apple", "peach"] %}
	...
{% endif %}
```

### is

The `is` operator will apply a test to a variable which will return a boolean.

```twig
{% if 2 is even %}
	...
{% endif %}
```
The result can be negated using the `not` operator:

```twig
{% if 3 is not even %}
	...
{% endif %}
```

### logic

The `and` operator and the `or` operator are available to join boolean expressions.

```twig
{% if 2 is even and 3 is odd %}
	...
{% endif %}
```
The `not` operator is available to negate a boolean expression.
```twig
{% if 3 is not even %}
	...
{% endif %}
```

Parenthesis can be used to group expressions to ensure a desired precedence.

```twig
{% if (3 is not even) and (2 is odd or 3 is even) %}
	...
{% endif %}
```

### math

All the regular math operators are available for use. Order of operations applies.
```twig
{{ 2 + 2 / ( 10 % 3 ) * (8 - 1) }}
```

The following operators are supported:

- `+`: Adds two numbers together (the operands are cast to numbers). `{{
1 + 1 }}` is 2.
- `-`: Subtracts the second number from the first one. `{{ 3 - 2 }}` is 1.
- `/`: Divides two numbers. The returned value will be a floating point number.  `{{ 1 / 2 }}` is `{{ 0.5 }}`.
- `%`: Calculates the remainder of an integer division. `{{ 11 % 7 }}` is 4.
- `*`: Multiplies the left operand with the right one. `{{ 2 * 2 }}` would return 4.


The result can be negated using the [not](#not) operator.

### not

The `not` operator is used in conjunction with [is](#is) will negate the test.

```twig
{% if 3 is not even %}
	...
{% endif %}
```

### null-coalescing

Kestra supports the null-coalescing operator that allows testing if variables are defined.

The `??` operator will return the first defined, not-null value in the list.

The `???` operator will return the right-hand side of the expression only if the left-hand side is undefined.

::alert{type="info"}
TL;DR for the null-coalescing operator:
-  `X ?? Y` will return `Y` if `X` is null or undefined
-  `X ??? Y` will return `Y` only if `X` is undefined
::


```twig
{% set baz = "baz" %}
{{ foo ?? bar ?? baz }}

{# results in: 'baz' #}

{{ foo ?? bar ?? raise }}
{# results: an exception because none of the 3 vars is defined  #}
```

::alert{type="info"}
For more details on using the null-coalescing operator, see the [Handling null and undefined values](../15.how-to-guides/null-values.md) guide.
::

### ternary-operator

Pebble supports the use of the conditional operator (often named the ternary operator).
```twig
{{ foo == null ? bar : baz }}
```

---

## Tag

Tags are used to control the flow of the template. They are enclosed in `{% %}`.

Each section below represents a built-in tag.


### block

The `block` tag is used to render the contents of a block more than once.

In the following example we create a block with the name 'header':

```twig
{% block header %}
    Introduction
{% endblock header %}
```

Then the `block` tag can be used with the [block](./04.function.md#block) function

```twig
{{ block("post") }}
```

### filter

The `filter` tag allows you to apply a filter to a large chunk of template.

```twig
{% filter upper %}
    hello
{% endfilter %}

{# output: 'HELLO' #}
```

Multiple filters can be chained together.
```twig
{% filter upper | lower | title %}
    hello
{% endfilter %}

{# output: 'Hello' #}
```

### for

The `for` tag is used to iterate through primitive arrays or anything that implements the `java.lang.Iterable`
interface, as well as maps.

```twig
{% for user in users %}~
    {{ user.name }} lives in {{ user.city }}.
{% endfor %}
```

While inside the loop, Pebble provides a couple of special variables to help you out:
- `loop.index` - a zero-based index that increments with every iteration.
- `loop.length` - the size of the object we are iterating over.
- `loop.first` - True if first iteration
- `loop.last` - True if last iteration
- `loop.revindex` - The number of iterations from the end of the loop

```twig
{% for user in users %}
    {{ loop.index }} - {{ user.id }}
{% endfor %}
```

The `for` tag also provides a convenient way to check if the iterable object is empty with the included `else` tag.

```twig
{% for user in users %}
    {{ loop.index }} - {{ user.id }}
{% else %}
    There are no users to display.
{% endfor %}
```

Iterating over maps can be done like so:

```twig
{% for entry in map %}
    {{ entry.key }} - {{ entry.value }}
{% endfor %}
```

### if

The `if` tag allows you to designate a chunk of content as conditional depending on the result of an expression

```twig
{% if users is empty %}
    There are no users.
{% elseif users.length == 1 %}
    There is only one user.
{% else %}
    There are many users.
{% endif %}
```

The expression used in the `if` statement often makes use of the [is](./05.operator.md#is) operator.

`If` tag currently supports the following expressions:

| Value  | Boolean expression |
| --- | --- |
| boolean | boolean value |
| Empty string | false |
| Non empty string | true |
| numeric zero | false |
| numeric different than zero | true |

### macro

The `macro` tag allows you to create a chunk of reusable and dynamic content. The macro can be called
multiple times in the current template.

It doesn't matter where in the current template you define a macro, i.e. whether it's before or after you call it.
Here is an example of how to define a macro:

```twig
{% macro input(type="text", name, value) %}
    type="{{ type }}", name="{{ name }}", value="{{ value }}"
{% endmacro %}
```

And now the macro can be called numerous times throughout the template, like so:

```twig
{{ input(name="country") }}
{# will output: type="text", name="country", value="" #}
```

A macro does not have access to the same variables that the rest of the template has access to.
A macro can only work with the variables provided as arguments.

**Access to the global context:** you can pass the whole context as an argument by using the special `_context` variable if you need to access
variables outside of the macro scope:

```twig
{% set foo = 'bar' %}

{{ test(_context) }}
{% macro test(_context) %}
    {{ _context.foo }}
{% endmacro %}

{# will output: bar #}
```

### raw

The `raw` tag allows you to write a block of Pebble syntax that won't be parsed.

```twig
{% raw %}{{ user.name }}{% endraw %}
```

```twig
{% raw %}
    {% for user in users %}
        {{ user.name }}
    {% endfor %}
{% endraw %}
```

### set

The `set` tag allows you to define a variable in the current context, whether it currently exists or not.

```twig
{% set header = "Test Page" %}

{{ header }}
```

---

## Test

Tests are used to perform logical operations within templated expressions such as checking if a variable is defined or if a variable is empty.

Each section below represents a built-in test.

### defined

The `defined` test checks if a variable is defined.

```twig
{% if missing is not defined %}
	...
{% endif %}
```

### empty

The `empty` test checks if a variable is empty. A variable is empty if it is null, an empty string, an empty collection, or an empty map.

```twig
{% if user.email is empty %}
	...
{% endif %}
```


### even

The `even` test checks if an integer is even.

```twig
{% if 2 is even %}
	...
{% endif %}
```

### iterable

The `iterable` test checks if a variable implements `java.lang.Iterable`.

```twig
{% if users is iterable %}
	{% for user in users %}
		...
	{% endfor %}
{% endif %}
```

### json

The `json` test checks if a variable is valid json string

```twig
{% if '{"test": 1}' is json %}
	...
{% endif %}
```

### map

The `map` test checks if a variable is an instance of a map.

```twig
{% if {"apple":"red", "banana":"yellow"} is map %}
	...
{% endif %}
```

### null

The `null` test checks if a variable is null.

```twig
{% if user.email is null %}
	...
{% endif %}
```

### odd

The `odd` test checks if an integer is odd.
```twig
{% if 3 is odd %}
	...
{% endif %}
```

---

## Deprecated handlebars

Handlebars are deprecated and superseded by Pebble. These functions will be removed in the future and are disabled by default.

::collapse{title="Handlebars"}

## boolean

**`eq`: Equality**

Test if two elements are equals.

> Render `yes` or `no`:
```handlebars
  {{ #eq a b }}
    yes
  {{ else }}
    no
  {{ /eq }}
```

> Render `true` or `false`:

```handlebars
  {{ eq a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ eq a b yes='yes' no='no' }}
```

**`neq`: Not equality**

Test if two elements are NOT equals.

> Render `yes` or `no`:

```handlebars
  {{ #neq a b }}
    yes
  {{ else }}
    no
  {{ /neq }}
```

> Render `true` or `false`:

```handlebars
  {{ neq a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ neq a b yes='yes' no='no' }}
```

**`gt`: Greater operator**

Greater operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:

```handlebars
  {{ #gt a b }}
    yes
  {{ else }}
    no
  {{ /gt }}
```

> Render `true` or `false`:

```handlebars
  {{ gt a b }}
```

> Render `yes` or `no`:
```handlebars
  {{ gte a b yes='yes' no='no' }}
```

**`gte`: Greater or equal operator**

Greater or equal operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:

```handlebars
  {{ #gte a b }}
    yes
  {{ else }}
    no
  {{ /gte }}
```

> Render `true` or `false`:

```handlebars
  {{ gte a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ gte a b yes='yes' no='no' }}
```

**`lt`: Less operator**

Less than operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:

```handlebars
  {{ #lt a b }}
    yes
  {{ else }}
    no
  {{ /lt }}
```

> Render `true` or `false`:
```handlebars
  {{ lt a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ lt a b yes='yes' no='no' }}
```

**`lte`: Less or equal operator**

Less than operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements.

> Render `yes` or `no`:

```handlebars
  {{ #lte a b }}
    yes
  {{ else }}
    no
  {{ /lte }}
```

> Render `true` or `false`:

```handlebars
  {{ lte a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ lte a b yes='yes' no='no' }}
```

**`and`: And operator**

And operator. This is a boolean operation.

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.

Multiple arguments are supported too:

```handlebars
  {{ #and a b c d }}
    yes
  {{ else }}
    no
  {{ /and }}
```

> Render `yes` or `no`:

```handlebars
  {{ #and a b }}
    yes
  {{ else}}
    no
  {{ /and }}
```


> Render `true` or `false`:

```handlebars
  {{ and a b }}
```

> Render `yes` or `no`:

```handlebars
  {{ and a b yes='yes' no='no' }}
```

**`or`: Or operator**

Or operator. This is a boolean operation

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.

Multiple arguments are supported too:

```handlebars
  {{ #or a b c d }}
    yes
  {{ else }}
    no
  {{ /or }}
```


> Render `yes` or `no`:
```handlebars
  {{ #or a b }}
    yes
  {{ else }}
    no
  {{ /or }}
```

> Render `true` or `false`:
```handlebars
  {{ or a b }}
```

> Render `yes` or `no`:
```handlebars
  {{ or a b yes='yes' no='no' }}
```

**`not`: Not operator**

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.


> Render `yes` or `no`:
```handlebars
  {{ #not a }}
    yes
  {{ else }}
    no
  {{ /not }}
```

> Render `true` or `false`:
```handlebars
  {{ not a }}
```

> Render `y` or `n`:
```handlebars
  {{ not a yes='yes' no='no' }}
```

**`cmp`: Compare operator**

Compare to object as [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html)s.


> Renders 1 if a > b, 0 if a == b -1 if a < b
```handlebars
  {{ cmp a b }}
```

**`isNull`: Compare operator**

Test if one element is null.

```handlebars
  {{ isNull a }}
```

**`isNotNull`: Compare operator**

Test if one element is not null.

```handlebars
  {{ isNotNull a }}
```

---

## date


**`dateFormat`: Date format**

```handlebars
{{ dateFormat date ['format'] [format='format'][tz=timeZone | timeZoneId] }}
```


**## Arguments:**
- `format`: Format parameters is one of:
  - `full`: Sunday, September 8, 2013 at 4:19:12 PM Central European Summer Time
  - `long`: September 8, 2013 at 4:19:12 PM CEST
  - `medium`: Sep 8, 2013, 4:19:12 PM
  - `short`: 9/8/13, 4:19 PM
  - `iso`: 2013-09-08T16:19:12.000000+02:00
  - `iso_sec`: 2013-09-08T16:19:12+02:00
  - `sql`: 2013-09-08 16:19:12.000000
  - `sql_seq`: 2013-09-08 16:19:12
  - `iso_date_time`: 2013-09-08T16:19:12+02:00[Europe/Paris]
  - `iso_date`: 2013-09-08+02:00
  - `iso_time`: 16:19:12+02:00
  - `iso_local_date`: 2013-09-08
  - `iso_instant`: 2013-09-08T14:19:12Z
  - `iso_local_date_time`: 2013-09-08T16:19:12
  - `iso_local_time`: 16:19:12
  - `iso_offset_time`: 16:19:12+02:00
  - `iso_ordinal_date`: 2013-251+02:00
  - `iso_week_date`: 2013-W36-7+02:00
  - `iso_zoned_date_time`: 2013-09-08T16:19:12+02:00[Europe/Paris]
  - `rfc_1123_date_time`: Sun, 8 Sep 2013 16:19:12 +0200
  - `pattern`: a date pattern.
  - Otherwise, the default formatter `iso` will be used. The format option can be specified as a parameter or hash (a.k.a named parameter).
  - You can pass the any format from [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)
- `timezeome`: with the format `Europe/Paris`

**`now`: Current date**

```handlebars
   {{ now ['format'] [tz=timeZone|timeZoneId] }}
```

**## Arguments:**
- `format`: Same format as `dateFormat`
 - `timezone`: with the format `Europe/Paris`

**`timestamp`: Current second timestamp**

```handlebars
   {{ timestamp }}
```


**`nanotimestamp`: Current nano timestamp**

```handlebars
   {{ nanotimestamp }}
```


**`microtimestamp`: Current micro timestamp**

```handlebars
   {{ microtimestamp }}
```



**`dateAdd`: Add some units to date**

```handlebars
   {{ dateAdd yourDate quantity "unit" [format="format"] [tz=timeZone|timeZoneId] }}
   {{ dateAdd yourDate -1 "DAYS" }}
```
- `quantity`: an integer value positive or negative
- `format`: Format parameters is one of:
  - `NANOS`
  - `MICROS`
  - `MILLIS`
  - `SECONDS`
  - `MINUTES`
  - `HOURS`
  - `HALF_DAYS`
  - `DAYS`
  - `WEEKS`
  - `MONTHS`
  - `YEARS`
  - `DECADES`
  - `CENTURIES`
  - `MILLENNIA`
  - `ERAS`

---

## index

::alert{type="warning"}
Handlebars variables are deprecated and superseded by Pebble. These functions will be removed soon and are disabled by default.
::

Variables are specific fields for tasks. They use the power of [handlebars](https://handlebarsjs.com/guide/) with Kestra's special context system, allowing powerful task composition.

Variables can use variable information registered/existing in the execution context. The context is data injected in Variables and from different sources:

**Functions**

Sometimes, you need to change the format of variables. To do this, you can use some of the following functions:

<ChildTableOfContents />
---

## iterations

**For each**

You can iterate over a list using the built-in each helper. Inside the block, you can use `this` to reference the element being iterated over. `contextualListVariable` is an iterable item on which the mydata property is displayed for all entries.

The `@index` is a special variable available in the each loop context which value is the current index of the element being iterated. There are agic* variables like @index in a each context. The following ones are also available: `@key` `@index` `@first` `@last` `@odd` `@even`

See handlebars documentation for more about this topic.

```handlebars
{{ #each contextualListVariable }}
    {{ this.mydata }} {{ @index   }}
{{ /each }}
```

will produce

```
one 0
two 1
three 2
django! 3
```

for the following data sample when

```javascript
contextualListVariable = [
  {"mydata": "one"},
  {"mydata": "two"},
  {"mydata": "three"},
  {"mydata": "django!"},
]
```

If the contextual 'this' is not convenient to use the data as you wish, it is possible to alias it as shown below:

```handlebars
{{ #each iterableVariable as | myItem | }}
    {{myItem.mydata}}
{{ /each }}
```

---

## json

**`json` Convert an object to json**

Convert an object to is JSON representation

```handlebars
{{ json output['task-id'] }}
```

Example, if the current context is:
```json
{
  "outputs": {
    "task1": {
      "value": 1,
      "text": "awesome1"
    },
    "task2": {
      "value": 2,
      "text": "awesome2"
    }
  }
}
```

the output of `{{ json outputs.task2}}`  will be `{"value":2,"text":"awesome2"}`.

**`jq` Transform vars with JQ**

Apply the [JQ expression](https://stedolan.github.io/jq/) to a variables.

```handlebars
{{ jq vars jqExpr [first=false] }}
```

`first` mean to always fetch the first element, by default jq return an array of results

::alert{type="warning"}
Internally, [Jackson JQ](https://github.com/eiiches/jackson-jq) is used and support only a large subset of official JQ.
::


Example, if the current context is:

```json
{
  "outputs": {
    "task1": {
      "value": 1,
      "text": "awesome1"
    },
    "task2": {
      "value": 2,
      "text": "awesome2"
    }
  }
}
```

```handlebars
{{ jq outputs .task1.value true }}
```

the output will be `1`.


---

## number

**`numberFormat`: Format a number**
```handlebars
   {{ numberFormat number ["format"] [locale=default] }}
```

Arguments:
 - `format`: Format parameters is one of:
    - "integer": the integer number format
    - "percent": the percent number format
    - "currency": the decimal number format
    - "pattern": a decimal pattern.
    - Otherwise, the default formatter will be used.

More options:

- groupingUsed: Set whether or not grouping will be used in this format.
- maximumFractionDigits: Sets the maximum number of digits allowed in the fraction portion of
a number.
- maximumIntegerDigits: Sets the maximum number of digits allowed in the integer portion of a
number
- minimumFractionDigits: Sets the minimum number of digits allowed in the fraction portion of
a number
- minimumIntegerDigits: Sets the minimum number of digits allowed in the integer portion of a
number.
- parseIntegerOnly: Sets whether or not numbers should be parsed as integers only.
- roundingMode: Sets the {@link java.math.RoundingMode} used in this NumberFormat.

---

## string

**`capitalizeFirst`: Capitalizes the first character of the value.**

If the value is "kestra is cool !", the output will be "Kestra is cool !".

```handlebars
{{ capitalizeFirst value }}
```

**`center`: Centers the value in a field of a given width.**

If the value is "Handlebars.java", the output will be "  Handlebars.java  ".

```handlebars
{{ center value size=19 [pad="char"] }}
```

**## Arguments:**
- `size`
- `pad`


**`cut`: Removes all values of arg from the given string.**

If the value is "String with spaces", the output will be "Stringwithspaces".

```handlebars
{{ cut value [" "] }}
```




**`defaultIfEmpty`: Default if empty**

If the value evaluates to False, it will use the given default. Otherwise, it uses the
value. If value is "" (an empty string), the output will be nothing.


```handlebars
{{ defaultIfEmpty value ["nothing"] }}
```


**`join`: Join string**

Joins an array, iterator or an iterable with a string.

```handlebars
{{ join value join [prefix=""] [suffix=""] }}
```

**## Arguments:**
- `join`
- `prefix`
- `suffix`

> If value is the list ['a', 'b', 'c'], the output will be the string "a // b // c".
```handlebars
{{ join value " // " [prefix=""] [suffix=""] }}
```

> Join the "a", "b", "c", the output will be the string "a // b // c".
```handlebars
{{ join "a" "b" "c" " // " [prefix=""] [suffix=""] }}
```



**`ljust`: Left-aligns the value in a field of a given width.**

If the value is Handlebars.java, the output will be "Handlebars.java     ".


```handlebars
{{ ljust value 20 [pad=" "] }}
```

**## Arguments:**
- `field size`


**`rjust`: Right-aligns the value in a field of a given width.**

If the value is Handlebars.java, the output will be "     Handlebars.java".

```handlebars
{{ rjust value 20 [pad=" "] }}
```

**## Arguments:**
- `field size`
- `pad`



**`substring` Substring**

Returns a new `CharSequence` that is a subsequence of this sequence.
The subsequence starts with the `char` value at the specified index and
ends with the `char` value at nd - 1*

```handlebars
{{substring value start end }}
```

**## Arguments:**
- `start offset`
- `end offset`

For example:

> If the value is Handlebars.java, the output will be "java".
```handlebars
{{ substring value 11 }}
```

> If the value is Handlebars.java, the output will be "Handlebars".
```handlebars
{{ substring value 0 10 }}
```

**`lower`: Converts a string into all lowercase.**

If the value is 'Still MAD At Yoko', the output will be 'still mad at yoko'.

```handlebars
{{ lower value}}
```


**`upper` Converts a string into all uppercase.**

If the value is 'Hello', the output will be 'HELLO'.

```handlebars
{{ upper value }}
```


**`slugify` Converts to lowercase**

This removes non-word characters (alphanumerics and underscores) and converts spaces to hyphens. It also strips leading and trailing whitespace.
If the value is "Joel is a slug", the output will be "joel-is-a-slug".

```handlebars
{{ slugify value }}
```



**`stringFormat`: Formats the variable**

According to the argument, a string formatting specifier.
If the value is "Hello %s" "handlebars.java", the output will be "Hello handlebars.java".

```handlebars
{{stringFormat string param0 param1 ... paramN}}
```

**## Arguments:**
- `format`
- `paramN`




**`stripTags`: Strips all [X]HTML tags.**

```handlebars
{{ stripTags value }}
```

**`capitalize`: Capitalizes all the whitespace separated words in a String.**

If the value is "my first post", the output will be "My First Post".

```handlebars
{{ capitalize value [fully=false] }}
```

Arguments:
- `fully`



**`abbreviate`: Truncates a string**

The string will be truncated if it is longer than the specified number of characters.
Truncated strings will end with a translatable ellipsis sequence ("...").
If value is "Handlebars rocks", the output will be "Handlebars...".


```handlebars
{{ abbreviate value 13 }}
```

**## Arguments:**
- Number of characters to truncate to



**`wordWrap`: Wraps words**

This wraps the sentence at a specified line length. If value is Joel is a slug, the output would be: `Joel\nis a\nslug`


```handlebars
{{ wordWrap value 5 }}
```

**## Arguments:**
- the number of characters at which to wrap the text



**`replace` Replaces**

Each substring of this string that matches the literal target sequence with the specified literal replacement sequence.
If value is "Handlebars ...", the output will be "Handlebars rocks".

```handlebars
{{ replace value "..." "rocks" }}
```


**`yesno`: Boolean to yes / no**

For true, false and (optionally) null, to the strings "yes", "no", "maybe".

**## Arguments:**
  - `yes`
  - `no`
  - `maybe`

```handlebars
{{ yesno value [yes="yes"] [no="no"] maybe=["maybe"] }}
```

---

## use

Here you will find some examples to illustrate the available variables, and how to get the value you need.

Here is a typical payload for variables:

```yaml
globals:
  my-global-string: string
  my-global-int: 1
  my-global-bool: true

task:
  id: float
  type: io.kestra.plugin.core.debug.Return

taskrun:
  id: 5vPQJxRGCgJJ4mubuIJOUf
  startDate: 2020-12-18T12:46:36.018869Z
  attemptsCount: 0
  value: value2

parent:
  taskrun:
    value: valueA
  outputs:
    int: 1

parents:
  - taskrun:
      value: valueA
    outputs:
      int: 1
  - taskrun:
      value: valueB
    outputs:
      int: 2

flow:
  id: inputs
  namespace: company.team

execution:
  id: 42mXSJ1MRCdEhpbGNPqeES
  startDate: 2020-12-18T12:45:28.489187Z

outputs:
  my-task-id-1: # standard task outputs
    value: output-string
  my-task-id-2: # standard task outputs
    value: 42
  my-each-task-id: # dynamic task (each)
    value1: # outputs for value1
      value: here is value1
    value2: # outputs for value2
      value: here is value2

inputs:
  file: kestra:///org/kestra/tests/inputs/executions/42mXSJ1MRCdEhpbGNPqeES/inputs/file/application.yml
  string: myString
  instant: 2019-10-06T18:27:49Z
```


**Common variables**
As you can see, there are a lot of common variables that can be used in your flow, some of the most common examples are: `{{ execution.id }}`, `{{ execution.startDate }}` that allows you to change a file name or SQL query, for example.

**Input variables**
Input variables are simple to access with `{{ execution.NAME }}`, where `NAME` is the name of the declared in your flow. The data will be dependent on the `type` of the inputs.
One special case for input variables is the `FILE` type, where the file is prepended by `kestra://`. This means the file is inside the internal Kestra storage. Most tasks will take this kind of URI as a property and will provide the same property output. This type of input variable allows the full file generated by one task to be used in another task.

**Outputs variables**
One of Kestra's most important abilities is to use all outputs from previous tasks in the next one.

**Without dynamic tasks (Each)**
This is the simplest and most common way to use outputs in the next task. In order to fetch a variable, just use `{{ outputs.ID.NAME }}` where:
* `ID` is the task id
* `NAME` is the name of the output. Each task type can have any outputs that are documented on the part outputs of their docs. For example, Bash task can have `{{ outputs.ID.exitCode }}`, `{{ outputs.ID.outputFiles }}`, `{{ outputs.ID.stdErrLineCount }}`, etc...

**With dynamic tasks (Each)**
This option is more complicated since Kestra will change the way the outputs are generated, since there can be multiple tasks with the same id, you will need to use `{{ outputs.ID.VALUE.NAME }}`.

Most of the time, using Dynamic Tasks, you will need to fetch the current value of the iteration. This is done easily with `{{ taskrun.value }}`.

But what if a more complex flow is built, for example, with each containing 1 task (`t1`) to download a file (based on each value), and a second one (`t2`) that needs the output of `t1`. Such a flow would look something like this:

```yaml
id: each-sequential-nested
namespace: company.team

tasks:
  - id: each
    type: io.kestra.plugin.core.flow.EachSequential
    value: '["s1", "s2", "s3"]'
    tasks:
      - id: t1
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.value }}"
      - id: t2
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ (get outputs.t1 taskrun.value).value }} > {{ taskrun.startDate }}"
  - id: end
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }}"
```

In this case, you would need to use `{{ (get outputs.t1 taskrun.value).value }}`, which means give me from `outputs.t1` the index results from `taskrun.value`.

**With Flowable Task nested.**
If you have many Flowable Tasks, it can be complex to use the `get` function, and moreover, the `taskrun.value` is only available during the direct task from each. If you have any Flowable Tasks after, the `taskrun.value` of the first iteration will be lost (or overwritten). To deal with this, we have included the `parent` & `parents` vars.

This is illustrated in the flow below:

```yaml
id: each-switch
namespace: company.team

tasks:
  - id: t1
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
  - id: 2_each
    type: io.kestra.plugin.core.flow.EachSequential
    value: '["a", "b"]'
    tasks:
      # Switch
      - id: 2-1_switch
        type: io.kestra.plugin.core.flow.Switch
        value: "{{ taskrun.value }}"
        cases:
          a:
            - id: 2-1_switch-letter-a
              type: io.kestra.plugin.core.debug.Return
              format: "{{ task.id }}"
          b:
            - id: 2-1_switch-letter-b
              type: io.kestra.plugin.core.debug.Return
              format: "{{ task.id }}"

            - id: 2-1_each
              type: io.kestra.plugin.core.flow.EachSequential
              value: '["1", "2"]'
              tasks:
              - id: 2-1-1_switch
                type: io.kestra.plugin.core.flow.Switch
                value: "{{ taskrun.value }}"
                cases:
                  1:
                    - id: 2-1-1_switch-number-1
                      type: io.kestra.plugin.core.debug.Return
                      format: "{{ parents[0].taskrun.value }}"
                  2:
                    - id: 2-1-1_switch-number-2
                      type: io.kestra.plugin.core.debug.Return
                      format: "{{ parents[0].taskrun.value }} {{ parents[1].taskrun.value }}"
  - id: 2_end
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"

```

As you can see, the `parent` will give direct access to the first parent output and the value of the current one, while the `parents[INDEX]` lets go you deeper down the tree.

In the task `2-1-1_switch-number-2`:
- `{{ taskrun.value }}`: mean the value of the task `2-1-1_switch`
- `{{ parents[0].taskrun.value }}` or `{{ parent.taskrun.value }}`: mean the value of the task `2-1_each`
- `{{ parents[1].taskrun.value }}`: mean the value of the task `2-1_switch`
- `{{ parents[2].taskrun.value }}`: mean the value of the task `2_each`

---

## vars

**`firstDefined` First defined variables**

Return the first defined variables or throw an exception if no variables are defined.

```handlebars
{{ firstDefined outputs.task1.uri outputs.task2.uri }}
```

**`eval` Evaluate a handlebars expression**

Evaluate a handlebars expression at runtime based on the whole context.

Mostly useful for [Lookup in current child's tasks tree](./02.expression-usage.md#parent-tasks-with-flowable-tasks) and dynamic tasks.


```handlebars
{{ eval 'outputs.first.[{{taskrun.value}}].value' }}
```

**`firstDefinedEval` First defined evaluation**

First defined evaluates a handlebars expression at runtime based on the whole context or throws an exception if no variables are defined.

Mostly useful for [Lookup in current child's tasks tree](./02.expression-usage.md#parent-tasks-with-flowable-tasks) and dynamic tasks.


```handlebars
{{ firstDefined 'outputs.first.value' 'outputs.first.[{{taskrun.value}}].value' }}
```

**`get` get an element for an array or map by key**
```handlebars
   {{ get object ["key"] }}
```

* get on `object` type map, the key at `key`
* get on `object` type array, the index at `key`

Mostly useful for [Lookup in current child's tasks tree](./02.expression-usage.md#parent-tasks-with-flowable-tasks) and dynamic tasks.

```handlebars
{{ get outputs 'first' }}
```
::