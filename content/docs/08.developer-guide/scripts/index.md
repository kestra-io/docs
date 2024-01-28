---
title: Python, R, Node.js and Shell Scripts
icon: /docs/icons/dev.svg
---

The previous sections in the Developer Guide covered [Flows](../../06.workflow-components/02.flow.md) and [Tasks](../07.concepts/tasks.md). This section covers script tasks.

Script tasks allow you to orchestrate custom business logic written in `Python`, `R`, `Node.js`, `Powershell` and `Shell` scripts. By default, all these tasks run in individual Docker containers. You can optionally run those scripts in a local process or run them on a remote [worker group](../07.concepts/worker-group.md).


## The `Commands` and `Script` tasks

For each of these languages, Kestra provides two types of tasks: inline `Script` tasks, and `Commands` tasks that allow executing a list of commands by a script interpreter.

1. The `Script` task is useful for scripts that can be written **inline** in a YAML flow configuration. They are best suited for simple automation tasks, e.g., if you want to run a single Python function fetching data from an API. It can also be used to run a single script based on an output of the previous task using data retrieved from the internal storage.
2. The `Commands` tasks can be combined with a `io.kestra.core.tasks.flows.WorkingDirectory` and `io.kestra.plugin.git.Clone` tasks to run custom scripts from Git in Docker containers without the overhead of packaging every script into a separate container image. This is possible thanks to the combination of a base `image` and custom `beforeCommands`.


The following table gives an overview of all script tasks and their configuration.


| Language   | Default `image`                                                              | `beforeCommands` example                 | `Script` example               | `Commands` example                   |
| ---------- | -------------------------------------------------------------------------- | -------------------------------------- | ---------------------------- | ---------------------------------- |
| Python     | python                                                                     | pip install requests kestra            | print("Hello World!")        | python hello.py |
| R          | r-base                                                                     | Rscript -e "install.packages('dplyr')" | print("Hello World!")        | Rscript hello.R                    |
| Node.js    | node                                                                       | npm install json2csv                   | console.log('Hello World!'); | node hello.js                      |
| Shell      | ubuntu                                                                     | apt-get install curl                   | echo "Hello World!"          | ./hello.bash                       |
| Powershell | [powershell](https://mcr.microsoft.com/powershell) | Install-Module -Name ImportExcel       | Write-Output "Hello World!"  | .\hello.ps1                        |


**Full class names:**
- [io.kestra.plugin.scripts.python.Commands](/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.commands)
- [io.kestra.plugin.scripts.python.Script](/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.script)
- [io.kestra.plugin.scripts.r.Commands](/plugins/plugin-script-r/tasks/io.kestra.plugin.scripts.r.commands)
- [io.kestra.plugin.scripts.r.Script](/plugins/plugin-script-r/tasks/io.kestra.plugin.scripts.r.script)
- [io.kestra.plugin.scripts.node.Commands](/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.commands)
- [io.kestra.plugin.scripts.node.Script](/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.script)
- [io.kestra.plugin.scripts.shell.Commands](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.commands)
- [io.kestra.plugin.scripts.shell.Script](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.script)
- [io.kestra.plugin.scripts.powershell.Commands](/plugins/plugin-script-powershell/tasks/io.kestra.plugin.scripts.powershell.commands)
- [io.kestra.plugin.scripts.powershell.Script](/plugins/plugin-script-powershell/tasks/io.kestra.plugin.scripts.powershell.script)


Each of those languages have a dedicated tag in the [Blueprints](../01.getting-started/07.ui.md#blueprints) catalog. Check available blueprints to get started with those tasks. The section below explains the recommended usage patterns and common examples.

---

## Bind-mount a local script: the simplest pattern for local development with Docker

The easiest way to run a script stored locally is to use a Docker volume.

First, make sure that your Kestra configuration in the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) allows volume mounting. Here is how you can configure it:

```yaml
  kestra:
    image: kestra/kestra:latest-full
    pull_policy: always
    entrypoint: /bin/bash
    user: "root"
    env_file:
      - .env
    command:
      - -c
      - /app/kestra server standalone --worker-thread=128
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd:rw
    environment:
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driverClassName: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              enabled: false
              username: admin
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              base-path: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmp-dir:
              path: /tmp/kestra-wd/tmp
            scripts:
              docker:
                volume-enabled: true # 👈 this is the relevant setting
```

With that setting, you can point the script task to any script on your local file system:

```yaml
id: pythonVolume
namespace: dev
tasks:
  - id: anyPythonScript
    type: io.kestra.plugin.scripts.python.Commands
    runner: DOCKER
    docker:
      image: ghcr.io/kestra-io/pydata:latest
      volumes:
        - /Users/anna/gh/KESTRA_REPOS/scripts:/app
    commands:
      - python /app/etl/parametrized.py
```

This flow points the Python task running in a Docker container to [this script](https://github.com/kestra-io/scripts/blob/main/etl/parametrized.py).

---

## Recommended usage pattern: Scripts from Git in Docker

Below is a simple example of the recommended usage pattern:
1. Start with a `io.kestra.core.tasks.flows.WorkingDirectory` task. This allows running multiple scripts in the same working directory, helping to **output results** and **pass data** between tasks when needed.
2. Use `io.kestra.plugin.git.Clone` as the first child task of a `io.kestra.core.tasks.flows.WorkingDirectory` task to ensure that your repository is cloned into an empty directory. You can provide a URL and authentication credentials to any Git-based system including GitHub, GitLab, BitBucket, CodeCommit, and more.
3. Use one of the `Commands` task (e.g. `python.Commands`) to specify which scripts or modules to run, while explicitly specifying the path within the Git repository. For instance, the command `python scripts/etl_script.py` ensures you run a Python script `etl_script.py` located in the `scripts` directory of the [examples](https://github.com/kestra-io/examples) repository in the `main` branch.
	1. This repository is **public**, so the repository's `url` and a `branch` name is all that's required.
	2. If this repository were **private**, we would also had to specify `kestra-io` as the  `username` and add a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) as the `password` property.
4. Optionally, specify your **base** Docker image using the `image` argument of the `docker` property. If you don't specify the image property, the default image is used, as shown in the table above. The referenced container image should include commonly used dependencies, for example `requests`, `pandas`, `sqlalchemy`, `scikit-learn`, etc. While you can have a dedicated image for each script, Kestra supports a much simpler Python dependency management pattern using a base image with shared dependencies and installing any custom dependencies needed for a particular script at runtime using the `beforeCommands` property.
5. The `beforeCommands` property is a list of arbitrary commands that can be *optionally* executed within the container before starting the script `commands`. If your cloned Git repository includes `requirements.txt` file, you can use `pip install -r requirements.txt` to install the required `pip` packages.
	1. The additional `warningOnStdErr` boolean flag can be set to `false` to avoid setting the task to a WARNING state when the installation process emits warnings to the standard error. By default, warnings during e.g. `pip` package installation will set the task state to a `WARNING` state to give you more transparency about the entire process.
	2. Redirecting the installation output to `/dev/null` in the command `pip install faker > /dev/null`ensures that the (*usually verbose*) output emitted during installation is not captured within your task logs.
6. The `commands` is a list of commands that will be executed sequentially. This setup provides a high degree of flexibility as it allows you to execute parametrized scripts, custom CLI applications, etc.
7. The `LocalFiles` task can be used to output a file generated by a script. Here, the [generate_order.py](https://github.com/kestra-io/examples/blob/main/scripts/generate_orders.py#L24) script creates a file `orders.csv`. When you reference this file in the `outputs` property, it will be available for download from the **Outputs** tab on the Executions page. You'll be able to retrieve that file in downstream tasks using the syntax `{{outputs.taskId.uris['outputFileName.fileExtension']}}`, which in this example would be  `{{outputs.outputCsv.uris['orders.csv']}}`.  In this specific flow, we use that file in a downstream task that loads that file to an S3 bucket.


```yaml
id: pythonCommandsExample
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/examples
        branch: main

      - id: gitPythonScripts
        type: io.kestra.plugin.scripts.python.Commands
        warningOnStdErr: false
        docker:
          image: ghcr.io/kestra-io/pydata:latest
        beforeCommands:
          - pip install faker > /dev/null
        commands:
          - python scripts/etl_script.py
          - python scripts/generate_orders.py

      - id: outputFile
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - orders.csv

  - id: loadCsvToS3
    type: io.kestra.plugin.aws.s3.Upload
    accessKeyId: "{{secret('AWS_ACCESS_KEY_ID')}}"
    secretKeyId: "{{secret('AWS_SECRET_ACCESS_KEY')}}"
    region: eu-central-1
    bucket: kestraio
    key: stage/orders.csv
    from: "{{outputs.outputFile.uris['orders.csv']}}"

```


### Why Git? Why not *just* use a locally stored file?

We believe that using Git already during local development of your data pipelines allows a more robust engineering workflow and makes it easier to move from local development to production. Before using any script in Kestra, you should first thoroughly test that script in your favorite IDE and only use Kestra to orchestrate it. For local development, we recommend using a feature branch or a `dev`/`develop` branch, rather than mounting files to Docker containers.  However, if you don't want to use Git, the section below demonstrates the usage of inline `Script` tasks.


---

## Simple usage pattern: Inline Scripts in Docker

In contrast to the `Commands` tasks, the `Script` task doesn't require using Git to store your script code. Instead, you define it inline in your YAML workflow definition along with any other configuration.

Here is a simple example illustrating how to use that pattern:
1. Even though it's not required, it's best to start with a `io.kestra.core.tasks.flows.WorkingDirectory` task. This task allows you to configure additional **input** or **output** files using the `LocalFiles` task. The example below uses a SQL file as input.
2. Use one of the `Script` tasks (e.g. `python.Script`) and paste your Python/R/Node.js/Shell script as a multiline string into the `script` property. Here, the script reads the SQL file, makes an API call and stores the outputs.
3. You can *optionally* overwrite the **base** Docker image using the `image` argument of the `docker` property. This works exactly the same way as in the `Commands` tasks.
4. You can also *optionally* use the `beforeCommands` property to install libraries used in your inline script. Here, we use the command `pip install requests kestra` to install two new `pip` packages not available in the base image `python:3.11-slim`.
5. The `LocalFiles` task can be used to output a file generated as a result of a script. This script outputs a JSON file and a downstream task loads that file as a document to a MongoDB collection.

```yaml
id: apiJSONtoMongoDB
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: demoSQL
        type: io.kestra.core.tasks.storages.LocalFiles
        inputs:
          query.sql: |
            SELECT sum(total) as total, avg(quantity) as avg_quantity
            FROM sales;

      - id: inlineScript
        type: io.kestra.plugin.scripts.python.Script
        docker:
          image: python:3.11-slim
        beforeCommands:
          - pip install requests kestra > /dev/null
        warningOnStdErr: false
        script: |
          import requests
          import json
          from kestra import Kestra

          with open('query.sql', 'r') as input_file:
              sql = input_file.read()

          response = requests.get("https://api.github.com")
          data = response.json()

          with open("output.json", "w") as output_file:
              json.dump(data, output_file)

          Kestra.outputs({'receivedSQL': sql, 'status': response.status_code})

      - id: jsonFiles
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - output.json

  - id: loadToMongoDB
    type: io.kestra.plugin.mongodb.Load
    connection:
      uri: mongodb://host.docker.internal:27017/
    database: local
    collection: github
    from: "{{outputs.jsonFiles.uris['output.json']}}"

```

---

## When to use `Script` over `Commands`?

The `Script` pattern has several **advantages**:
- **Simplicity**: you don't need to commit files to a Git repository. The script code is stored and **versioned** using Kestra's revision history along with your orchestration code.
- **Easier integration with the templating engine**: when the entire workflow is defined in one configuration file, it can be easier to see dependencies and use templating to share variable definitions, pass outputs to downstream tasks, etc.

However, the `Script` tasks also have some **disadvantages** as compared to the `Commands` tasks:
- **Readability:** Adding programming language code into a configuration file such as YAML makes that code more difficult to read, test and review. It lacks the syntax highlighting and testability you would otherwise get from your IDE when writing, for example, Python script in a `.py` file rather than pasting that code inline into a `.yml` config.
- **Support for complex use cases**: The `Script` task is not meant for complex use cases where your business logic comprises multiple files importing classes and functions from other modules, etc.

Overall, we recommend using `io.kestra.plugin.git.Clone` and `Commands` tasks for advanced production workloads. However, the `Script` tasks offer a great alternative for simple use cases.

---

## Runners

You can configure your scripts to run either in local **processes** or in **Docker containers** by using the `runner` property:

1. By default all scripting tasks run in isolated containers using the `DOCKER` runner.
2. Setting the `runner` property to `PROCESS` will execute your task in a local process on the Worker without relying on Docker for container isolation.

### runner: DOCKER

This is the default option for all script tasks. There are many arguments that can be provided here, including credentials to private Docker registries:

```yaml
id: pythonInContainer
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/examples
        branch: main

      - id: gitPythonScripts
        type: io.kestra.plugin.scripts.python.Commands
        warningOnStdErr: false
        commands:
          - python scripts/etl_script.py
        runner: DOCKER
        docker:
          image: annageller/kestra:latest
          config: |
            {
              "auths": {
                  "https://index.docker.io/v1/": {
                      "username": "annageller",
                      "password": "{{ secret('DOCKER_PAT') }}"
                  }
              }
            }
      - id: output
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - "*.csv"
          - "*.parquet"
```

Head over to the [Secrets](../07.concepts/04.secret) section to learn more about secrets management in Kestra.


### runner: PROCESS

The `PROCESS` runner is useful if your Kestra instance is running [locally without Docker](../../10.administrator-guide/02.deployment/03.manual.md) and you want to access your local files and environments, for example, to take advantage of locally configured Conda virtual environments.

```yaml
id: localPythonScript
namespace: dev

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.python.Commands
    runner: PROCESS
    beforeCommands:
      - conda activate myCondaEnv
    commands:
		  - python /Users/you/scripts/etl_script.py
```

Running scripts in a local process is particularly beneficial when using [remote Worker Groups](../07.concepts/worker-group.md). The example below ensures that a script will be picked up only by Kestra workers that have been started with the key `gpu`, effectively delegating processing of scripts that require demanding computational requirements to the right server, rather than running them directly in a local container:

```yaml
id: gpuTask
namespace: dev

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.python.Commands
    runner: PROCESS
    commands:
		  - python ml_on_gpu.py
    workerGroup:
      key: gpu
```

---

## Building a custom Docker image

You can bake all dependencies needed for your script tasks directly into the Kestra's base image. Here is an example for Python tasks:

```dockerfile
FROM kestra/kestra:latest-full

USER root
RUN apt-get update -y && apt-get install pip -y

RUN pip install --no-cache-dir pandas requests kestra boto3
```

Build the image:

```bash
docker build -t kestra-python:latest .
```

Then, use that image in your `docker-compose.yml` file, as shown in the [Getting started](../../01.getting-started/index.md) guide.

```yaml
  kestra:
    image: kestra-python:latest
    pull_policy: never
```

Once you start Kestra containers using `docker compose up -d`, you can create a flow that directly runs Python tasks with your custom dependencies using the `PROCESS` runner:

```yaml
id: python-process
namespace: dev
tasks:
  - id: custom-dependencies
    type: io.kestra.plugin.scripts.python.Script
    runner: PROCESS
    script: |
      import pandas as pd
      import requests
```

See the [Docker Deployments](../../10.administrator-guide/02.deployment/01.docker.md) guide for more details on managing custom Kestra container images.

---

## Installing dependencies using `beforeCommands`

There are several ways of installing custom packages for your workflows. While you could bake all your package dependencies into a custom container image, often it's convenient to install a couple of additional packages at runtime without having to build separate images. The `beforeCommands` can be used for that purpose.

### pip install package

Here is a simple example installing `pip` packages `requests` and `kestra` before starting the script:

```yaml
id: pip
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: inlineScript
        type: io.kestra.plugin.scripts.python.Script
        docker:
          image: python:3.11-slim
        beforeCommands:
          - pip install requests kestra > /dev/null
        warningOnStdErr: false
        script: |
          import requests
          import kestra

          print(requests.__version__)
          print([i for i in dir(kestra.Kestra) if not i.startswith("_")])
```


### pip install -r requirements.txt

This example clones a Git repository that contains a `requirements.txt` file. The script task uses `beforeCommands` to install those packages. We then list recently installed packages to validate that this process works as expected:

```yaml
id: pythonRequirementsFile
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/examples
        branch: main

      - id: printRequirements
        type: io.kestra.plugin.scripts.shell.Commands
        runner: PROCESS
        commands:
          - cat requirements.txt

      - id: listRecentlyInstalledPackages
        type: io.kestra.plugin.scripts.python.Commands
        warningOnStdErr: false
        docker:
          image: python:3.11-slim
        beforeCommands:
          - pip install -r requirements.txt > /dev/null
        commands:
          - ls -lt $(python -c "import site; print(site.getsitepackages()[0])") | head -n 20
```

---

## Using Kestra's prebuilt images

Many data engineering use cases require performing fairly standardized tasks such as:

- processing data with `pandas`
- transforming data with `dbt-core` (*using a dbt adapter for your data warehouse*)
- making API calls with the `requests` library, etc.

To solve those common challenges, the [kestra-io/examples](https://github.com/orgs/kestra-io/packages?repo_name=examples) repository provides several **public** Docker images with the latest versions of those common packages. Many  [Blueprints](../01.getting-started/07.ui.md#blueprints)  use those public images by default. The images are hosted in GitHub Container Registry and follow the naming `ghcr.io/kestra-io/packageName:latest`.

### Example: running R script in Docker

Here is a simple example using the `ghcr.io/kestra-io/rdata:latest` Docker image provided by Kestra to analyze the built-in `mtcars` dataset using `dplyr` and `arrow` R libraries:

```yaml
id: rCars
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: r
        type: io.kestra.plugin.scripts.r.Script
        warningOnStdErr: false
        docker:
          image: ghcr.io/kestra-io/rdata:latest
        script: |
          library(dplyr)
          library(arrow)

          data(mtcars) # Load mtcars data
          print(head(mtcars))

          final <- mtcars %>%
            summarise(
              avg_mpg = mean(mpg),
              avg_disp = mean(disp),
              avg_hp = mean(hp),
              avg_drat = mean(drat),
              avg_wt = mean(wt),
              avg_qsec = mean(qsec),
              avg_vs = mean(vs),
              avg_am = mean(am),
              avg_gear = mean(gear),
              avg_carb = mean(carb)
            )
          final %>% print()
          write.csv(final, "final.csv")

          mtcars_clean <- na.omit(mtcars) # remove rows with NA values
          write_parquet(mtcars_clean, "mtcars_clean.parquet")

      - id: outputs
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - "*.csv"
          - "*.parquet"
```

R libraries are time-consuming to install. From a technical standpoint, you could install custom R packages at runtime as follows:

```yaml
id: rCars
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: r
        type: io.kestra.plugin.scripts.r.Script
        warningOnStdErr: false
        docker:
          image: ghcr.io/kestra-io/rdata:latest
        beforeCommands:
	        - Rscript -e "install.packages(c('dplyr', 'arrow'))" > /dev/null 2>&1
```


However, such installation may take up to 30 minutes, depending on the packages you install.

Prebuilt images such as `ghcr.io/kestra-io/rdata:latest` can help you iterate much faster. Before moving to production, you can build your custom images with the exact package versions that you need.


## Support for additional languages such as Rust via `shell.Commands` and Docker runner

The `Commands` scripts allow you to run arbitrary commands based on a Docker image. This means that you can use other languages (such as Rust) as long as:
1. Their dependencies can be packaged into a Docker image
2. Their execution can be triggered from a `Shell` command line.

Here is an example flow using a Rust image based on a [sample ETL project](https://github.com/kestra-io/examples/tree/main/examples/rust):

```yaml
id: rustFlow
namespace: dev
tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: rust
        type: io.kestra.plugin.scripts.shell.Commands
        commands:
          - etl
        docker:
          image: ghcr.io/kestra-io/rust:latest

      - id: downloadFiles
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - "*.csv"
```

Once the container finishes execution, you'll be able to download all CSV files generated by the Rust container from the Outputs tab.
The `ghcr.io/kestra-io/rust:latest` image is public, so you can directly use the example shown above and give it a try.

---

## The `Git` plugin

To use the `io.kestra.plugin.git.Clone` task in your flow, make sure to add it as the first child task of the `WorkingDirectory` task. Otherwise, you’ll get an error: `Destination path "xyz" already exists and is not an empty directory`. This happens because you can only clone a GitHub repository into an empty working directory.

### Add `io.kestra.plugin.git.Clone` as the first task in a `WorkingDirectory`

Adding the `io.kestra.plugin.git.Clone` task directly as the first child task of the `WorkingDirectory` task will ensure that you clone your repository into an empty directory before any other task would generate any output artifacts.

### Private Git repositories
Typically, you would want to use `io.kestra.plugin.git.Clone`  with a private GitHub repository. Make sure to:
1. Add your organization/user name as `username`
2. Generate your access token and provide it on the `password` property.

Below you can find links to instructions on how to generate an access token for the relevant Git platform:

- [GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Gitlab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/create-a-repository-access-token/)
- [AWS CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control.html)
- [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows)

---

## When to use the `WorkingDirectory` task

By default, all Kestra tasks are **stateless**. If one task generates files, those files won’t be available in downstream tasks unless they are persisted in internal storage. Upon each task completion, the temporary directory for the task is purged. This behavior is generally useful as it keeps your environment clean and dependency free, and it avoids potential privacy or security issues when exposing some data generated by a task to other processes.

Despite the benefits of the stateless execution, in certain scenarios, **statefulness** is **desirable**. Imagine that you want to execute several Python scripts, and each of them generates some output data. Another script combines that data as part of an ETL/ML process. Executing those related tasks in the same working directory and **sharing state** between them is helpful for the following reasons:
- You can **clone** your entire **GitHub branch** with multiple modules and configuration files needed to run several scripts
- You can **execute** multiple scripts **sequentially** on the same worker or in the same container, minimizing latency,
- **Output artifacts** of each task are directly available to other tasks without having to persist them within the internal storage.

The `WorkingDirectory` task addresses all of these challenges. It allows you to:
1. Clone a Git repository (or retrieve needed input files in other ways),
2. Run multiple tasks sequentially in the same working directory
3. Reuse the same file system's working directory across multiple tasks.

All tasks within the `WorkingDirectory` can use output artifacts from previous tasks without having to use the `{{outputs.taskId.outputAttribute}}` syntax.

---

## Generating outputs from a script task using `{{outputDir}}`

If you want to generate files in your script to make them available for download and use in downstream tasks, you can leverage the `outputDir` [expression](../07.concepts/06.expressions/01.index.md). Files stored in that directory will be persisted in Kestra's internal storage. Here is an example:

```yaml
id: outputTest
namespace: dev
tasks:
  - id: myPython
    type: io.kestra.plugin.scripts.python.Script
    runner: PROCESS
    script: |
      f = open("{{outputDir}}/myfile.txt", "a")
      f.write("Hi, this is output from a script 👋")
      f.close()

  - id: myShell
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - cat {{outputs.myPython.outputFiles['myfile.txt']}}
```

The first task creates a file `'myfile.txt'` and the next task can access it by leveraging the syntax `{{outputs.yourTaskId.outputFiles['yourFileName.fileExtension']}}`.

Check the [Outputs](../07.concepts/outputs.md) page for more details about managing outputs.


## The `LocalFiles` task to manage `inputs` and `outputs` for your script code


The `LocalFiles` task is meant to be used inside the `WorkingDirectory` task.

It allows you to **output files** generated in a script and **add new files inline** within the YAML workflow definition. The examples from the previous sections demonstrate how you can use **inputs** and **outputs**. The subsections below provide additional explanation and further examples.

### Managing input files: `LocalFiles.inputs` to configure `requirements.txt`

The `inputs` property can be used to add input files that might be needed in your script. Imagine that you want to add a custom `requirements.txt` file that contains exact pip package versions, as in this example:

```yaml
id: pip
namespace: dev

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
    - id: pip
      type: io.kestra.core.tasks.storages.LocalFiles
      inputs:
        requirements.txt: |
          kestra>=0.6.0
          pandas>=1.3.5
          requests>=2.31.0

    - id: pythonScript
      type: io.kestra.plugin.scripts.python.Script
      docker:
        image: python:3.11-slim
      beforeCommands:
        - pip install -r requirements.txt > /dev/null
      warningOnStdErr: false
      script: |
        import requests
        import kestra
        import pandas as pd

        print(f"requests version: {requests.__version__}")
        print(f"pandas version: {pd.__version__}")
        methods = [i for i in dir(kestra.Kestra) if not i.startswith("_")]
        print(f"Kestra methods: {methods}")
```

Adding such additional configuration files is possible by using the `inputs` property of the `LocalFiles` task. You provide:
- the **file name** as **key**
- the **file's content** as **value**

In the example shown above, the key is `requirements.txt` and the value is the typical content of a [`requirements` file](https://pip.pypa.io/en/stable/reference/requirements-file-format/#requirements-file-format) listing `pip` packages and their version constraints.


### Using input files to pass data from a trigger to a script task

Another use case for input files is when your custom scripts need input coming from other tasks or triggers.

Consider the following example flow that runs when a new object with the prefix `"raw/"` arrives in the S3 bucket `"declarative-orchestration"`:

```yaml
id: s3TriggerCommands
namespace: blueprint
description: process CSV file from S3 trigger

tasks:
  - id: wdir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: cloneRepo
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/examples
        branch: main

      - id: local
        type: io.kestra.core.tasks.storages.LocalFiles
        inputs:
          data.csv: "{{ trigger.objects | jq('.[].uri') | first }}"

      - id: python
        type: io.kestra.plugin.scripts.python.Commands
        description: this script reads a file `data.csv` from S3 trigger
        docker:
          image: ghcr.io/kestra-io/pydata:latest
        warningOnStdErr: false
        commands:
          - python scripts/clean_messy_dataset.py

      - id: output
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - "*.csv"
          - "*.parquet"

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

Because the `LocalFiles` is a dedicated task independent of the Python task, it can be used to pass the S3 object key (*downloaded to Kestra's internal storage by the S3 trigger*) as a local file to any downstream task. Note that we didn't have to hardcode anything specific to Kestra in the Python script from GitHub. That script remains pure Python that you can run anywhere. Kestra's trigger logic is stored along with orchestration and infrastructure configuration in the YAML flow definition.

This separation of concerns (*i.e. not mixing orchestration and business logic*) makes your code easier to test and keeps your business logic vendor-agnostic.


### Managing output files: `LocalFiles.outputs`

Using the previous example, note how the `LocalFiles` can be used to output any file as downloadable artifacts. [This script from GitHub](https://github.com/kestra-io/examples/blob/main/scripts/clean_messy_dataset.py#L12) outputs a file named `clean_dataset.csv`. However, you don't have to hardcode that specific file name. Instead, a simple [Glob](https://en.wikipedia.org/wiki/Glob_(programming)) expression can be used to define that you want to output any CSV or Parquet file generated by that script:

```yaml
      - id: output
        type: io.kestra.core.tasks.storages.LocalFiles
        outputs:
          - "*.csv"
          - "*.parquet"
```
If any files matching that  [Glob](https://en.wikipedia.org/wiki/Glob_(programming)) patterns are generated during the flow's Execution, they will be available for download from the **Outputs** tab.

---

## How to emit `outputs` and `metrics` from script tasks

The `LocalFiles.outputs` is useful to send files generated in a script to Kestra's internal storage so that these files can be used in downstream tasks or exposed as downloadable artifacts. However, `outputs` can also be simple key-value pairs that contain metadata generated in your scripts.

Many tasks from Kestra plugins emit certain outputs by default. You can inspect which outputs are generated by each task or trigger from the respective plugin documentation. For instance, follow [this plugin documentation link](https://kestra.io/plugins/plugin-fs/tasks/http/io.kestra.plugin.fs.http.download#outputs) to see the outputs generated by the HTTP Download task. Once the flow is executed, the Outputs tab will list the output metadata as key-value pairs. Run the example below to see it in action:

```yaml
id: download
namespace: dev
tasks:
  - id: http
    type: io.kestra.plugin.fs.http.Download
    uri: https://raw.githubusercontent.com/kestra-io/examples/main/datasets/orders.csv
```

This example automatically emits output metadata, such as the status `code`, file `uri` and request `headers` because those properties have been preconfigured on that plugin's task. However, in your custom script, you can decide what metadata you want to send to Kestra to make that metadata visible in the UI.

### Outputs and metrics in Script and Commands tasks

The [Scripts Plugin](https://github.com/kestra-io/plugin-scripts)  provides convenient methods to send outputs and metrics to the Kestra backend during flow Execution. Under the hood, Kestra tracks outputs and metrics from script tasks by searching standard output and standard error for `::{}::` or `{}` patterns that allow you to specify outputs and metrics using a JSON request payload:
- `{}` for single-line JSON objects
- `::{}::` for multi-line JSON objects.

> Note that `outputs` require a **dictionary**, while `metrics` expect a **list of dictionaries**.

Below is an example showing `outputs` with key-value pairs:

```json
"outputs": {
    "key": "value",
    "exampleList": [1, 2, 3],
    "tags": {
	    "s3Bucket": "declarative-orchestration",
	    "region": "us-east-1"
    }
}
```

Here is the representation of a `metrics` object. It's a **list of dictionaries**:

```json
"metrics": [
    {
        "name": "myMetric", // mandatory, the name of the metrics
        "type": "counter", // mandatory, "counter" or "timer" metric type
        "value": 42, // mandatory, Double or Integer value
        "tags": { // optional list of tags
          "readOnly": true,
          "location": "US"
        }
    }
]
```

Both, outputs and metrics can optionally include a list of tags that expose internal details.

### Metric types: `counter` and `timer`

There are two metric types:
1. `counter`, expressed in **Integer** or **Double** data type, measures a countable number of rows/bytes/objects processed in a given task
2. `timer`, expressed in **Double** data type, measures the number of `seconds` to process specific computation in your flow.

Below you can find examples of `outputs` and `metrics` definition for each language.

### Python

The example below shows how you can add simple key-value pairs in your Python script to send custom metrics and outputs to Kestra's backend at runtime:

```python
from kestra import Kestra

Kestra.outputs({'data': data, 'nr': 42})
Kestra.counter('nr_rows', len(df), tags={'file': filename})
Kestra.timer('ingestion_duration', duration, tags={'file': filename})
```

The `Kestra.outputs({"key": "value"})` takes a dictionary of key-value pairs, while the metrics such as **Counter** and **Timer** take the metric name, metric value and a dictionary of tags as positional arguments, for example:
- `Kestra.counter("countable_int_metric_name", 42, tags={"key": "value"})`
- `Kestra.timer("countable_double_metric_name", 42.42, tags={"key": "value"})`

Here is a more comprehensive example in a flow:

```yaml
id: outputsMetricsPython
namespace: dev

inputs:
  - name: attempts
    type: INT
    defaults: 10

tasks:
  - id: py
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    docker:
      image: ghcr.io/kestra-io/pydata:latest
    script: |
      import timeit
      from kestra import Kestra

      attempts = {{inputs.attempts}}
      modules = ['pandas', 'requests', 'kestra', 'faker', 'csv', 'random']
      results = {}

      for module in modules:
          time_taken = timeit.timeit(f'import {module}', number=attempts)
          results[module] = time_taken
          Kestra.timer(module, time_taken, tags=dict(nr_attempts=attempts))

      Kestra.outputs(results)
```


### Node.js

Node.js follows the same syntax for sending outputs and metrics as in Python. Here is an example:

You need to install the [npm package](https://www.npmjs.com/package/@kestra-io/libs), that can be done with a `beforeCommands`:

```yaml
beforeCommands:
 - npm i @kestra-io/libs
```

The just require or import the package:

```js
const Kestra = require("@kestra-io/libs");
Kestra.outputs({data: 'data', nr: 42, mybool: true, myfloat: 3.65});
Kestra.counter('metric_name', 100, {partition: 'file1'});
Kestra.timer('timer1', (callback) => {setTimeout(callback, 1000)}, {tag1: 'hi'});
Kestra.timer('timer2', 2.12, {tag1: 'from', tag2: 'kestra'});
```
### Shell

To send outputs and metrics from a Shell task, wrap a JSON payload (i.e. a map/dictionary) with double colons `'::{"outputs": {"key":"value"}}::'` or `'::{"metrics": [{"name":"count","type":"counter","value":1,"tags":{"key":"value"}::'` as shown in the following examples:

```shell
# 1. send outputs with different data types
echo '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'

# 2. send a counter with tags
echo '::{"metrics":[{"name":"count","type":"counter","value":1,"tags":{"tag1":"i","tag2":"win"}}]}::'

# 3. send a timer with tags
echo '::{"metrics":[{"name":"time","type":"timer","value":2.12,"tags":{"tag1":"i","tag2":"destroy"}}]}::'
```

The JSON payload should be provided without any spaces.

---

## When to use metrics and when to use outputs?

If you want to track task-run metadata across multiple executions of a flow, and this metadata is of an arbitrary data type (*it might be a string, a list of dictionaries, or even a file*), use `outputs` rather than `metrics`. Metrics can only be used with numerical values.

### Use cases for `outputs`: results of a task of any data type

Outputs are task-run artifacts. They are generated as a **result** of a given task. Outputs can be used for two reasons:
1. To **pass data** between tasks
2. To **generate result artifacts** for observability and auditability e.g. to track specific metadata or to share downloadable file artifacts with business stakeholders.

### Using outputs to pass data between tasks

Outputs can be used to pass data between tasks. One task can generate some outputs and other task can use that value:

```yaml
id: outputsInputs
namespace: dev
tasks:
    - id: passOutput
      type: io.kestra.core.tasks.debugs.Return
      format: "hello world!"
    - id: takeInput
      type: io.kestra.core.tasks.debugs.Return
      format: "data from previous task - {{ outputs.passOutput.value }}"
```

### Use cases for `metrics`: numerical values that can be aggregated and visualized across Executions

Metrics are intended to track custom **numeric** (metric type: `counter`) or **duration** (metric type: `timer`) attributes that you can visualize across flow executions, such as number of rows or bytes processed in a task. Metrics are expressed as numerical values of `integer` or  `double` data type.

Examples of metadata you may want to track as `metrics`:
- the **number of rows** processed in a given task (e.g. during data ingestion or transformation),
- the **accuracy score** of a trained ML model in order to compare this result across multiple workflow runs (*e.g. you can see the average or max value across multiple executions*),
- other pieces of **metadata** that you can track across executions of a flow (e.g. a duration of a certain function execution within a Python ETL script).

