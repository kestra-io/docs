---
order: 10
---

# Deprecated Handlebars

::alert{type="warning"}
Handlebars variables are deprecated and superseded by Pebble. These functions will be removed soon and are disabled by default.
::

Variables are specific fields for tasks. They use the power of [handlebars](https://handlebarsjs.com/guide/) with Kestra's special context system, allowing powerful task composition.

Variables can use variable information registered/existing in the execution context. The context is data injected in Variables and from different sources:

## Functions

Sometimes, you need to change the format of variables. To do this, you can use some of the following functions:

- [String functions](./string.md)
- [Boolean functions](./boolean.md)
- [Number functions](./number.md)
- [Date functions](./date.md)
- [JSON functions](./json.md)
- [Iterations functions](./iterations.md)
- [Vars functions](./vars.md)
