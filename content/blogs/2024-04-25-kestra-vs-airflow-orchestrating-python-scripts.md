---
title: "What Are The Differences Between Kestra and Airflow to Orchestrate Python"
description: "Discover what make Kestra and Airflow differents for the fundamental task of orchestrating Python scripts."
date: 2024-04-25T10:00:00
category: Solutions
author:
  name: Shruti Mantri
  image: "smantri"
---

This blog will compare Kestra vs Airflow for one of the most simple but fundamental tasks of orchestrating Python scripts.

Let us begin with how the flow or job looks like in these orchestrators for running a simple Hello World Python script. In Airflow, the flow would look as follows:

```python
from __future__ import annotations

import pendulum

from airflow.models.dag import DAG
from airflow.operators.python import PythonOperator

with DAG(
    dag_id="hello-world",
    schedule=None,
    start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    catchup=False,
    tags=["example"],
):
    def hello_world(**kwargs):
        print("Hello World")

    python_task = PythonOperator(task_id="print_hello_world", python_callable=hello_world)
```

The similar workflow in Kestra would look as follows:

```yaml
id: hello-world
namespace: dev
description: Print Hello World

tasks:
  - id: python-script
    type: io.kestra.plugin.scripts.python.Script
    script: |
      print("Hello World")
```

Not a major difference, isn't it?! But as the complexities creep in, you would start noticing some major differences.

## Scripts requiring pip dependencies

As you put in more Python dependencies in the code, you would need to install the corresponding pip packages. This will work seamlessly if these dependencies are part of the main server process, but in case these dependencies are different, you will need to install them explicitly before the Python code is run.

In Airflow, the PythonOperator is incapable of encompassing these new dependencies. You have to change your operator and switch to either PythonVirtualenvOperator or ExternalPythonOperator. With the change of operator, you now need to understand the parameters associated with these operators, and make the changes to incorporate these pip dependencies. 

PythonVirtualenvOperator executes Python callables inside a new Python virtual environment. The `virtualenv` package needs to be installed in the environment that runs Airflow. Here is an example of an Airflow workflow using pip dependency:

```python
def callable_virtualenv():
        """
        Example function that will be performed in a virtual environment.
        """
        from colorama import Fore
        print(Fore.RED + "Hello World in red text")

    virtualenv_task = PythonVirtualenvOperator(
        task_id="virtualenv_hello_world",
        python_callable=callable_virtualenv,
        requirements=["colorama==0.4.0"],
        system_site_packages=False,
    )
```

ExternalPythonOperator, on the other hand, runs the tasks with a different set of Python libraries than other tasks (and than the main Airflow environment) using a different python binary. This might be a virtual environment or any installation of Python that is preinstalled and available in the environment where Airflow task is running. The operator takes Python binary as python parameter.

```python
 def callable_external_python():
        """
        Example function that will be performed in a different python binary.
        """
        from colorama import Fore
        print(Fore.RED + "Hello World in red text")

    external_python_task = ExternalPythonOperator(
        task_id="external_python_hello_world",
        python_callable=callable_external_python,
        python=PATH_TO_PYTHON_BINARY,
    )
```

In Kestra, you can use the exact same task as is. Just add the `pip install` command in the `beforeCommands` parameter so that the pip package installation happens before running the actual script, and you are ready to go! Here is how the flow would appear in Kestra:

```yaml
id: hello-world-colored
namespace: dev
description: Print Hello World

tasks:
  - id: python-script
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install colorama==0.4.0
    script: |
      from colorama import Fore
      print(Fore.RED + "Hello World in red text")
```

This does not affect the Kestra server's python dependecies, as the Python `Script` task, by default, runs as part of the DOCKER runner. The life of this Docker container is until the execution of this task. All the pip dependencies are installed in the context of this container, thus not meddling with the Kestra server.

## Running legacy Python code

Yet another use-case that we generally encounter in the orchestration scenarios is the capability to support legacy Python scripts. These are written on older versions of Python. For example, lets say your orchestration engine is running on Python 3.9, while the legacy Python script is based on Python 2.7. Let us see how we can work with such scripts in our orchestration engines.

This scenario is pretty difficult to handle using Airflow. If you are using the Celery executor, you can run multiple workers that support different python binaries. Some workers running Python 3.9, while some others running Python 2.7. These workers can now listen to different queues. While defining the task, you can specify the `queue` parameter so that the task gets directed to the appropriate workers. All in all, this change is not just limited to code, but involves changing the Airflow infrastructure in itself.

However, handling this use-case in Kestra is a piece of cake! You just need to use Docker image corresponding to the python binary you want. Everything works like magic. Here is an example of how you can run legacy Python script in Kestra:

```yaml
id: hello-world-legacy
namespace: dev
description: Print Hello World

tasks:
  - id: python-script
    type: io.kestra.plugin.scripts.python.Script
    docker: 
      image: docker.io/python:2.7.18-slim-stretch
    script: |
      print "Hello World"
```

## Execution time

One might say that there is an increased execution time each time we run a flow with Python Script task as the task pulls the image, and installs dependencies in every execution. This is not necessarily the case, and there are ways in which you can prevent the recurring image downloads and dependencies installation.

You can set the image `pullPolicy` to `IF_NOT_PRESENT` ensuring that the docker image does not get pulled in case it already exists. 

In case you have multiple pip package dependencies, you can have a custom docker image with the Python binary and all the pip package dependencies installed. This will not require you to install the package dependencies in each execution.

More such practices are detailed [here](https://kestra.io/docs/best-practices/managing-pip-dependencies).

## Conclusion

From the scenarios above, you can clearly see how a simple task of running Python code can become so difficult to handle in Airflow. While it can be so complex to orchestrate a Python task in Airflow, you can only imagine the increasing complexities with other third-party plugins.

Kestra, on the other hand, has been developed taking such real-world scenarios into account. It has abstracted away most of the complexities, and kept the tasks as crisp as possible.

Join the [Slack community](https://kestra.io/slack) where developers share ideas, request new features, and help each other out!
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give a star if you like the project.
