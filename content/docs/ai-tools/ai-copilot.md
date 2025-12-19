---
title: AI Copilot
icon: /docs/icons/ai.svg
version: "1.0.0"
---

Build and modify flows directly from natural language prompts.

The AI Copilot can generate and iteratively edit declarative flow code with AI-assisted suggestions.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/nNEb5DZB-xo?si=swdS3p_HFpDgT-6q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

The AI Copilot is designed to help build and modify flows directly from natural language prompts. Describe what you are trying to build, and Copilot will generate the YAML flow code for you to accept or adjust. Once your initial flow is created, you can iteratively refine it with Copilot’s help, adding new tasks or adjusting triggers without touching unrelated parts of the flow. Everything stays as code and in Kestra's usual declarative syntax.

## Configuration

To add Copilot to your flow editor, add the following to your [Kestra configuration](../configuration/index.md):

```yaml
kestra:
  ai:
    type: gemini
    gemini:
      model-name: gemini-2.5-flash
      api-key: YOUR_GEMINI_API_KEY
```

Replace `api-key` with your Google Gemini API key, and Copilot will appear in the top right corner of the flow editor. Optionally, you can add the following properties to your configuration (not all properties may be included with every provider):

- `temperature`: Controls randomness in responses — lower values make outputs more focused and deterministic, while higher values increase creativity and variability.
- `topP` (nucleus sampling): Ranges from 0.0–1.0; lower values (0.1–0.3) produce safer, more focused responses for technical tasks, while higher values (0.7–0.9) encourage more creative and varied outputs.
- `topK`: Typically ranges from 1–200+ depending on the API; lower values restrict choices to a few predictable tokens, while higher values allow more options and greater variety in responses.
- `maxOutputTokens`: Sets the maximum number of tokens the model can generate, capping the response length.
- `logRequests`: Creates logs in Kestra for LLM requests.
- `logResponses`: Creates logs in Kestra for LLM responses.
- `baseURL`: Specifies the endpoint address where the LLM API is hosted.
- `clientPem`: (Required for mTLS) PEM bundle with client cert + private key (e.g., `cat client.crt.pem client.key.pem > client-bundle.pem`). Used for mutual TLS.
- `caPem`: CA PEM file to add a custom CA without `trustAll`. Usually not needed since hosts already trust the CA.

![AI Copilot](/docs/ai-tools/ai-copilot.png)

:::alert{type="info"}
The open-source version supports only Google Gemini models. Enterprise Edition users can configure any LLM provider, including Amazon Bedrock, Anthropic, Azure OpenAI, DeepSeek, Google Gemini, Google Vertex AI, Mistral, and all open-source models supported by Ollama. Navigate down to the Enterprise configurations section for your provider. If you use a different provider, please [reach out to us](https://kestra.io/demo) and we'll add it.
:::

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

:::collapse{title="Example prompts to get started"}
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
- Run a shell command echo 'Hello Docker' in a Docker container
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
:::

## Enterprise Edition Copilot configurations

Enterprise Edition users can configure any LLM provider, including Amazon Bedrock, Anthropic, Azure OpenAI, DeepSeek, Google Gemini, Google Vertex AI, Mistral, OpenAI, OpenRouter, and all open-source models supported by Ollama. Each configuration has slight differences, so make sure to adjust for your provider.
Only non-thinking modes are supported. If the used LLM is a pure thinking model (one that possesses thinking ability and cannot be disabled), the generated Flow will be incorrect and contain thinking elements.

### Amazon Bedrock

```yaml
kestra:
  ai:
    type: bedrock
    bedrock:
      model-name: amazon.nova-lite-v1:0
      access-key-id: BEDROCK_ACCESS_KEY_ID
      secret-access-key: BEDROCK_SECRET_ACCESS_KEY
```

### Anthropic

```yaml
kestra:
  ai:
    type: anthropic
    anthropic:
      model-name: claude-opus-4-1-20250805
      api-key: CLAUDE_API_KEY
```

### Azure OpenAI

```yaml
kestra:
  ai:
    type: azure-openai
    azure-openai:
      model-name: gpt-4o-2024-11-20
      api-key: AZURE_OPENAI_API_KEY
      tenant-id: AZURE_TENANT_ID
      client-id: AZURE_CLIENT_ID
      client-secret: AZURE_CLIENT_SECRET
      endpoint: "https://your-resource.openai.azure.com/"
```

### Deepseek

```yaml
kestra:
  ai:
    type: deepseek
    deepseek:
      model-name: deepseek-chat
      api-key: DEEPSEEK_API_KEY
      base-url: "https://api.deepseek.com/v1"
```

### Google Gemini

```yaml
kestra:
  ai:
    type: gemini
    gemini:
      model-name: gemini-2.5-flash
      api-key: YOUR_GEMINI_API_KEY
```

### Google Vertex AI

```yaml
kestra:
  ai:
    type: googlevertexai
    googlevertexai:
      model-name: gemini-2.5-flash
      project: GOOGLE_PROJECT_ID
      location: GOOGLE_CLOUD_REGION
      endpoint: VERTEX-AI-ENDPOINT
```

### Mistral

```yaml
kestra:
  ai:
    type: mistralai
    mistralai:
      model-name: mistral:7b
      api-key: MISTRALAI_API_KEY
      base-url: "https://api.mistral.ai/v1"
```

### Ollama

```yaml
kestra:
  ai:
    type: ollama
    ollama:
      model-name: llama3
      base-url: http://localhost:11434
```

::alert{type="info"}
If Ollama is running locally on your host machine while Kestra is running inside a container, connection errors may occur when using `localhost`. In this case, use the Docker internal network URL instead — for example, set the base URL to `http://host.docker.internal:11434`.
::

:::alert{type="info"}
Some Ollama model names can be confusing. For example, at the time of writing, the model `qwen3:30b-a3b` is pointing to SHA `ad815644918f`, which is the `qwen3:30b-a3b-thinking-2507-q4_K_M` model behind the scenes. This is a thinking model that doesn't support disabling it.
Please double-check that the chosen model has a non-thinking version or that a toggle is available.
:::

### OpenAI

```yaml
kestra:
  ai:
    type: openai
    openai:
      model-name: gpt-5-nano
      api-key: OPENAI_API_KEY
      base-url: https://api.openai.com/v1
```

### OpenRouter

```yaml
kestra:
  ai:
    type: openrouter
    openrouter:
      api-key: OPENROUTER_API_KEY
      base-url: "https://openrouter.ai/api/v1"
      model-name: "anthropic/claude-sonnet-4"
```
