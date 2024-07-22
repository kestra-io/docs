---
title: Input and Output Files
icon: /docs/icons/dev.svg
---

## Input Files

You can pass additional files to any script or CLI task using the `inputFiles` property:

```yaml
id: ansible
namespace: company.team

tasks:
  - id: ansible_task
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    inputFiles:
      inventory.ini: |
        localhost ansible_connection=local
      myplaybook.yml: |
        ---
        - hosts: localhost
          tasks:
            - name: Print Hello World
              debug:
                msg: "Hello, World!"
    docker:
      image: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i inventory.ini myplaybook.yml
```

You can also leverage [Namespace Files](https://kestra.io/docs/developer-guide/namespace-files) as follows:

```yaml
id: ansible
namespace: company.team

tasks:
  - id: ansible_task
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    namespaceFiles:
      enabled: true
    inputFiles:
      inventory.ini: "{{ read('inventory.ini') }}"
      myplaybook.yml: "{{ read('myplaybook.yml') }}"
    docker:
      image: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i inventory.ini myplaybook.yml
```

### Using input files to pass data from a trigger to a script task

Another use case for input files is when your custom scripts need input coming from other tasks or triggers.

Consider the following example flow that runs when a new object with the prefix `"raw/"` arrives in the S3 bucket `"declarative-orchestration"`:

```yaml
id: s3TriggerCommands
namespace: company.team
description: process CSV file from S3 trigger

tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    inputFiles:
      data.csv: "{{ trigger.objects | jq('.[].uri') | first }}"
    outputFiles:
      - "*.csv"
      - "*.parquet"
    tasks:
      - id: cloneRepo
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/examples
        branch: main

      - id: python
        type: io.kestra.plugin.scripts.python.Commands
        description: this script reads a file `data.csv` from the S3 trigger
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/pydata:latest
        warningOnStdErr: false
        commands:
          - python scripts/clean_messy_dataset.py

triggers:
  - id: waitForS3object
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: declarative-orchestration
    maxKeys: 1
    interval: PT1S
    filter: FILES
    action: MOVE
    prefix: raw/
    moveTo:
      key: archive/raw/
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "{{ secret('AWS_DEFAULT_REGION') }}"

```

Note that we didn't have to hardcode anything specific to Kestra in the Python script from GitHub. That script remains pure Python that you can run anywhere. Kestra's trigger logic is stored along with orchestration and infrastructure configuration in the YAML flow definition.

This separation of concerns (*i.e. not mixing orchestration and business logic*) makes your code easier to test and keeps your business logic vendor-agnostic.

## Output Files

If you want to generate files in your script to make them available for download and use in downstream tasks, you can leverage either the `outputFiles` property.

### Generating outputs from a script task using `outputFiles`

The `outputFiles` property allows to specify a list of files to be persisted in Kestra's internal storage. Here is an example:

```yaml
id: output_text_files
namespace: company.team

tasks:
  - id: python_output
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    outputFiles:
      - "*.txt"
    script: |
      f = open("myfile.txt", "a")
      f.write("Hi, this is output from a script 👋")
      f.close()

  - id: read_output
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat {{ outputs.python_output.outputFiles['myfile.txt'] }}
```

Note how the `outputFiles` property is used to specify the list of files to be persisted in Kestra's internal storage. The `outputFiles` property supports [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)).

The subsequent task can access the output file by leveraging the syntax `{{outputs.yourTaskId.outputFiles['yourFileName.fileExtension']}}`.

### Generating outputs from a script task

::alert{type="info"}
From 0.17.0, `outputDir` has been depreciated. Use the `outputFiles` property instead.
::

This is an alternative to the `outputDir` property. Files stored in the `outputFiles` property will be persisted in Kestra's internal storage. Here is an example:

```yaml
id: output_text_files
namespace: company.team

tasks:
  - id: python_output
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    outputFiles:
      - myfile.txt
    script: |
      with open("myfile.txt", "a") as f:
          f.write("Hi, this is output from a script 👋")

  - id: read_output
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat {{ outputs.python_output.outputFiles['myfile.txt'] }}
```

The first task creates a file `'myfile.txt'` and the next task can access it by leveraging the syntax `{{ outputs.yourTaskId.outputFiles['yourFileName.fileExtension'] }}`.
