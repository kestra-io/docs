---
title: "Kestra vs Jenkins - Picking the Right Tool"
description: "Deep Dive into various use cases for both tools"
date: 2024-11-25T18:00:00
category: Solutions
author:
  name: Will Russell
  image: "wrussell"
image: /blogs/2024-11-25-kestra-vs-jenkins.jpg
---

Jenkins is a well known open source automation server, commonly used for CI/CD.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/TKdfkGiRzxM?si=-xBNjKS0yoflSSfL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Through this article, we're going to look at a few common use cases in both Kestra and Jenkins and see how they compare.

To help us decide which is best for each use case, we will be giving out each platform a point for the following:
- Overview of workflows/pipelines
- Viewing runs and logs
- Starting workflows/pipelines
- Installing and managing plugins
- Integration with Git
- Managing alerts

To try these areas, we'll look at the following use cases:
- Running tests
- Building code
- Deploying to the cloud

## Running Tests

Running tests is a common use case for a automation/orchestrator. The example we're going to build in both platforms will:
- Clone a git repository
- Install pytest dependency
- Run pytest tests
- Send a Slack notification

In Jenkins, we will use Groovy to declare our pipeline. In this example, we are using a docker container with a `python` image to run our stages. The first stage clones the repository. 

After that, we set up a virtual environment as Jenkins doesn't let you install dependencies to the container directly. Despite the container isolating pipelines from each other, you will need to use a virtual environment to install pytest.

In our final stage, we run the pytest tests, but we need to reactivate the virtual environment for the separate stage. The success message here will determine whether the pipeline build will pass or fail.

Afterwards, we use a `post` block to send a Slack notification using variables to dynamically set the message based on the output. The nice thing here is that this will run separately to the pipeline, enabling us to send a message about it.
 

```groovy
pipeline {
    agent { docker { image 'python:3.9.0' } }
    
    stages {
        stage('checkout') {
            steps {
                git(
                    url: 'https://github.com/wrussell1999/kestra-examples.git',
                    branch: 'main'
                ) 
            }
        }
        stage('dependencies') {
            steps {
                sh 'python3 -m venv .venv'
                sh '. .venv/bin/activate && pip install pytest'
            }
        }
        stage('tests') {
            steps {
                sh '. .venv/bin/activate && pytest demos/jenkins-vs-kestra/1-tests'
            }
        }
    }
    post {
        always {
            //Add channel name
            slackSend channel: '#general',
            message: "Find Status of Pipeline:- ${currentBuild.currentResult} ${env.JOB_NAME} ${env.BUILD_NUMBER} ${BUILD_URL}"
        }
    }
}
```

In Kestra, our workflows are written in YAML. Similar to the Jenkins example, we will be running pytest inside of a Docker container, which means we don't need to set up a virtual environment. Instead, we can just install it directly to the container using `beforeCommands`.

To allow our tasks to interact with the files cloned from the Git repostiroy, we use a `WorkingDirectory` task to create a shared file system for these tasks.

```yaml
id: python_testing
namespace: company.team

tasks:
  - id: workingdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/wrussell1999/kestra-examples
        branch: main

      - id: run_test
        type: io.kestra.plugin.scripts.python.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        beforeCommands:
          - pip install pytest
        commands:
          - pytest demos/jenkins-vs-kestra/1-tests

  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
```

### Managing Git

One of the parts of running these tests is cloning a Git repository with our code in it. While this is helpful, being able to version control your workflows and pipelines with them is important.

In Jenkins, you can simply add a Jenkinsfile to your repository and put your Groovy code in here.


```groovy
pipeline {
    agent { docker { image 'python:3.9.0' } }
    
    stages {
        stage('dependencies') {
            steps {
                sh 'python3 -m venv .venv'
                sh '. .venv/bin/activate && pip install pytest'
            }
        }
        stage('tests') {
            steps {
                sh '. .venv/bin/activate && pytest demos/jenkins-vs-kestra/1-tests'
            }
        }
    }

    post {
        always {
            //Add channel name
            slackSend channel: '#general',
            message: "Find Status of Pipeline:- ${currentBuild.currentResult} ${env.JOB_NAME} ${env.BUILD_NUMBER} ${BUILD_URL}"
        }
    }
}
```

In Kestra, there's a few ways you can integrate your workflows with Git. Mainly by having a separate workflow that can automatically pull your flows from your git repository to your production instance of Kestra.



```yaml
id: sync_from_git
namespace: system

variables:
  gh_username: wrussell1999
  gh_repo: https://github.com/wrussell1999/dev-to-prod

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    gitDirectory: _flows
    targetNamespace: company.engineering
    includeChildNamespaces: true
    delete: true
    url: "{{ vars.gh_repo }}"
    branch: main
    username: "{{ vars.gh_username }}"
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"

  - id: sync_namespace_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    namespace: company.engineering
    gitDirectory: _files
    delete: true
    url: "{{ vars.gh_repo }}"
    branch: main
    username: "{{ vars.gh_username }}"
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"

triggers:
  - id: on_push
    type: io.kestra.plugin.core.trigger.Webhook
    key: abcdefg
```

## Building Code

```groovy
pipeline {
    agent { docker { image 'python:3.9.0' } }
    
    stages {
        stage('checkout') {
            steps {
                git(
                    url: 'https://github.com/wrussell1999/kestra-examples.git',
                    branch: 'main'
                ) 
            }
        }
        stage('dependencies') {
            steps {
                sh 'python3 -m venv .venv'
            }
        }
        stage('tests') {
            steps {
                sh '. .venv/bin/activate && python demos/jenkins-vs-kestra/2-deploy/example.py'
            }
        }
    }
}
```

```yaml
id: deploy_to_cloud
namespace: company.team

tasks:
  - id: workingdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/wrussell1999/kestra-examples
        branch: main
      
      - id: run_code
        type: io.kestra.plugin.scripts.python.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        inputFiles:
          example.py: "{{ workingDir }}/demos/jenkins-vs-kestra/2-deploy/example.py"
        commands:
          - python example.py
```

## Deploying to the Cloud

- Task Runners vs Cloud Agents

```yaml
id: run_python_on_cloud
namespace: company.team

variables:
  region: eu-west-2
  bucket: kestra-example
  compute_env_arn: "arn:aws:batch:eu-central-1:123456789012:compute-environment/kestraFargateEnvironment"
  job_queue_arn: "arn:aws:batch:eu-central-1:123456789012:job-queue/kestraJobQueue"
  execution_role_arn: "arn:aws:iam::123456789012:role/kestraEcsTaskExecutionRole"
  task_role_arn: "arn:aws:iam::123456789012:role/ecsTaskRole"

tasks:
  - id: workingdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/wrussell1999/kestra-examples
        branch: main

      - id: run_code
        type: io.kestra.plugin.scripts.python.Commands
        taskRunner:
          type: io.kestra.plugin.ee.aws.runner.Batch
          accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID')}}"
          secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
          region: "{{ vars.region }}"
          bucket: "{{ vars.bucket }}"
          computeEnvironmentArn: "{{ vars.compute_env_arn }}"
          jobQueueArn: "{{ vars.job_queue_arn }}"
          executionRoleArn: "{{ vars.execution_role_arn }}"
          taskRoleArn: "{{ task_role_arn }}"
        inputFiles:
          example.py: "{{ workingDir }}/demos/jenkins-vs-kestra/2-deploy/example.py"
        commands:
          - python example.py
```

## Alerting

```yaml
id: failure_alert_slack
namespace: system

tasks:
  - id: send_alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{ trigger.executionId }}"

triggers:
  - id: on_failure
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING
```


## Summary

In summary, both Kestra and Jenkins have certain features that stand out to each other.

| Criteria | Kestra | Jenkins |
| - | - | - |
| Overview of workflows/pipelines | 1 | 0 |
| Viewing runs and logs | 1 | 0 |
| Integration with Git | 0 | 1 |
| Managing alerts | 1 | 0 |
| Installing and managing plugins | 0 | 1 |
| Total | 3 | 2 |

Jenkins stands out for:
- Using a Jenkinsfile to keep your pipeline and code in one place, and keep it out of Jenkins 
- Managing Plugins both from the CLI and UI, with options to install without restarting the server
- Schedule builds at a set time, but automatically spread them out to prevent overloading the server

Kestra stands out for:
- Useful dashboard giving you quick insights at your finger tips
- Clearer and easier to navigate to find information such as logs, execution status and workflows
- Integrated Editor with Autocomplete