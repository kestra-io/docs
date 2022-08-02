---
order: 1
---

# Basic Usage

## Syntax Reference
There are two primary delimiters used within a Pebble template: <code v-pre>{{ ... }}</code> and `{% ... %}`. The first set of delimiters will output the result of an expression. Expressions can be very simple (ex. a variable name) or much more complex.
The second set of delimiters is used to change the control flow of the template; it can contain an if-statement, define a parent template, define a new block, etc.

## Variables
You can print variables directly to the output; for example, if the context contains a variable called `foo` which is a
String with the value "bar" you can do the following which will output "bar".
```twig
{{ foo }}
```
You can use the dot (.) notation to access attributes of variables. If the attribute contains any atypical characters, you can use the subscript notation ([]) instead.
```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

Additionally, if `foo` is a List, then `foo[0]` can be used.

If the value of variable (or attribute) is undefined, it will throw an error and fail the task.

## Filters

Output can be further modified with the use of filters. Filters are separated from the variable using a pipe symbol (`|`) and may have optional arguments in parentheses. Multiple filters can be chained and the output of one filter is applied to the next.
```twig
{{ "If life gives you lemons, eat lemons." | upper | abbreviate(13) }}
```
The above example will output the following:
```twig
IF LIFE GI...
```

## Functions
Whereas filters are intended to modify existing content/variables, functions are intended to generate new content. Similar to other programming languages, functions are invoked via their name followed by parentheses (`()`).
```twig
{{ max(user.score, highscore) }}
```

## Control Structure
Pebble provides several tags to control the flow of your template, two of the main ones being the [for](tag/for) loop, and [for](tag/if) statements.
```twig

{% for article in articles %}
    <h3>{{ article.title }}</h3>
    <p>{{ article.content }}</p>
{% else %}
    <p> There are no articles. </p>
{% endfor %}

```
```twig

{% if category == "news" %}
    {{ news }}
{% elseif category == "sports" %}
    {{ sports }}
{% else %}
    <p>Please select a category</p>
{% endif %}

```

## Macros
Macros are lightweight and re-usable template fragments. A macro is defined via the [macro](tag/macro) tag:
```twig

{% macro input(type, name) %}
	<input type="{{ type }}" name="{{ name }}" />
{% endmacro %}

```
And the macro will be invoked just like a function:
```twig
{{ input("text", "name", "Mitchell") }}
```
A macro does not have access to the main context; the only variables it can access are its local arguments.

## Named Arguments
Using named arguments allows you to be more explicit with the values you are passing to a filter, function, test or macro. They also allow you to avoid specifying arguments for which you don't want to change the default value.
```twig
{{ stringDate | date(existingFormat="yyyy-MMMM-d", format="yyyy/MMMM/d") }}
```

Positional arguments can be used in conjunction with named arguments but all positional arguments must come before any named arguments:
```twig
{{ stringDate | date("yyyy/MMMM/d", existingFormat="yyyy-MMMM-d") }}
```
Macros are a great use case for named arguments because they also allow you to define default values for unused arguments:
```twig

{% macro input(type="text", name, value) %}
	<input type="{{ type }}" name="{{ name }}" value="{{ value }}" />
{% endmacro %}

{{ input(name="country") }}

{# will output: <input type="text" name="country" value="" /> #}

```

## Comments
You can comment out any part of the template using the `{# ... #}` delimiters. These comments will not appear in the rendered output.
```twig

{# THIS IS A COMMENT #}
{% for article in articles %}
	<h3>{{ article.title }}</h3>
	<p>{{ article.content }}</p>
{% endfor %}

```

## Expressions
Expressions in a Pebble template are very similar to expressions found in Java.

### Literals
The simplest form of expressions are literals. Literals are representations for Java types such as strings and numbers.
- `"Hello World"`: Everything between two double or single quotes is a string. You can use a backslash to escape
quotation marks within the string.
- `"Hello #{who}"`: String interpolation is also possible using `#{}` inside quotes. In this example,
if the value of the variable `who` is `"world"`, then the expression will be evaluated to `"Hello world"`.
- `100 + 10l * 2.5`: Integers, longs and floating point numbers are similar to their Java counterparts.
- `true` / `false`: Boolean values equivalent to their Java counterparts.
- `null`: Represents no specific value, similar to it's Java counterpart. `none` is an alias for null.

### Collections
Both lists and maps can be created directly within the template.
- `["apple", "banana", "pear"]`: A list of strings
- `{"apple":"red", "banana":"yellow", "pear":"green"}`: A map of strings

The collections can contain expressions.

### Math
Pebble allows you to calculate values using some basic mathematical operators. The following operators are supported:
- `+`: Addition
- `-`: Subtraction
- `/`: Division
- `%`: Modulus
- `*`: Multiplication

### Logic
You can combine multiple expressions with the following operators:
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
Tests can be negated by using the is not operator:
```twig
{% if name is not null %}
	...
{% endif %}
```


### Conditional (Ternary) Operator
The conditional operator is similar to its Java counterpart:
```twig
{{ foo ? "yes" : "no" }}
```

### Null-Coalescing Operator
The null-coalescing operator allow to quickly test if a variables is defined (exists) and to use alternative value. :
```twig
{% set baz = "baz" %}
{{ foo ?? bar ?? baz }}

{# results in: 'baz' #}

{{ foo ?? bar ?? raise }}
{# results: an exception because none of the 3 vars is defined  #}
```

### Operator Precedence
In order from highest to lowest precedence:
- `.`
- `|`
- `%`, `/`, `*`
- `-`, `+`
- `==`, `!=`, `>`, `<`, `>=`, `<=`
- `is`, `is not`
- `and`
- `or`


### Parents with [Flowable Task](docs/developer-guide/flowable).
If you have many [Flowable Tasks](docs/developer-guide/flowable), it can be complex to get `taskrun.value` because this one is only available during the direct task from each. If you have any Flowable Tasks after, the `taskrun.value` of the first iteration will be lost (or overwritten). In order to deal with this, we have included the `parent` & `parents` vars.

This is illustrated in the flow below:

```yaml
id: each-switch
namespace: io.kestra.tests

tasks:
  - id: t1
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
  - id: 2_each
    type: io.kestra.core.tasks.flows.EachSequential
    value: '["a", "b"]'
    tasks:
      # Switch
      - id: 2-1_switch
        type: io.kestra.core.tasks.flows.Switch
        value: "{{taskrun.value}}"
        cases:
          a:
            - id: 2-1_switch-letter-a
              type: io.kestra.core.tasks.debugs.Return
              format: "{{task.id}}"
          b:
            - id: 2-1_switch-letter-b
              type: io.kestra.core.tasks.debugs.Return
              format: "{{task.id}}"

            - id: 2-1_each
              type: io.kestra.core.tasks.flows.EachSequential
              value: '["1", "2"]'
              tasks:
              - id: 2-1-1_switch
                type: io.kestra.core.tasks.flows.Switch
                value: "{{taskrun.value}}"
                cases:
                  1:
                    - id: 2-1-1_switch-number-1
                      type: io.kestra.core.tasks.debugs.Return
                      format: "{{parents.[0].taskrun.value}}"
                  2:
                    - id: 2-1-1_switch-number-2
                      type: io.kestra.core.tasks.debugs.Return
                      format: "{{parents.[0].taskrun.value}} {{parents.[1].taskrun.value}}"
  - id: 2_end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"

```

As you can see, the `parent` will give direct access to the first parent output and the value of the current one, while the `parents.INDEX` lets go you deeper down the tree.

In the task `2-1-1_switch-number-2`:
- <code v-pre>{{taskrun.value}}</code>: mean the value of the task `2-1-1_switch`
- <code v-pre>{{parents.[0].taskrun.value}}</code> or <code v-pre>{{parent.taskrun.value}}</code>: mean the value of the task `2-1_each`
- <code v-pre>{{parents.[1].taskrun.value}}</code>: mean the value of the task `2-1_switch`
- <code v-pre>{{parents.[2].taskrun.value}}</code>: mean the value of the task `2_each`
