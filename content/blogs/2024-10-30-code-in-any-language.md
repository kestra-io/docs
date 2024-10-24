---
title: "Code in any Language in Kestra"
description: "Chose the right tool for the job by keeping your business logic and orchestration logic separate"
date: 2024-10-30T12:00:00
category: Solutions
author:
  name: Will Russell
  image: "wrussell"
image: /blogs/2024-10-30-code-in-any-language.jpg
---


# Program In Any Language in Kestra

There are many different programming languages, all with different key benefits that make them the right tool for a particular job. That’s why at Kestra we believe it’s important that your business logic is separate from your orchestration logic so you can pick the right tool for each job. Many orchestrators have your business logic and orchestration logic together, for example using Python. This restricts your options if you requirements change in the future.

While Python is a great tool for many problems, it’s not always the best choice for your business logic. For example, some use cases work best using a compiled language like C or Rust for performance advantages, whereas others benefit from the flexibility and ease of using an interpreted language like Python. Another scenario might be that your team is familiar with a specific stack, like Ruby, which is why you want to use that for your business logic as operating faster is more important than code performance. Kestra makes this easy by allowing you to use any programming language.

## Dedicated Plugins

In Kestra, we have a number of dedicated plugins to allow you to use your favorite programming languages in a few lines of YAML. For each of these plugins, there’s the option to write your code directly inside of the task called `Script` tasks, or to run a command to run a dedicated file called `Commands` Tasks. This flexibility means you can keep shorter snippets inside of your YAML without having to introduce multiple files, but for larger more complex projects, you can write them locally in your IDE, push them to Git, and then sync them directly into your Kestra instance for your workflow to execute.

For example, we can write this Python example both as a `Script` task and a `Commands` task. The Python code we’ll use can be found below:

```python
import requests

r = requests.get('https://api.github.com/repos/kestra-io/kestra')
gh_stars = r.json()['stargazers_count']
print(gh_stars)
```

This example uses the `requests` library to fetch the number of stars on the Kestra repository and then print it to the terminal. We can now take this and insert it into a workflow. For a `Script` task, we can write the code inline after the `script` property, and install the `requests` with the `beforeCommands` property.

```yaml
id: api_example
namespace: company.team

tasks:
  - id: python_script
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install requests
    script: |
      import requests

      r = requests.get('https://api.github.com/repos/kestra-io/kestra')
      gh_stars = r.json()['stargazers_count']
      print(gh_stars)
```

And just like that, in a few lines of YAML, we have a workflow that can run our Python code. By default, these tasks will run inside of a Docker container via a Task Runner to isolate dependencies from other tasks, but also allow us to specify container images that have dependencies pre-installed.

Below we have an example where we’ve explicitly defined our Docker Task Runner to make it clearer what’s going on under the hood. However, you can still use the `containerImage` property without explicitly defining the task runner. By using the `containerImage` property, we can pick a Python image that includes some pre-installed libraries reducing the need to use `beforeCommands` . In this case, we’re using the `pydata` image which comes with a few useful libraries like `pandas` bundled in. When we run this example, it pulls the docker image and then starts to run our code without issue as the dependencies we need are baked into the image:

```yaml
id: api_example
namespace: company.team

tasks:
  - id: python_script
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      import pandas as pd

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      print(f'Total Revenue: ${total_revenue}')
```

The other perk of using the `Script` task is that we can easily use expressions to make our code more dynamic.

### Executing code from files

If our Python file was much larger and or involved multiple scripts, we should use the `Commands` task instead. We can take the Python code and put it into a file called `api_example.py` .

```yaml
id: api_example
namespace: company.team

tasks:
  - id: python_commands
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    beforeCommands:
      - pip install requests
    commands:
      - python api_example.py
```

One key difference here is the `namespaceFiles` property which allows the task to see files stored in the namespace. This means when we run the task, the container will have these files inside of it for us to use / run commands on. We can either enable this for all files, or use the `includes` and `excludes` property to specify specifics if we want to avoid unrelated or sensitive files being accessed by mistake.

## Using Languages with the Shell task

While not all languages have official plugins, it’s still simple to use other languages. For languages without official plugins, we can use the Shell Commands task inside of a Docker Task Runner to run any language we need. We can easily specify a container image that has the correct dependencies for the language we want to use, as well as run any setup or compile commands prior to running our code.

For example, we can run C inside of a workflow by using the Shell Commands task using a `gcc` container image as we need `gcc` to compile our C code before we can execute it.

```yaml
id: c_example
namespace: company.team

tasks:
  - id: c_code
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: gcc:latest
    namespaceFiles:
      enabled: true
    commands:
      - gcc hello_world.c
      - ./a.out
```

On top of that, we can also still write our code inline too if we’d prefer using the `inputFiles` property. Typically, this property is used for passing files into a task from a FILE input or a file output from an earlier task. Despite this, we can still use it for writing the file inline by using a pipe, allowing us to get the same benefits as the dedicated plugins. We will still run the same command as if the file was a namespace file.

```yaml
id: c_example
namespace: company.team

tasks:
  - id: c_code
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: gcc:latest
    commands:
      - gcc hello_world.c
      - ./a.out
    inputFiles:
      hello_world.c: |
        #include <stdio.h>

        int main() {
          printf("Hello, World!");
          return 0;
        }
```

Another thing to note is we don’t need to use the `namespaceFiles` property because we’re using the `inputFiles` property to specify files available.

This is just the start of what you can do with Kestra’s scripts plugin group To learn more, check out the [dedicated documentation](../docs/04.workflow-components/01.tasks/02.scripts/index.md).