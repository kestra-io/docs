---
title: Process Task Runner – Run Tasks as Local Processes
h1: Run Tasks Locally Without Container Overhead
sidebarTitle: Process Task Runner
icon: /src/contents/docs/icons/concepts.svg
version: ">= 0.18.0"
editions: ["OSS", "EE"]
description: Run Kestra tasks as local processes on the worker node for fast execution without container overhead.
---

Run tasks as local processes.

## Run tasks locally with the Process runner

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CC_CnH74qnk?si=_Pq-GBV2UadYlKxE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The following example shows a shell script configured with the Process task runner, which runs a command as a child process on the Kestra host:

```yaml
id: process_task_runner
namespace: company.team

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - echo "Hello World!"
```

The [Process task runner](/plugins/core/task-runners/runner/io.kestra.plugin.core.runner.process) has no additional configuration properties — only the `type` is required.

:::alert{type="info"}
Script tasks default to the Docker task runner if no `taskRunner` is specified. Set `taskRunner.type` to `io.kestra.plugin.core.runner.Process` explicitly when you want local process execution.
:::

## Working directory and file handling

Before each execution, Kestra prepares a working directory on the worker host. The following variables give your script access to it:

| Variable | Type | Description |
|---|---|---|
| `{{workingDir}}` | Template expression | Absolute path to the working directory |
| `WORKING_DIR` | Environment variable | Same path, available to any subprocess |
| `{{outputDir}}` | Template expression | Dedicated output directory (only when `outputDirectoryEnabled` is set on the task) |
| `OUTPUT_DIR` | Environment variable | Same path as `{{outputDir}}` when available |

**Input files** declared with `inputFiles` and **namespace files** are copied into the working directory before the process starts. **Output files** declared with `outputFiles` must be written to the working directory to be captured by Kestra.

Because the Process runner sets the process working directory to Kestra's working directory, **relative paths work without needing the `{{workingDir}}` prefix** in commands.

The following self-contained example writes a file and captures it as an output:

```yaml
id: process_output_file
namespace: company.team

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    outputFiles:
      - out.txt
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - echo "Hello from Process runner" > out.txt
```

You can also pass an input file into the task and capture a transformed result. The input file is placed in the working directory under the key name you specify in `inputFiles`:

```yaml
id: process_input_output_files
namespace: company.team

inputs:
  - id: file
    type: FILE

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      data.txt: "{{inputs.file}}"
    outputFiles:
      - out.txt
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cp data.txt out.txt
```

## Installing dependencies with beforeCommands

Use `beforeCommands` to install dependencies before the main script runs. When running inside the Kestra Docker image (which manages its own Python environment), pass `--break-system-packages` to avoid conflicts:

```yaml
id: python_with_deps
namespace: company.team

inputs:
  - id: url
    type: URI
    defaults: https://jsonplaceholder.typicode.com/todos/1

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install kestra requests --break-system-packages
    script: |
      import requests
      from kestra import Kestra

      url = "{{ inputs.url }}"

      response = requests.get(url)
      print('Status Code:', response.status_code)
      Kestra.outputs(response.json())
```

:::alert{type="info"}
By default, Python is the only programming language installed in the Kestra Docker image. If you are running Kestra directly on a host machine, whatever is installed on that machine is available to the process. To use other languages, ensure their runtimes are installed in your environment before running Kestra.
:::

## Logs and exit codes

Both stdout and stderr are captured and streamed to Kestra's task logs in real time. Any non-zero exit code causes the task to fail with a `TaskException` reporting the exit code.

## Behavior on worker interruption

When the Kestra worker is stopped or interrupted:

1. The running process **and all its child processes** are killed immediately.
2. The task is marked as failed.
3. When the worker restarts, Kestra re-queues the task execution from the beginning.

There is no process-level resume — the task restarts from scratch on the next attempt.

## Considerations

- **No isolation**: Unlike the Docker task runner, the Process runner provides no container boundary. Subprocesses run with the same OS user and permissions as the Kestra worker JVM, inherit the worker's full environment, and share host CPU, memory, and disk with other running tasks.
- **Platform support**: Works on Linux, macOS, and Windows.
- **Dependencies**: Any tool or library used by the script must already be installed on the worker host (or installed via `beforeCommands`).

## Benefits

The Process task runner is well suited when you need to:

- Access local files or hardware (e.g., GPUs, local databases)
- Reuse locally configured software libraries or virtual environments
- Avoid the overhead of container startup

## Combining task runners with Worker Groups

You can combine the Process task runner with [Worker Groups](../../../07.enterprise/04.scalability/worker-group/index.md) to run tasks on dedicated servers that have specific software libraries or configurations. This combination allows you to leverage the compute resources of your Worker Groups while running tasks as local processes, without the overhead of containerization.

The following example demonstrates how to combine the Process task runner with Worker Groups to fully leverage the GPU resources of a dedicated server:

```yaml
id: python_on_gpu
namespace: company.team

tasks:
  - id: gpu_intensive_ai_workload
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    commands:
      - python main.py
    workerGroup:
      key: gpu
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
```

:::alert{type="info"}
Note that Worker Groups are an Enterprise Edition feature. To try them out, please [reach out](/demo).
:::
