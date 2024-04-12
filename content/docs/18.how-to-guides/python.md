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

## Handling Outputs

If you want to get a variable or file from your Python code, you can use an [output](../06.workflow-components/07.outputs.md).

You'll need to install the [`kestra` python module](https://pypi.org/project/kestra/) in order to pass your variables to Kestra.

```bash
pip install kestra
```

### Variable Output

You'll need to use the `Kestra` class to pass your variables to Kestra as outputs. Using the `outputs` method, you can pass a dictionary of variables where the `key` is the name of the output you'll reference in Kestra.

Using the same example as above, we can pass the number of downloads as an output.

```python file=public/examples/outputs_python.py
```

Once your Python file has executed, you'll be able to access the outputs in later tasks as seen below:

```yaml file=public/examples/outputs_python.yml
```

### File Output

## Handling Metrics

You can also get [metrics](../08.developer-guide/07.scripts/outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Python code. In this example, we can use the `time` module to time the execution time of the function and then pass this to Kestra so it can be viewed in the Metrics tab.

```python file=public/examples/metrics_python.py
```

Once this has executed, `duration` will be viewable under **Metrics**.
![metrics](/docs/how-to-guides/python/metrics.png)