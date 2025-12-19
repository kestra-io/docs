---
title: AI Workflows
icon: /docs/icons/ai.svg
version: "1.0.0"
---

Build AI workflows with your preferred LLM.

Kestra provides plugins for multiple LLM providers and continues to add more with each release. You can design flows that use your chosen model and seamlessly integrate AI into orchestration workflows.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/videoseries?si=uFFbyDPJ8-zGDVOI&amp;list=PLEK3H8YwZn1qe8T2PSE8qfYJF4IEhtUEH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## AI workflows

The following examples demonstrate Kestra AI plugins for a variety of workflows. You can adapt each example to your chosen provider. Three key properties are important to understand:

- `type`: Defines the LLM provider plugin and task (e.g., `ChatCompletion` with OpenAI).
- `apiKey`: Access key for the provider – store this as a [key-value pair](../06.concepts/05.kv-store.md) in Kestra Open Source or as a [secret](../06.concepts/04.secret.md) in Enterprise Edition.
- `model`: Specifies the provider model. Models vary in performance, cost, and capabilities, so choose the one that best fits your use case.

Different provider plugins may include additional properties beyond those shown in the examples. Refer to each plugin’s documentation for a complete list. Common properties to be aware of include `prompt`, `messages`, `jsonResponseSchema`, to name a few.

:::collapse{title="Check the weather is suitable for sports every day using Gemini"}

This flow checks the daily wind conditions in Cambridgeshire and uses Google Gemini to decide whether it is suitable to go sailing. If the wind speed falls within the preferred range (above 10 knots and below 30 knots), the flow notifies you in Slack with the recommendation and automatically blocks your calendar for the day with an 'Out of office – gone sailing' event. It runs every morning at 8:00 AM on a schedule.

```yaml
id: check_weather
namespace: company.ai

tasks:
  - id: ask_ai
    type: io.kestra.plugin.gemini.StructuredOutputCompletion
    apiKey: "{{ secret('GEMINI_API_KEY') }}"
    model: "gemini-2.5-flash-preview-05-20"
    prompt: "I like to go sailing when the wind is above 10 knots but below 30 knots. I sail in Cambridgeshire. If the wind is within that range, I want to know if I should go sailing or not. Also tell me the current wind speed speeds"
    jsonResponseSchema: |
      {
        "type": "object",
          "properties": {
            "content": {
              "type": "string"
            },
            "wind": {
              "type": "number"
            },
            "go_sailing": {
              "type": "boolean"
            }
          }
        }
      }

  - id: if
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.ask_ai['predictions'] | first | jq('.go_sailing') | first }}"
    then:
      - id: notify_me
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK') }}"
        payload: |
          {
            "text": "{{ outputs.ask_ai['predictions'] | first | jq('.content') | first }}"
          }
      - id: block_calendar
        type: io.kestra.plugin.googleworkspace.calendar.InsertEvent
        calendarId: "{{ secret('CALENDAR_ID') }}"
        serviceAccount: "{{ secret('GOOGLE_SA') }}"
        summary: Out of office
        description: "Gone sailing because the wind is {{ outputs.ask_ai['predictions'] | first | jq('.wind') | first }} knots"
        startTime:
          dateTime: "{{ now() | date(\"yyyy-MM-dd'T'09:00:00+01:00\") }}"
          timeZone: "Europe/London"
        endTime:
          dateTime: "{{ now() | date(\"yyyy-MM-dd'T'18:00:00+01:00\") }}"
          timeZone: "Europe/London"
        creator:
          email: wrussell@kestra.io

triggers:
  - id: check_daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* 8 * * *"
```
:::

:::collapse{title="Create tasks with natural language prompts using DeepSeek and Todoist"}

This flow turns natural language prompts into structured Todoist tasks using an AI model. Each item is parsed into a title, description, and due date, then automatically created in your Todoist workspace via the REST API.

```yaml
id: add_tasks_to_todoist
namespace: company.ai

inputs:
  - id: prompt
    type: STRING
    displayName: What would you like to add to your task list?
    description: List out all the things you need to get done
    defaults: I need to get my prescription on Friday afternoon and go shopping afterwards

tasks:
  - id: create_task_fields
    type: io.kestra.plugin.deepseek.ChatCompletion
    apiKey: '{{ secret("DEEPSEEK_API_KEY") }}'
    modelName: deepseek-chat
    messages:
      - type: SYSTEM
        content: You are going to help to write a todo list inside of Todoist. I need you to return any user messages as tasks in JSON format only. There might be multiple tasks. The current time is '{{ now() }}'
      - type: USER
        content: "{{ inputs.prompt }}"
    jsonResponseSchema: |
      {
        type: "object",
        "properties": {
          "tasks": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": "string",
                "description": "string",
                "due_date": {
                  "type": "string",
                  "format": "date-time"
                  "description": "Due date of the task (as a RFC 3339 timestamp).",
                }
              }
            }
          }
        }
      }

  - id: create_tasks
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ outputs.create_task_fields.response | jq('.tasks') | first }}"
    tasks:
      - id: create_task
        type: io.kestra.plugin.core.http.Request
        uri: https://api.todoist.com/rest/v2/tasks
        method: POST
        contentType: application/json
        headers:
          Authorization: "Bearer {{ secret('TODOIST_API_TOKEN') }}"
        body: |
          {
            "content": "{{ taskrun.value | jq('.title') | first }}",
            "description": "{{ taskrun.value | jq('.description') | first }}",
            "due_datetime": "{{ taskrun.value | jq('.due_date') | first }}"
          }
```
:::

:::collapse{title="Generate an image with OpenAI with human approval"}

This flow generates an image from a user prompt, sends it to a Discord channel for review, and waits for approval. If approved, the image is finalized and logged; if rejected, the user can provide feedback to regenerate a new image, which is then shared again on Discord.

```yaml
id: gen_img_approval
namespace: company.ai

inputs:
  - id: image_prompt
    type: STRING

variables:
  discord_webhook: "https://discord.com/api/webhooks/URL"

tasks:

  - id: gen_img
    type: io.kestra.plugin.core.flow.Subflow
    namespace: demo
    flowId: generate_image
    inputs:
      openai_prompt: "{{ inputs.image_prompt }}"

  - id: send_image
    type: io.kestra.plugin.notifications.discord.DiscordExecution
    content: "Are you happy with the image: {{ outputs.gen_img.outputs.image }}. Approve it here: http://localhost:8082/ui/executions/{{flow.namespace}}/{{flow.id}}/{{execution.id}} "
    url: "{{ vars.discord_webhook }}"

  - id: wait_for_approval
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: approve
        description: Are you happy with the photo or not?
        type: BOOLEAN

      - id: feedback
        description: Write the prompt again with more detail
        type: STRING

  - id: try_again
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.wait_for_approval.onResume.approve }}"
    then:
      - id: approved
        type: io.kestra.plugin.core.log.Log
        message: "Final photo: {{ outputs.gen_img.outputs.image }}"
    else:
      - id: retry
        type: io.kestra.plugin.core.flow.Subflow
        namespace: demo
        flowId: generate_image
        inputs:
          openai_prompt: "{{ outputs.wait_for_approval.onResume.feedback }}"

      - id: send_new_image
        type: io.kestra.plugin.notifications.discord.DiscordExecution
        content: "Here's the new image with your feedback: {{ outputs.retry.outputs.image }}"
        url: "{{ vars.discord_webhook }}"
```
:::

:::collapse{title="Summarize Git commits from the past week using Ollama"}

This flow automatically summarizes Git commits from the past week in a specified repository and branch. Each Friday at 15:00 UTC, it generates a plain-text summary using Ollama and posts it to Slack, keeping teams updated on project progress.

```yaml
id: ai-summarize-weekly-git-commits
namespace: company.ai

inputs:
  - id: repository
    type: URI
    defaults: https://github.com/kestra-io/blueprints
    description: Repository to summarize last week's progress

  - id: branch
    type: STRING
    defaults: main
    description: Git branch to summarize last week's progress

tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repo
        type: io.kestra.plugin.git.Clone
        branch: "{{ inputs.branch }}"
        url: "{{ inputs.repository }}"

      - id: fetch_commits
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: bitnami/git:latest
        commands:
          # 0. Set safe.directory for Git to avoid "dubious ownership" errors
          - git config --global --add safe.directory "$(pwd)"

          # 1. Deepen clone if shallow
          - git fetch --unshallow origin {{ inputs.branch }} || true

          # 2. Update main branch
          - git fetch origin {{ inputs.branch }}

          # 3. Fetch commits from the last 7 days (weekly)
          - git log origin/{{ inputs.branch }} --since="7 days ago" --pretty=format:"%h %ad %s" --date=short > commits.txt

          # 4. Show how many were found
          - echo "Fetched $(wc -l < commits.txt) commits from the last 7 days"
        outputFiles:
          - commits.txt

      - id: summarize_commits
        type: io.kestra.plugin.ollama.cli.OllamaCLI
        enableModelCaching: true
        modelCachePath: "{{ kv('OLLAMA_CACHE_PATH') }}"
        commands:
          - "ollama run gemma3:1b \"Summarize the following Git commits into a clear and concise weekly development update for users. Output plain text for Slack, no markdown or extra formatting. Ensure no markdown syntax like **bold text** in the response — stick to plain text! Here are the commit messages: {{ read(outputs.fetch_commits.outputFiles['commits.txt']) }}\" > output.txt"
    outputFiles:
      - output.txt

  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {{
        {
          "text": "This week's repository updates for " ~ inputs.repository ~ ". " ~ read(outputs.summarize_commits.outputFiles['output.txt'])
        }
      }}

triggers:
  - id: weekly-trigger
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 15 * * 5"  # Every Friday at 15:00 (3:00 PM) UTC
```
:::
