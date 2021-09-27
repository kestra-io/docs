---
order: 10
---

# Deprecated Handlebars

::: warning
Handlebars variable is deprecated and superseded by Pebble. These function will be removed soon and is disabled by default
:::

Variables are specific fields for task. They use the power of [handlebars](https://handlebarsjs.com/guide/) with Kestra's special context system, allowing powerfull task composition.

Variables can use variable information registrered / existing in the execution context. This context are some data injected in Variables and are from different sources:

## Functions

Some time, you need to change the format of variables. For this, you can use some functions:

- [String functions](./string.md)
- [Boolean functions](./boolean.md)
- [Number functions](./number.md)
- [Date functions](./date.md)
- [Json functions](./json.md)
- [Iterations functions](./iterations.md)
- [Vars functions](./vars.md)
