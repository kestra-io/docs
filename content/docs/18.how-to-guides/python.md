---
title: Using Python
icon: /docs/icons/tutorial.svg
---

How to run Python code inside of your flow.


You can execute Python code inside of a flow by either writing your Python inline or by executing a `.py` file. 

For this example, the flow will install the pip package, and use the Python Kestra library to generate outputs and metrics.

## Scripts

If you want to write a short amount of Python to perform a task, you can use the `io.kestra.plugin.scripts.python.Script` type to write it inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_python.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.script)

## Commands

If you would prefer to put your Python code in a `.py` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.python.Commands` type:

```yaml file=public/examples/commands_python.yml
```

You'll need to add your Python code using the Editor or [sync it using Git](/docs/developer-guide/git) so Kestra can see it.

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.commands).