---
title: "Python Subprocess: Orchestrating External Commands with Kestra"
description: "The Python `subprocess` module enables scripts to run external programs and interact with their I/O. Learn how to use it effectively and how Kestra orchestrates these processes for robust, scalable automation."
metaTitle: "Python Subprocess: Orchestrating External Commands | Kestra"
metaDescription: "Master Python's `subprocess` module for external command execution. Learn how Kestra orchestrates subprocess calls with robust error handling and scalability."
tag: "data"
date: 2026-07-07
slug: "python-subprocess"
faq:
  - question: "What is a subprocess in Python?"
    answer: "A subprocess in Python refers to a program or command executed by a Python script, running independently from the main Python process. The `subprocess` module allows Python to interact with these external programs, managing their input, output, and return codes. This is crucial for integrating Python scripts with system commands, shell scripts, or other executables."
  - question: "What is the best way to use subprocess in Python?"
    answer: "The `subprocess.run()` function is generally the best and safest way for most use cases, providing a high-level API to execute commands and capture results. For more complex scenarios requiring finer control over I/O streams, non-blocking calls, or long-running processes, `subprocess.Popen()` offers greater flexibility. Always prioritize security best practices like avoiding `shell=True` with untrusted input."
  - question: "Why is subprocess better than OS system?"
    answer: "The `subprocess` module is a significant improvement over `os.system()` because it offers much finer control, better security, and more robust error handling. `os.system()` executes commands directly in a shell, making it susceptible to shell injection vulnerabilities and limiting I/O capture. `subprocess` allows direct execution without a shell, secure argument passing, and explicit control over pipes and return codes."
  - question: "Do you need to pip install subprocess?"
    answer: "No, the `subprocess` module is part of Python's standard library. This means it comes pre-installed with any Python distribution and does not require a `pip install` command. You can import it directly into your Python scripts using `import subprocess`."
  - question: "Does subprocess run return anything?"
    answer: "Yes, `subprocess.run()` returns a `CompletedProcess` object. This object contains several useful attributes, including `args` (the command run), `returncode` (the exit status of the subprocess), `stdout` (the captured standard output), and `stderr` (the captured standard error). These attributes allow for comprehensive inspection of the subprocess's execution."
---

> **TL;DR** — The Python `subprocess` module allows Python programs to execute external commands or other programs, managing their input, output, and return codes. It's essential for system interaction, shell command execution, and integrating with non-Python tools, offering fine-grained control and security over `os.system()` for robust process management.

Integrating Python with external programs and system commands is a common requirement for data engineers and system administrators alike. Whether it's invoking a shell script, running a command-line utility, or interacting with a legacy system, Python's `subprocess` module serves as the crucial bridge. However, directly managing these external processes in isolation often leads to challenges in error handling, resource management, and scalability.

This guide explores the `subprocess` module in depth, from its basic functions to advanced techniques. We will then demonstrate how Kestra, an open-source orchestration platform, elevates `subprocess` usage by providing a robust, declarative framework that transforms isolated command executions into reliable, observable, and production-ready workflows.

## Understanding Python's Subprocess Capabilities

### What Defines a Subprocess in Python?
A subprocess is a child process spawned by a parent process. In this context, your Python script is the parent process, and any external command or program it executes is the child subprocess. The `subprocess` module provides the tools to create and manage these child processes, allowing your Python code to run other programs, wait for their completion, and interact with their input/output streams.

### Why Subprocess is Indispensable for Modern Python Applications
The `subprocess` module is a cornerstone of system integration for several reasons:
- **Language Agnosticism:** It allows Python to integrate with tools and scripts written in any language, as long as they can be executed from the command line.
- **System Automation:** It enables the automation of administrative tasks, such as managing files, controlling services, or running system diagnostics.
- **Legacy Integration:** It provides a pathway to interact with older, command-line-based systems that lack modern APIs.
- **Parallel Processing:** It can be used to offload work to external processes, leveraging multiple CPU cores.

### Subprocess vs. `os.system()`: A Leap in Control and Security
Before the `subprocess` module, `os.system()` was the standard for executing shell commands. However, it has significant drawbacks:
- **Security Risks:** `os.system()` executes commands through the system's shell, making it vulnerable to shell injection attacks if user input is not properly sanitized.
- **Limited Control:** It provides no easy way to capture the command's standard output or error. You only get the return code.
- **Blocking Nature:** It blocks the parent process until the command completes, offering no mechanism for asynchronous execution.

The `subprocess` module addresses these issues by providing a more direct, secure, and flexible API for process management.

## Mastering Core `subprocess` Functions

### The `subprocess.run()` Function for Simplified Execution
Introduced in Python 3.5, `subprocess.run()` is the recommended high-level function for most use cases. It simplifies the process of running a command and waiting for it to complete.

```python
import subprocess

# Execute a simple command
result = subprocess.run(["ls", "-l"], capture_output=True, text=True)

print("Return Code:", result.returncode)
print("Stdout:", result.stdout)
print("Stderr:", result.stderr)
```
Key arguments:
- `capture_output=True`: Captures `stdout` and `stderr`.
- `text=True`: Decodes `stdout` and `stderr` as text using the default encoding.
- `check=True`: Raises a `CalledProcessError` if the return code is non-zero.

### Gaining Granular Control with `subprocess.Popen()`
For more complex interactions, such as non-blocking execution or managing long-running processes, `subprocess.Popen()` provides a lower-level, more flexible interface. It creates a new process and returns a `Popen` object, allowing you to interact with it while it runs.

```python
import subprocess

# Start a process and communicate with it
process = subprocess.Popen(["grep", "python"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)

# Send data to stdin and get output from stdout
stdout, stderr = process.communicate(input="hello\npython\nworld")

print("Output:", stdout)
```
`Popen` is ideal for scenarios where you need to manage I/O streams in real-time or run multiple processes concurrently.

### Executing Shell Commands Safely and Effectively
While it's best to avoid the shell when possible, sometimes you need to execute a command that relies on shell features like pipes or wildcards. The `subprocess` module allows this with the `shell=True` argument, but it must be used with extreme caution.

**Unsafe Example (Vulnerable to Injection):**
```python
# Unsafe if filename comes from user input
filename = "some_file.txt; rm -rf /"
subprocess.run(f"ls {filename}", shell=True)
```

**Safe Approach (Passing Arguments as a List):**
The safest method is to pass commands and arguments as a sequence (a list of strings). This bypasses the shell and prevents injection.
```python
subprocess.run(["ls", "-l", "some_file.txt"])
```

## Handling Input, Output, and Errors in Subprocesses

### Capturing Standard Output and Error Streams
Using `capture_output=True` with `subprocess.run()` or setting `stdout=subprocess.PIPE` and `stderr=subprocess.PIPE` with `subprocess.Popen()` allows you to capture the output of a command for further processing in your Python script.

### Redirecting Input to a Subprocess for Dynamic Operations
You can pass data to a subprocess's standard input using the `input` argument in `run()` or the `communicate()` method of a `Popen` object. This is useful for piping data from your Python script into a command-line tool.

### Interpreting Return Codes and Managing Exceptions
A return code of `0` typically signifies success, while any non-zero value indicates an error. By setting `check=True` in `subprocess.run()`, you can automatically raise a `CalledProcessError` on failure, simplifying error handling with standard `try...except` blocks.

### How `subprocess.run()` Delivers Execution Results
The `subprocess.run()` function returns a `CompletedProcess` object. This object is a container for all the information about the completed process, including `returncode`, `stdout`, and `stderr`, providing a structured way to inspect the outcome of the command.

## Advanced `subprocess` Techniques for Complex Scenarios

### Chaining Commands with Pipes for Data Flow
You can replicate shell pipes by creating multiple `Popen` objects and connecting the `stdout` of one process to the `stdin` of another.

```python
import subprocess

p1 = subprocess.Popen(["dmesg"], stdout=subprocess.PIPE)
p2 = subprocess.Popen(["grep", "hda"], stdin=p1.stdout, stdout=subprocess.PIPE)
p1.stdout.close()  # Allow p1 to receive a SIGPIPE if p2 exits.
output = p2.communicate()[0]
```

### Implementing Timeouts and Non-Blocking Calls
The `timeout` parameter in `run()` and `communicate()` allows you to set a limit on how long a process can run. If the timeout is exceeded, a `TimeoutExpired` exception is raised.

### Controlling Environment Variables for Subprocess Isolation
The `env` argument allows you to specify the environment variables for the new process. This is useful for running commands in an isolated or customized environment without modifying the parent script's environment.

## Why `subprocess` Operations Demand Orchestration
While the `subprocess` module is powerful for executing individual commands, managing complex, multi-step workflows in production requires a higher-level solution. Relying solely on Python scripts to chain `subprocess` calls introduces several challenges:
- **Scheduling and Automation:** Cron is a common starting point, but it lacks features for dependency management, backfills, and dynamic scheduling.
- **Centralized Logging and Observability:** Without an orchestration platform, logs from external commands are scattered, making it difficult to debug failures across a distributed system.
- **Robust Error Handling:** A simple script might exit on failure, but a production workflow needs configurable retries, alerting mechanisms, and conditional failure paths.
- **Dependency Management:** Ensuring that one command runs only after another has succeeded, and passing data between them, becomes complex to manage manually.
- **Security and Credentials:** Securely managing secrets and credentials used by external commands is a significant challenge in a script-based environment.
- **Environment Consistency:** An orchestrator ensures that your subprocesses run in consistent, containerized environments, eliminating "it works on my machine" issues.

## Orchestrate Python Subprocess with Kestra: A Practical Example
Kestra provides a declarative YAML interface to define and manage complex workflows, including those that execute Python scripts and shell commands. This approach turns fragile scripts into robust, observable, and scalable pipelines.

The following Kestra flow demonstrates how to execute both a Python script using `subprocess` and a direct shell command, capture their outputs, and handle errors gracefully.

```yaml
id: python-subprocess-orchestration
namespace: dev.examples

tasks:
  - id: python_task
    type: io.kestra.plugin.scripts.python.Script
    description: "Runs a Python script that uses subprocess to list files."
    warningOnStdErr: false
    script: |
      import subprocess
      import sys

      print("--- Running ls -l via Python subprocess ---")
      try:
        result = subprocess.run(
          ["ls", "-l"], 
          capture_output=True, 
          text=True, 
          check=True
        )
        print(result.stdout)
        # Kestra can capture metrics from scripts
        print("::metrics::\n- name: file_count\n  type: counter\n  value: ", len(result.stdout.splitlines()))
        print("::/metrics::")
      except subprocess.CalledProcessError as e:
        print(f"Subprocess failed with return code {e.returncode}", file=sys.stderr)
        print(f"Stderr: {e.stderr}", file=sys.stderr)
        sys.exit(1)
      except FileNotFoundError:
        print("Error: 'ls' command not found.", file=sys.stderr)
        sys.exit(1)

  - id: shell_task
    type: io.kestra.plugin.scripts.shell.Commands
    description: "Runs the same command directly as a shell task."
    runner: PROCESS
    commands:
      - echo "--- Running ls -l via Shell task ---"
      - ls -l

  - id: success_notification
    type: io.kestra.plugin.notifications.slack.SlackExecution
    description: "Notify on success"
    url: "{{ secret('SLACK_WEBHOOK') }}"
    message: "Flow `{{ flow.namespace }}.{{ flow.id }}` succeeded for execution `{{ execution.id }}`."
    
errors:
  - id: failure_notification
    type: io.kestra.plugin.notifications.slack.SlackExecution
    description: "Notify on failure"
    url: "{{ secret('SLACK_WEBHOOK') }}"
    message: "Flow `{{ flow.namespace }}.{{ flow.id }}` failed for execution `{{ execution.id }}`."
```

What this Kestra flow demonstrates:
- **Isolated Environments:** Both the [Python Script task](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script) and the [Shell Commands task](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.commands) run in isolated environments (Docker by default), ensuring consistency. You can also run them directly on the Kestra host via the `runner: PROCESS` property.
- **Automatic Output Capture:** Kestra automatically captures `stdout` and `stderr` from every task, making them available in the UI and for downstream tasks without manual piping.
- **Declarative Error Handling:** The `errors` block provides a clean, declarative way to define actions upon failure, such as sending a Slack notification, without cluttering the main logic.
- **Metrics and Observability:** The Python script demonstrates how to emit custom metrics that Kestra collects and displays, providing deeper insight into your workflow's execution.

## Where Orchestrated Subprocess Workflows Pay Off
- **Data Ingestion and Transformation:** Automate workflows that call external tools like `curl`, `jq`, or custom binaries to fetch and process data.
- **Legacy System Integration:** Create reliable pipelines that interact with older systems via their command-line interfaces.
- **Infrastructure Automation:** Orchestrate system administration tasks, database backups, or cloud CLI commands as part of a larger workflow.
- **Machine Learning Operations:** Run model training or inference scripts, manage dependencies, and version artifacts in a reproducible manner.
- **CI/CD Pipelines:** Build complex continuous integration and deployment pipelines that invoke external build tools, compilers, or deployment scripts.

Kestra provides the necessary control plane to manage these `subprocess`-driven tasks at scale, ensuring reliability and maintainability. For more details on running scripts, you can explore blueprints like how to [run a Shell script as a subprocess on the Kestra host](/blueprints/process-script-runner).

## Related Concepts for Robust Workflow Management
- **[Python Orchestration](/features/code-in-any-language/python):** Explore how Kestra provides first-class support for Python workflows.
- **[Orchestrate Python Workflows](/docs/use-cases/python-workflows):** A deeper dive into patterns for building complex Python-based pipelines.
- **[YAML vs Python Workflows](/blogs/yaml-vs-python-workflow):** Understand the trade-offs between declarative and imperative workflow definitions.
- **[Manage Python Dependencies in Kestra](/docs/how-to-guides/python-dependencies):** Learn how to handle external libraries for your Python scripts.
- **[Process Task Runner](/docs/task-runners/types/process-task-runner):** Discover how to run tasks as local processes for maximum performance.
- **[Access Local Files in Kestra](/docs/how-to-guides/access-local-files):** Learn how to interact with the local filesystem from your orchestrated tasks.

To learn more about what you can build, check out our [Data Engineering Resources](/resources/data) or explore how Kestra can serve as your main [control plane for data orchestration](/data).
