---
title: JSON Filters
icon: /docs/icons/expression.svg
---

JSON filters are used to manipulate JSON objects, often API responses.

## toJson

The `toJson` filter will convert any object to a JSON string.

The following expression `{{ [1, 2, 3] | toJson  }}` will result in the JSON string `'[1, 2, 3]'`.

Similarly:
- `{{ true | toJson }}` will result in `'true'`
- `{{ "foo" | toJson }}` will result in `'"foo"'`

::alert{type="info"}
If you were using Kestra in a version prior to [v0.18.0](../../../../blogs/2024-08-06-release-0-18.md), this filter used to be named `json`. We've renamed it to `toJson` for more clarity. The renaming has been implemented in a non-breaking way — using `json` will raise a warning in the UI but it will still work.
::


## jq

The `jq` filter apply a [JQ expression](https://stedolan.github.io/jq/) to a variables. The filter always return an array of result and will be formatted as json. You can use the filter [first](../03.filter/object.md#first) in order to return the first (and potentially the only) result of the jq filter.

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

## Manipulating JSON payload

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
