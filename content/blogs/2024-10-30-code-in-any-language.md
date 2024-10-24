---
title: "Code in any Language in Kestra"
description: "Chose the right tool for the job by keeping your business logic and orchestration logic separate."
date: 2024-10-30T12:00:00
category: Solutions
author:
  name: Will Russell
  image: "wrussell"
image: /blogs/2024-10-30-code-in-any-language.jpg
---

There are many different programming languages, all with different key benefits that make them the right tool for a particular job. That’s why at Kestra we believe it’s important that your business logic is separate from your orchestration logic so you can pick the right tool for each job. Many orchestrators have your business logic and orchestration logic together, for example using Python. This restricts your options if you requirements change in the future.

While Python is a great tool for many problems, it’s not always the best choice for your business logic. For example, some use cases work best using a compiled language like C or Rust for performance advantages, whereas others benefit from the flexibility and ease of using an interpreted language like Python. 

Another scenario might be that your team is familiar with a specific stack, like Ruby, which is why you want to use that for your business logic as operating faster is more important than code performance. Kestra makes this easy by allowing you to use any programming language.

In Kestra, we have a number of dedicated plugins to allow you to use your favorite programming languages in a few lines of YAML. For each of these plugins, there’s the option to write your code directly inside of the task called `Script` tasks, or to run a command to run a dedicated file called `Commands` Tasks. 

This flexibility means you can keep shorter snippets inside of your YAML without having to introduce multiple files, but for larger more complex projects, you can write them locally in your IDE, push them to Git, and then sync them directly into your Kestra instance for your workflow to execute.

The example below uses the `pandas` library to get the total revenue from a CSV file of orders and then print it to the terminal:

```python
import pandas as pd

df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
total_revenue = df['total'].sum()
print(f'Total Revenue: ${total_revenue}')
```

Using this example, we can write this both as a `Script` task and a `Commands` task.

## Write code directly inside your workflow

Taking the example above, we can paste it directly into a new `Script` task. To do this, we need to write the code inline after the `script` property, and install the `pandas` with the `beforeCommands` property.

```yaml
id: example
namespace: company.team

tasks:
  - id: python_script
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install pandas
    script: |
      import pandas as pd

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      print(f'Total Revenue: ${total_revenue}')
```

And just like that, in a few lines of YAML, we have a workflow that can run our Python code. By default, these tasks will run inside of a Docker container via a [Task Runner](../docs/task-runners/index.md) to isolate dependencies from other tasks, but also allow us to specify container images that have dependencies pre-installed.

Below we have an example where we’ve explicitly defined our Docker Task Runner to make it clearer what’s going on under the hood. However, you can still use the `containerImage` property without explicitly defining the task runner. By using the `containerImage` property, we can pick a Python image that includes some pre-installed libraries reducing the need to use `beforeCommands` . 

In this case, we’re using the `pydata` image which comes with a few useful libraries like `pandas` bundled in. When we run this example, it pulls the docker image and then starts to run our code without issue as the dependencies we need are baked into the image:

```yaml
id: example
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

The other perk of using the `Script` task is that we can easily use expressions to make our code more dynamic. In the next example, we've made the dataset URL an input and used an expression to add it to our code at execution. This means we can change the dataset every time we execute our workflow, making our workflow more dynamic.

```yaml
id: example
namespace: company.team

inputs:
  - id: dataset_url
    type: STRING
    defaults: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

tasks:
  - id: python_script
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      import pandas as pd

      df = pd.read_csv('{{ inputs.dataset_url }}')
      total_revenue = df['total'].sum()
      print(f'Total Revenue: ${total_revenue}')
```

## Write code in a separate file

If our Python file was much larger and or involved multiple scripts, we should use the `Commands` task instead. We can take the Python code and put it into a file called `example.py` under the `company.team` namespace. 

One key difference here is the `namespaceFiles` property which allows the task to see files stored in the namespace. This means when we run the task, the container will have these files inside of it for us to use. We can either enable this for all files, or use the `includes` and `excludes` property to specify specifics if we want to avoid unrelated or sensitive files being accessed by mistake.

```yaml
id: example
namespace: company.team

tasks:
  - id: python_commands
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    containerImage: ghcr.io/kestra-io/pydata:latest
    commands:
      - python example.py
```

While the Script task made it easy to add dynamic values to our code, we can do the same by passing them into the task as an environment variable and then retrieving them in our Python code using `os.environ`.

```yaml
id: example
namespace: company.team

inputs:
  - id: dataset_url
    type: STRING
    defaults: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

tasks:
  - id: python_commands
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    containerImage: ghcr.io/kestra-io/pydata:latest
    env:
      DATASET_URL: "{{ inputs.dataset_url }}"
    commands:
      - python example.py
```

We can modify our Python to fetch the environment variable with `os.environ['DATASET_URL']`:

```python
import pandas as pd
import os

df = pd.read_csv(os.environ['DATASET_URL'])
total_revenue = df['total'].sum()
print(f'Total Revenue: ${total_revenue}')
```

Both the `Script` and `Commands` tasks have their benefits allowing you to decide which one is best suited to you.

## Write code with the Shell task

While not all languages have dedicated plugins, it’s still simple to use other languages. For languages without dedicated plugins, we can use the Shell Commands task inside of a Docker Task Runner to run any language we need. We can easily specify a container image that has the correct dependencies for the language we want to use, similarly to the python example using the `pydata` image with bundled in dependencies. On top of that, we can run any setup or compile commands prior to running our code. 

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

On top of that, we can also still write our code inline too if we’d prefer using the `inputFiles` property. Typically, this property is used for passing files into a task from a FILE input or a file output from an earlier task. Despite this, we can still use it for writing the file inline by using a pipe, allowing us to get the same benefits as the dedicated plugins. We will still run the same command as if the file was a namespace file. Another thing to note is we don’t need to use the `namespaceFiles` property because we’re using the `inputFiles` property to specify files available.

We can recreate the same example we used in Python below, as well as making it dynamic. Let's look at the example below:

1. We use an input to dynamically pass the dataset_url at execution.
2. Using the `http.Download` task, we will download the dataset so we can pass it to our C code with the `inputFiles` property.
3. We use `scripts.shell.Commands` task with a `gcc` container image to create a shell environment with the correct tools needed to compile and execute C code.
5. We pass the csv file into the `inputFiles` property so it's in the same directory as the C code at execution.
4. Our code is written inline through the `inputFiles` property.
6. We use `gcc` to first compile the code, before executing it in a separate command.

```yaml
id: c_example
namespace: company.team

inputs:
  - id: dataset_url
    type: STRING
    defaults: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

tasks:
  - id: download_dataset
    type: io.kestra.plugin.core.http.Download
    uri: "{{ inputs.dataset_url }}"

  - id: c_code
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: gcc:latest
    commands:
      - gcc example.c
      - ./a.out
    inputFiles:
      orders.csv: "{{ outputs.download_dataset.uri }}"
      example.c: |
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        int main() {
            FILE *file = fopen("orders.csv", "r");
            if (!file) {
                printf("Error opening file!\n");
                return 1;
            }

            char line[1024];
            double total_revenue = 0.0;

            fgets(line, 1024, file);
            while (fgets(line, 1024, file)) {
                char *token = strtok(line, ",");
                int i = 0;
                double total = 0.0;
                
                while (token) {
                    if (i == 6) { // Assuming the 'total' column is the 7th column
                        total = atof(token);
                        total_revenue += total;
                    }
                    token = strtok(NULL, ",");
                    i++;
                }
            }

            fclose(file);
            printf("Total Revenue: $%.2f\n", total_revenue);

            return 0;
        }
```

When we execute this, we'll get the same result in the terminal but using a completely different programming language. This flexibility means we can easily pick a programming language that suits the task at hand, while using the same straightforward process to orchestrate it with Kestra. 

This is just the start of what you can do with Kestra’s scripts plugin group. We can expand this further by generating task outputs from our code, as well as writing output files for later tasks to use as well. If you'd like to learn more, check out the [dedicated documentation](../docs/04.workflow-components/01.tasks/02.scripts/index.md).
