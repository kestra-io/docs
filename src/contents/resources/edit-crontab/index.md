---
title: "How to Edit Crontab: A Guide to Managing Scheduled Jobs"
description: "How to edit a crontab with `crontab -e`, change the default editor, list and remove entries, avoid common mistakes, and when to move production schedules to an orchestrator."
metaTitle: "How to Edit Crontab: crontab -e, Editors and Pitfalls"
metaDescription: "How to edit crontab on Linux: crontab -e, changing the default editor, listing and removing jobs, common schedules, and fixing jobs that do not run."
tag: infrastructure
date: 2026-11-25
slug: edit-crontab
faq:
  - question: "How do I edit my crontab?"
    answer: "You can edit your crontab using the `crontab -e` command in your terminal. This opens your user's crontab file in the default text editor, allowing you to add, modify, or delete scheduled tasks. After making changes, save and exit the editor for them to take effect."
  - question: "How to set a cron job for every 30 minutes?"
    answer: "To schedule a cron job to run every 30 minutes, you would use `*/30 * * * *` as the schedule expression, followed by the command to execute. For example, `*/30 * * * * /path/to/your/script.sh` will run the script at 0 and 30 minutes past every hour."
  - question: "How to set a cron job to run every 2 hours?"
    answer: "To set a cron job to run every 2 hours, you can use `0 */2 * * *` as the schedule expression. This will execute the command at the beginning of every second hour (e.g., 00:00, 02:00, 04:00, etc.). For instance, `0 */2 * * * /usr/bin/my_command`."
  - question: "How to set crontab for every 15 minutes?"
    answer: "To schedule a cron job to run every 15 minutes, use `*/15 * * * *` as the schedule expression. This tells cron to run the command at minutes 0, 15, 30, and 45 of every hour. For example, `*/15 * * * * echo 'Hello' >> /tmp/log.txt`."
  - question: "What are the limitations of crontab for production use?"
    answer: "Crontab has no built-in dependency management, retries, alerting, or central view of runs, all of which production jobs usually need. It also doesn't offer easy version control or a clear overview of all scheduled jobs, making debugging and maintenance challenging at scale."
  - question: "Can Kestra replace crontab?"
    answer: "For production schedules, yes. Kestra's Schedule trigger accepts the same cron expressions, and the flow adds retries, failure alerts, and an execution history with logs. Existing scripts can keep running on the same host over SSH, so moving a job does not require rewriting it."
  - question: "How do I change the default editor for crontab?"
    answer: "You can change the default editor for crontab by setting the `EDITOR` environment variable. For a single session, type `export EDITOR=nano` (or `vim`) before running `crontab -e`. For a permanent change, add this line to your shell's profile file, such as `~/.bashrc` or `~/.zshrc`."
---

> **TL;DR** — Run `crontab -e` to edit your user's cron table in the editor set by `EDITOR`, `crontab -l` to list it, and `crontab -r` to delete it. Each line is a five-field schedule followed by a command. Cron suits simple jobs on one machine; production schedules need retries, alerts, and history.

For decades, `cron` has been the go-to utility for scheduling automated tasks on Unix-like systems. Its simplicity makes it a good fit for basic, repetitive jobs, from system maintenance scripts to routine backups. As infrastructure grows and those jobs become business-critical, its limits start to show.

This guide will walk you through the essentials of editing crontab entries, mastering syntax, and troubleshooting common issues. It then covers where cron falls short in production and how to run the same schedules in an orchestrator such as Kestra.

## How Crontab Editing Works

The primary way to interact with your scheduled jobs is through the `crontab` command. Each user on a system can have their own crontab file, stored under `/var/spool/cron/crontabs` on Debian and Ubuntu or `/var/spool/cron` on Red Hat based systems. Do not edit these files directly; use the [`crontab` command](https://man7.org/linux/man-pages/man1/crontab.1.html), which validates the file and notifies the cron daemon.

To edit your user's crontab, run:
```bash
crontab -e
```
This command opens the crontab file in your system's default text editor. If you're a first-time user on some systems, you might be prompted to choose an editor like `nano` or `vim`. Many users find themselves unexpectedly in `vim`, which has a steeper learning curve.

To change the editor for the current session, you can set the `EDITOR` environment variable before running the command:
```bash
export EDITOR=nano
crontab -e
```
To make this change permanent, add the `export EDITOR=nano` line to your shell's configuration file, such as `~/.bashrc`, `~/.zshrc`, or `~/.profile`.

Other essential `crontab` commands include:
- `crontab -l`: Lists the current user's cron jobs.
- `crontab -r`: Removes the current user's entire crontab file. **Use this with extreme caution**: by default there is no confirmation prompt (some implementations offer `-i` to ask first). Run `crontab -l > crontab.bak` before editing to keep a backup.
- `sudo crontab -u <username> -e`: Edits the crontab for another user, assuming you have the necessary root permissions.



## Understanding Crontab Syntax and Common Schedules

A crontab entry consists of two parts: the schedule expression and the command to run. The schedule is defined by five fields, documented in [crontab(5)](https://man7.org/linux/man-pages/man5/crontab.5.html):

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *  /path/to/command
```

Here are some common scheduling patterns:

- **Every 15 minutes:**
  ```
  */15 * * * * /path/to/your/script.sh
  ```
- **Every 30 minutes:**
  ```
  */30 * * * * /path/to/your/script.sh
  ```
- **Every 2 hours:**
  ```
  0 */2 * * * /path/to/your/script.sh
  ```
- **Once a day at midnight:**
  ```
  0 0 * * * /path/to/your/script.sh
  ```

Cron expressions cover fixed intervals well. Dependencies between jobs, time zones per job, or calendars with exceptions need more than cron syntax; the [cron replacement guide](/resources/infrastructure/cron-replacement) compares the options.

## Why Reliable Orchestration Beyond Crontab is Essential

`crontab` is enough for simple tasks, but it falls short in production, where reliability and maintainability matter.

- **Lack of Dependency Management:** Cron jobs are isolated. There is no built-in way to define that `jobB` should only run after `jobA` succeeds.
- **Poor Error Handling and Recovery:** If a cron job fails, it fails silently unless you've manually configured output redirection. There are no automatic retries or alerting mechanisms.
- **Limited Observability:** Troubleshooting requires manually searching through system logs. There is no centralized dashboard to view execution history, logs, or performance metrics. This contrasts sharply with modern [workflow observability](/resources/infrastructure/workflow-observability) platforms.
- **Version Control Challenges:** Crontab files are often edited directly on servers, making it difficult to track changes, review updates, or roll back to a previous version. This is a significant departure from GitOps best practices.
- **Complex Permissions and Environments:** Jobs run with the environment variables of the user who owns the crontab, which can lead to "it works for me" issues. Managing paths and permissions for different users becomes a maintenance burden.
- **Single Point of Failure:** The cron daemon itself can fail, or the machine it runs on can go down, taking all scheduled jobs with it.

These limitations lead many teams to a dedicated [job scheduler](/resources/infrastructure/job-scheduler) or a full orchestration platform.

## Orchestrate Scheduled Tasks with Kestra: An Advanced Approach

Instead of scattering crontab entries across multiple servers, you can define, monitor, and manage all your scheduled tasks in one place with Kestra. 

Consider a simple daily cleanup script. In a crontab, it might look like this:
`0 2 * * * /path/to/cleanup.sh >> /var/log/cleanup.log 2>&1`

Here is the same job in Kestra. The script stays on the server and runs over SSH, so nothing needs to be rewritten:

```yaml
id: daily-cleanup
namespace: company.team.ops

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"

tasks:
  - id: run_cleanup_script
    type: io.kestra.plugin.fs.ssh.Command
    host: ops-server.internal
    authMethod: PUBLIC_KEY
    username: ops
    privateKey: "{{ secret('OPS_SSH_KEY') }}"
    commands:
      - /path/to/cleanup.sh
    retry:
      type: constant
      maxAttempts: 3
      interval: PT10M

errors:
  - id: send_failure_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Daily cleanup failed after retries (flow {{ flow.id }}, execution {{ execution.id }})."}
```

The schedule is the same cron expression, with a few differences:

- **Declarative and Version-Controlled:** The entire workflow is a YAML file that can be stored in Git, reviewed, and versioned.
- **Built-in Retries:** The `retry` block automatically re-runs the script if it fails, preventing transient issues from causing a permanent failure.
- **Automatic Error Handling:** The `errors` block runs only on failure and sends an alert to Slack with the execution ID.
- **Centralized Observability:** All executions, logs, and outcomes are visible in the Kestra UI, providing a complete audit trail.
- **Not tied to one machine's crontab:** the schedule lives in Kestra, and the target host is just a property of the task.

To learn more about scheduling in Kestra, check the [Schedule trigger documentation](/docs/workflow-components/triggers/schedule-trigger). For a detailed walkthrough, see our guide on how to [migrate from cron to Kestra](/resources/infrastructure/migrate-from-cron).

## Where Crontab Management Pays Off

Despite its limitations, `crontab` still has its place. It excels at:

- **Simple, Isolated Tasks:** Running a script on a single machine that has no external dependencies.
- **System-Level Maintenance:** Performing routine tasks like log rotation or temporary file cleanup on a specific server.
- **Quick, Experimental Jobs:** Setting up a one-off scheduled command for development or testing purposes.

Once a task becomes part of a larger business process, involves multiple systems, or needs to be reliable, move it to an orchestrator. The [infrastructure automation resources](/resources/infrastructure) cover the common patterns.

## Related Concepts

- [Event-Driven Orchestration: Building Responsive Workflows](/resources/infrastructure/event-driven-orchestration)
- [Workflow Orchestration Tools](/resources/infrastructure/workflow-orchestration-tools)
- [Kestra, Open Source Declarative Orchestration Platform](/)
