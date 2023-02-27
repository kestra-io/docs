---
order: 6
---

# Iterations functions

[[toc]]

## For each

You can iterate over a list using the built-in each helper. Inside the block, you can use `this` to reference the element being iterated over. `contextualListVariable` is an iterable item on which the mydata property is displayed for all entries.

The `@index` is a special variable available in the each loop context which value is the current index of the element being iterated. There are agic* variables like @index in a each context. The following ones are also available: `@key` `@index` `@first` `@last` `@odd` `@even`

See handlebars documentation for more about this topic.

```handlebars
{{#each contextualListVariable}}
    {{this.mydata}} {{@index}}
{{/each}}
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
{{#each iterableVariable as | myItem | }}
    {{myItem.mydata}}
{{/each}}
```
