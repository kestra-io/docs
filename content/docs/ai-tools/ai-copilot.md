---
title: AI Copilot
icon: /docs/icons/ai.svg
editions: ["OSS", "EE", "Cloud"]
version: "1.0.0"
---

Build and modify flows directly from natural language prompts.

The AI Copilot can generate and iteratively edit declarative flow code with AI-assisted suggestions.

## Overview

The AI Copilot is designed to help build and modify flows directly from natural language prompts. Describe what you are trying to build, and Copilot will generate the YAML flow code for you to accept or adjust. Once your initial flow is created, you can iteratively refine it with Copilot’s help, adding new tasks or adjusting triggers without touching unrelated parts of the flow. Everything stays as code and in Kestra's usual declarative syntax.

## Configuration

To add Copilot to your flow editor, add the following to your Kestra configuration:

```yaml
kestra:
  ai:
    type: openai
    gemini:
      model-name: "gpt-5"
      api-key: YOUR_OPENAI_API_KEY
```

Replace `api-key` with your Google Gemini API key, and Copilot will appear in the top right corner of the flow editor.

![AI Copilot](/docs/ai-tools/ai-copilot.png)

::alert{type="info"}
The open-source version supports only OpenAI models. Enterprise Edition users can configure any LLM provider, including Amazon Bedrock, Anthropic, Azure OpenAI, DeepSeek, Google Gemini, Google Vertex AI, Mistral, and all open-source models supported by Ollama. If you use a different provider, please [reach out to us](https://kestra.io/demo) and we'll add it.
::

## Build flows with Copilot

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/kvO69FrLnnXVsMkrLi7T?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Flows | Kestra EE" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

In the above demo, we want to create a flow that uses a [Python script](/plugins/tasks/io.kestra.plugin.scripts.python.Script) to fetch New York City weather data. To get started, open the Copilot and write a prompt. For example:

```txt
Create a flow with a Python script that fetches weather data for New York City
```

Once prompted, the Copilot generates YAML directly in the flow editor that can be accepted or refused in the bottom right corner.

![Copilot Suggestion](/docs/ai-tools/copilot-suggestion.png)

If accepted, the flow is created and can be saved for execution, iterated on manually, or continually iterated upon by the Copilot. For example, you want a trigger added to the flow to run it on a schedule. Reopen the Copilot and prompt it with the desired trigger setup such as:

```txt
Add a trigger to run the flow every day at 9 AM
```

The Copilot again makes a suggestion to add to the flow, but only in the targeted section, in this case a `triggers` block. This is also the case if you want the Copilot only to consider a specific task, input, plugin default, and so on.

![Copilot Trigger Iteration](/docs/ai-tools/copilot-trigger.png)

You can continuously collaborate with Copilot until the flow is exactly as you imagined. If accepted, suggestions are always declaratively written and manageable as code. You can keep track of the revision history using the built-in Revisions tab or with the help of Git Sync.

## Starter prompts

To get started with Copilot, here are some example prompts to test, iterate on, and use as a starting point for collaboratively building flows with AI in Kestra:

::collapse{title="Example prompts to get started"}
```markdown
- Create a flow that runs a dbt build command on DuckDB
- Create a flow cloning https://github.com/kestra-io/dbt-example Git repository from a main branch, then add a dbt CLI task using DuckDB backend that will run dbt build command for that cloned repository using my_dbt_project profile and dev target. The dbt project is located in the root directory so no dbt project needs to be configured.
- Create a flow that sends a POST request to https://dummyjson.com/products/add
- Send a POST request to https://dummyjson.com/products/add
- Write a Python script that sends a POST request to https://dummyjson.com/products/add
- Write a Node.js script that sends a POST request to https://dummyjson.com/products/add
- Create a flow with a Python script that fetches weather data for New York City
- Make a REST API call to https://kestra.io/api/mock and allow failure
- Create a flow that logs "Hello from AI" to the console
- Create a flow that returns Hello as output
- Create a flow that outputs Hello as value
- Run a flow every 10 minutes
- Run a flow every day at 9 AM
- Run a command echo 'Hello Docker' in a Docker container
- Run a command python main.py in a Docker container
- Run a script main.py stored as namespace file
- Build a Docker image from an inline Dockerfile and push it to a GitHub Container Registry
- Build a Docker image from an inline Dockerfile and push it to a DockerHub Container Registry
- Create a flow that adds a string KV pair called MYKEY with value myvalue to namespace company
- Fetch value for KV pair called MYKEY from namespace company
- Create a flow that downloads a file mydata.csv from S3 bucket named mybucket
- Create a flow that downloads all files from the folder kestra/plugins/ from S3 bucket mybucket in us-east-1
- Send a Slack notification that approval is needed and Pause the flow for manual approval
- Send a Slack alert whenever any execution from namespace company fails
- Fetch value for string kv pair called mykey from Redis
- Fetch value for mykey from Redis
- Set value for mykey in Redis to myvalue
- Sync all flows and scripts for selected namespaces from Git to Kestra
- Create a flow that clones a Git repository and runs a Python script
- Export a Postgres table called mytable to a CSV file
- Query a Postgres table called mytable
- Find documents in a MongoDB collection called mycollection
- Load documents into a MongoDB mycollection using a file from input mydata
- Trigger an Airbyte connection sync and retry it up to 3 times
- Run an Airflow DAG called mydag
- Orchestrate an Ansible playbook stored in Namespace Files
- Run a DuckDB query that reads a CSV file
- Fetch AWS ECR authorization token to push Docker images to Amazon ECR
- Run a flow whenever 5 records are available in Kafka topic mytopic
- Submit a run for a Databricks job
```
::
