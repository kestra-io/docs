---
title: "There's an App for that!"
description: Endless possibilities with Kestra Apps
date: 2024-12-12T13:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/introducing-apps.jpg
---

Automation focuses on the execution of tasks—triggering scripts, transferring data, or running jobs. Orchestration, however, operates at a higher level: coordinating these tasks, defining dependencies, and ensuring everything flows across systems and teams.
Despite its potential, orchestration tools often overlook a crucial aspect: accessibility. Most platforms cater exclusively to developers, leaving non-technical users with limited visibility and fragmented solutions to perform their part in the workflow. The result? Silos, manual workarounds, and missed opportunities to maximize automation’s value.
Kestra Apps change this.

By introducing a layer of self-service interfaces on top of orchestrated workflows, Kestra Apps make orchestration accessible to everyone. Developers retain full control of the backend processes, while end-users—regardless of technical expertise—can interact directly with workflows through intuitive forms, approval buttons, or output dashboards.

Kestra Apps bridge the gap between technical orchestration and practical usability, enabling true collaboration across teams and simplifying even the most complex workflows.

This blog dives into how Kestra Apps bring workflows closer to your teams. From simplifying file uploads to enabling dynamic data requests, we’ll explore practical examples and how Apps make automation accessible to everyone.

## Requests & Review

Uploading files to an FTP server—still a thing, right? But doing it securely and efficiently? That’s where the pain begins.
Kestra Apps simplify it all. Instead of dealing with credentials, server configurations, or outdated UIs, users can select their FTP configuration, choose a folder, and upload their file with a single click.
Automation shouldn’t feel manual. With Apps, workflows handle the complexity while users get an experience that makes sense.

With Apps we can build a simple frontend allowing users to upload a file, selecting the FTP configuration they want and the folder to simply upload files without the worry of credentials inputs, server configuration, or old designed UI.

```yaml
id: upload_ftp
namespace: company

inputs:

  - id: file
    displayName: File
    type: FILE

  - id: folder
    displayName: FTP Folder
    type: STRING

  - id: file_name
    displayName: Filename in the FTP
    type: STRING
    description: What will be the file name in the FTP?
    defaults: "data.csv"

  - id: ftp_config
    type: SELECT
    values:
      - FTP Company
      - FTP Shiny Rocks
      - FTP Internal

tasks:
  - id: switch
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ inputs.ftp_config }}"
    cases:
      "FTP Company":
        - id: ftp_company
          type: io.kestra.plugin.fs.ftp.Upload
          host: ftp://ftp.company.com
          port: 21
          username: "{{ secret('FTP_COMPANY_USER')}}"
          password: "{{ secret('FTP_COMPANY_PASSWORD') }}"
          from: "{{ inputs.file }}"
          to: "{{inputs.folder}}/{{inputs.file_name}}"
          
      "FTP Shiny Rocks":
        - id: ftp_shiny
          type: io.kestra.plugin.fs.ftp.Upload
          host: ftp://ftp.shiny.com
          port: 21
          username: "{{ secret('FTP_SHINY_USER')}}"
          password: "{{ secret('FTP_SHINY_PASSWORD') }}"
          from: "{{ inputs.file }}"
          to: "{{inputs.folder}}/{{inputs.file_name}}"

      "FTP Internal":
        - id: ftp_internal
          type: io.kestra.plugin.fs.ftp.Upload
          host: ftp://ftp.internal.com
          port: 21
          username: "{{ secret('FTP_INTERNAL_USER')}}"
          password: "{{ secret('FTP_INTERNAL_PASSWORD') }}"
          from: "{{ inputs.file }}"
          to: "{{inputs.folder}}/{{inputs.file_name}}"

    defaults:
      - id: default
        type: io.kestra.plugin.core.execution.Fail
        errorMessage: "Please choose an existing FTP configuration"
```


![fist_app_inputs](/blogs/use-case-apps/first_app_inputs.png)

![fist_app_loading](/blogs/use-case-apps/first_app_loading.png)

This example is one of the many one can imagine! Providing a simple interface for any users to request infrastructure deployment, file access, days off for holiday, etc. There are tons of cases where these need custom specifications and underlying automation.

Kestra already made easy connection with any system. It now provides the key to build custom interface on top of these automations.


## Dynamic Self-Serve

Sometimes you build dashboards. Tons of dashboards. But data consumers often crave something more flexible—a dynamic interface where they can craft their own analysis by tweaking dimensions, measures, and parameters on the fly.

We can build an app that will bound such request while allowing users to play with parameters. 

For example, let's take a parametized query allowing us to aggregate some data over time. The end user might want to download trends for different dimension and measures alongside a specific time frame.

Such workflow can be easily setup in Kestra, like this:

```yaml
id: query_analysis
namespace: kestra.weather

inputs:
  - id: dimension
    type: SELECT
    values:
      - city
      - region
      - country

  - id: start_date
    type: DATETIME

  - id: end_date
    type: DATETIME

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.postgresql.Query
    sql: |
      SELECT
        _{{ inputs.dimension }} AS city,
        DATE(_time) AS date_time,
        AVG(_temperature) AS avg_temperature
      FROM weather.staging_temperature
      WHERE
        _time BETWEEN '{{ inputs.start_date}}' AND '{{ inputs.end_date }}'
      GROUP BY _{{ inputs.dimension }}, DATE(_time)
    store: true

  - id: ion_to_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    from: "{{ outputs.query.uri }}"

  - id: chart
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    inputFiles:
      data.csv: "{{ outputs.ion_to_csv.uri }}"
    outputFiles:
      - "plot.png"
    beforeCommands:
      - pip install pandas
      - pip install plotnine
    script: |
      import pandas as pd
      from plotnine import ggplot, geom_col, aes, ggsave

      data = pd.read_csv("data.csv")
      print(data.head())
      plot = (
          ggplot(data) + 
          geom_col(aes(x="date_time", fill="city", y="avg_temperature"), position="dodge")
      )
      ggsave(plot, "plot.png")

outputs:
  - id: plot
    type: FILE
    value: '{{ outputs.chart["outputFiles"]["plot.png"] }}'

pluginDefaults:
  - type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://{{ secret('POSTGRES_HOST') }}/data"
      username: "{{ secret('POSTGRES_USERNAME') }}"
      password: "{{ secret('POSTGRES_PASSWORD') }}"
```


We can wrap up this workflow with an App where the user can select his parameters, hit execute and get the graphic he wants.

```yaml
id: self_serve_analytics
type: io.kestra.plugin.ee.apps.Execution
displayName: Self-serve Analytics
namespace: kestra.weather
flowId: query_analysis
access: PRIVATE
tags:
  - Reporting
  - Analytics

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## Self Serve Weather Analysis
          Select the geography granularity dimension and a timeframe

      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Submit

  - on: RUNNING
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## Running analysis
          Don't close this window. The results will be displayed as soon as the processing is complete.
      
      - type: io.kestra.plugin.ee.apps.core.blocks.Loading
      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Cancel request

  - on: SUCCESS
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## Request processed successfully
          Here is your data

      - type: io.kestra.plugin.ee.apps.execution.blocks.Outputs
        
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: Find more App examples in the linked repository

      - type: io.kestra.plugin.ee.apps.core.blocks.Button
        text: App examples
        url: https://github.com/kestra-io/enterprise-edition-examples/tree/main/apps
        style: INFO

      - type: io.kestra.plugin.ee.apps.core.blocks.Button
        text: Submit new request
        url: "{{ app.url }}"
        style: DEFAULT
```


![second_app_inputs](/blogs/use-case-apps/second_app_inputs.png)
![second_app_outputs](/blogs/use-case-apps/second_app_outputs.png)

## Simple Interface for Custom Automation

Kestra is at its best when the automation built can be used in our daily work. It's not only a scheduler but a real automation platform.

For example, Product or Sales team might want to qualify user research responses or leads discussions. It's usually manual process that go through some spreadsheet overhead, hand-operated scoring, etc.

What if we can just bring context of a discussion or project to our favorite LLM, ask for bounded qualification with certain set of rules and get associated responses?

Under the hood it's a matter of building a Kestra Flow that will call Hugging Face API. We can expose this complex logic within an Apps where, as a user, we only give the context, hit executes, and get suggested answers for our user and corresponding categorization.

We could even connect this to my CRM or database to automatically track discussions and leads pipelines.

In the example below we automate user's message categorization and probe a LLM to give a corresponding answer:

```
id: user_research_categorization_feedback
namespace: kestra

inputs:

  - id: user_context
    type: STRING



variables:
  pre_prompt: "You're an senior product manager with a strong baground in user research."
  
  new_discussion_prompt: "Write a friendly message to welcome the user and ask an open question (what, when, where, etc.) to engage a new discussion"

  follow_up_prompt: "It's been quite a long time you didn't message the user. Write a follow up question to get some news"

  discovery_prompt: "The user already gave you some information about his issues or project timeline. Part of a sales discovery framework set in your sales motion, write a question to deep-dive and get more information about high level use case, project timeline, etc."

tasks:
  - id: llm_categorization
    type: io.kestra.plugin.core.http.Request
    uri: https://api-inference.huggingface.co/models/facebook/bart-large-mnli
    method: POST
    contentType: application/json
    headers:
      Authorization: "Bearer {{ secret('HF_API_TOKEN') }}"
    formData:
      inputs: "{{ inputs.user_context }}"
      parameters:
        candidate_labels:
          - "new discussion"
          - "follow up"
          - "discovery"

  - id: message_category
    type: io.kestra.plugin.core.debug.Return
    format: "{{ json(outputs.llm_categorization.body).labels[0] }}"


  - id: llm_prompting
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ json(outputs.llm_categorization.body).labels[0] }}"
    cases:
      "new discussion":
        - id: new_discussion_prompt
          type: io.kestra.plugin.core.http.Request
          uri: https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct/v1/chat/completions
          method: POST
          contentType: application/json
          headers:
            Authorization: "Bearer {{ secret('HF_API_TOKEN') }}"
          formData:
            model: "Qwen/Qwen2.5-1.5B-Instruct"
            messages: [
              {"role": "system", "content": "{{ vars.pre_prompt }}. {{vars.new_discussion_prompt }}"},
              {"role": "user", "content": "{{ inputs.user_context }}"}
            ]

        - id: log_response
          type: io.kestra.plugin.core.log.Log
          message: "{{ json(outputs.new_discussion_prompt.body) }}"
            
      "follow up":
        - id: follow_up_prompt
          type: io.kestra.plugin.core.http.Request
          uri: https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct/v1/chat/completions
          method: POST
          contentType: application/json
          headers:
            Authorization: "Bearer {{ secret('HF_API_TOKEN') }}"
          formData:
            model: "Qwen/Qwen2.5-1.5B-Instruct"
            messages: [
              {"role": "system", "content": "{{ vars.pre_prompt }}. {{vars.follow_up_prompt }}"},
              {"role": "user", "content": "{{ inputs.user_context }}"}
            ]
            

        - id: log_response2
          type: io.kestra.plugin.core.log.Log
          message: "{{ json(outputs.follow_up_prompt.body) }}"

      "discovery":
        - id: discovery_prompt
          type: io.kestra.plugin.core.http.Request
          uri: https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct/v1/chat/completions
          method: POST
          contentType: application/json
          headers:
            Authorization: "Bearer {{ secret('HF_API_TOKEN') }}"
          formData:
            model: "Qwen/Qwen2.5-1.5B-Instruct"
            messages: [
              {"role": "system", "content": "{{ vars.pre_prompt }}. {{vars.discovery_prompt }}"},
              {"role": "user", "content": "{{ inputs.user_context }}"}
            ]
        - id: log_response3
          type: io.kestra.plugin.core.log.Log
          message: "{{ json(outputs.discovery_prompt.body) }}"
```


```yaml
id: user_research
type: io.kestra.plugin.ee.apps.Execution
displayName: Get answer recommendation for user research
namespace: kestra
flowId: user_research_categorization_feedback
access: PRIVATE
tags:
  - User Research

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## User Context
          This AI powered application helps you to answer user questions. It's a great help for your user research work!
          
          Please fill the user context below.
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Submit

  - on: RUNNING
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## Doing science 🧙
          Don't close this window. The results will be displayed as soon as the LLM is doing its magic!
      
      - type: io.kestra.plugin.ee.apps.core.blocks.Loading
      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Cancel request

  - on: SUCCESS
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          Here are a potential answer:
      
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
        filter:
          logLevel: INFO
          taskIds: ['log_response', 'log_response2', 'log_response3']
     

      - type: io.kestra.plugin.ee.apps.core.blocks.Button
        text: App examples
        url: https://github.com/kestra-io/enterprise-edition-examples/tree/main/apps
        style: INFO

      - type: io.kestra.plugin.ee.apps.core.blocks.Button
        text: Submit new request
        url: "{{ app.url }}"
        style: DEFAULT
```

Here is our main user interface. Here the user is asked the general user context
![alt text](/blogs/use-case-apps/custom_1.png)


LLMs are doing the work under the hood
![alt text](/blogs/use-case-apps/custom_2.png)


And then we get a potential answer for our user
![alt text](/blogs/use-case-apps/custom_3.png)


## What's your application?

ADD PROBING
ADD LINK TO SLACK, KESTRA