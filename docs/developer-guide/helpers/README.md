---
order: 12
---

# Helpers

Kestra have some *helpers* function that can help during flow development.

::: warning
These helpers are only available during flow development in order to test on your local installation.
You must expand the flow definition before sending it to your server.
:::
 
## Expand the flow to be uploaded to the server

There is a convenient command on the Kestra executable that allows validation of the current flow and 
will output the expanded version of your flow without any helper:

```bash
./kestra flow validate path-to-your-flow.yaml 
```
  
## `[[> file.txt]]`: Include another file

When doing a large flow, the flow can be messy when a lot of tasks are defined and 
specially when you have some big text inside the flow (example, sql statement, ...).

Let's take an example: 
```yaml
id: include
namespace: io.kestra.tests

tasks:
- id: t1
  type: io.kestra.core.tasks.debugs.Return
  format: |
    Lorem Ipsum is simply dummy text of the printing 
    .....
    500 lines later
``` 

You can replace the flow with this one: 
```yaml
id: include
namespace: io.kestra.tests

tasks:
- id: t1
  type: io.kestra.core.tasks.debugs.Return
  format: "[[> lorem.txt]]"
``` 
And have a local file `lorem.txt` with the large content. 

The path can be: 
* `[[> lorem.txt]]`: a relative path from the flow (flow.yaml & lorem.txt are on the same directory),
* `[[> /path/to/lorem.txt]]`: an absolute path,
* `[[> path/to/lorem.txt]]`: a relative path from the flow (flow.yaml with a subdirectory `path/to/`).


::: warning
Includes are resolved recursively, so you can include a file from another include. 
Since this allow more complex things, you need to take care that included files don't contain `[[ .. ]]` . If you need to have these characters in included files, escape them with `\[[ ...]]` !
:::
