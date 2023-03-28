---
order: 4
---

# Helpers

Kestra has some _helper_ functions that can help during flow development.

::: warning
These helpers are only available during flow development to test on your local installation.
Before sending it to your server, you must expand the flow definition; our CI/CD support will automatically expand it.
These helpers cannot be used from Kestra's UI.
:::
  
## `[[> file.txt]]`: Include another file

Working on a large flow can become complex when many tasks are defined, especially when you have some big text inside the flow definition (example, SQL statement, ...).

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

You can replace the flow definition with this one: 
```yaml
id: include
namespace: io.kestra.tests

tasks:
- id: t1
  type: io.kestra.core.tasks.debugs.Return
  format: |
    [[> lorem.txt]]
``` 
And have a local file `lorem.txt` with the large content in it. 

The path can be:
* `[[> lorem.txt]]`: a relative path from the flow (flow.yaml and lorem.txt are in the same directory),
* `[[> /path/to/lorem.txt]]`: an absolute path,
* `[[> path/to/lorem.txt]]`: a relative path from the flow (flow.yaml with a subdirectory `path/to/`).

When including a file, you must use the right YAML scalar type: literal (with or without quotes) for single-line scalars or folded for multiple-lines ones.


::: warning
Includes are resolved recursively, so you can include a file from another include. 
This allows more complex things, but you need to take care that included files don't contain `[[ .. ]]`. If you need to have these characters in included files, escape them with `\[[ ...]]` !
:::


## Validate the flow to be uploaded to the server

There is a convenient command on the Kestra executable that allows validation of the current flow:

```bash
./kestra flow validate --local path-to-your-flow.yaml 
```
::: tip
If your flow uses a helper function, flow validation must be done locally as the flow cannot be expanded on the webserver.
:::


## Expand the flow to be uploaded to the server

There is a convenient command on the Kestra executable that allows expanding of the current flow. It will resolve includes if any:

```bash
./kestra flow expand path-to-your-flow.yaml 
```
