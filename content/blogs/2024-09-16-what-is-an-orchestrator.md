---
title: "How Orchestration Can Optimize Your Engineering Processes"
description: "Learn what an orchestrator is and why you should use it"
date: 2024-09-16T15:00:00
category: Solutions
author:
  name: Federico Trotta
  image: "ftrotta"
image: /blogs/2024-09-16-what-is-an-orchestrator.jpg
---

If you're an engineer looking to scale your automation - maybe because your company is growing rapidly — then this article is definitely for you.

Here, we’ll break down what an orchestrator is, why you might need one, and provide a practical example using Kestra.

Let’s dive in!

## What is an Orchestrator?

In software engineering and data management, an orchestrator is a tool or platform that automates, manages, and coordinates various workflows and tasks across different services, systems, or applications.

Think of it like a conductor of an orchestra, making sure all components perform in harmony, following a predefined sequence or set of rules. Whether you're dealing with data pipelines, microservices, or CI/CD systems, an orchestrator ensures everything runs smoothly, efficiently, and without manual intervention.

## Orchestration vs. Automation 

At this point, you might ask yourself: what's the difference between automation and orchestration? Well, these two concepts are somehow related, but are diffetenr. Let's see:

- **Automation** refers to the execution of individual tasks or actions without manual intervention. For example, automatically triggering a test suite after a code commit is automation.
  
- **Orchestration** goes beyond automation by managing the flow of multiple interconnected tasks or processes. It defines not only what happens but also when and how things happen, ensuring that all tasks (whether automated or not) are executed in the correct order, with the right dependencies and error handling in place.

In essence, while automation focuses on individual tasks, orchestration ensures all those tasks are arranged and managed within a broader, cohesive system. This is particularly vital in environments where complex processes with interdependent steps need to be handled efficiently.

![Orchestration vs Automation Diagram by Federico Trotta](/blogs/2024-09-16-what-is-an-orchestrator/automation_orchestration.png)

To explain the difference even further, let’s look at some practical examples.

### Examples of Task Automation

Here are a few common examples of task automation:

- **Automated testing after code commits**: When a developer pushes new code to a repository, an automated test suite runs without manual intervention. This ensures that the code is tested for errors, performance, or adherence to standards every time a change is made.

- **Automated backups**: A scheduled task automatically triggers data backups at a specific time, like every night at midnight. The system takes a snapshot of databases and stores it in a safe location without requiring manual action from an admin.

- **Automated email notifications**: In customer support systems, an automated task might send an email notification to users once their support ticket status is updated. The system detects the change and triggers the email automatically.

### Examples of Orchestration

Now, let’s check out some orchestration examples:

- **Data pipeline orchestration**: Consider an ETL workflow where data is extracted from a source, transformed, and then loaded into a database. The orchestrator ensures these steps happen in sequence: first extracting the data, then transforming it, and finally loading it into the database. If one step fails, the orchestrator can retry or trigger an error-handling process.

- **CI/CD pipeline orchestration**: In a CI/CD pipeline, orchestration involves tasks like compiling code, running tests, deploying to a staging environment, and triggering manual approval for production deployment. The orchestrator ensures that each task runs in the correct order and only when the previous task has been successfully completed.

- **Cloud infrastructure orchestration**: When deploying a new environment in the cloud, an orchestrator manages the provisioning of servers, databases, and network configurations. It ensures that all resources are created in the right order, handling dependencies such as setting up the network before deploying a database.

## Benefits of Using an Orchestrator

Today, IT teams manage a wide range of systems and applications across datacenters, clouds, and edge locations. As these environments grow in complexity, automating tasks can improve efficiency and make processes easier to manage. But as your company scales, you may find that only automation isn’t enough: this is where an orchestrator becomes essential.

So, here are some key benefits of using an orchestrator:

1. **Efficiency and automation**: Orchestrators manage entire workflows, reducing the need for manual intervention. This leads to faster execution, fewer human errors, and improved consistency across tasks.
  
2. **Scalability**: Orchestrators can handle workflows across multiple systems and scale as your operations grow. Whether you’re managing thousands of microservices or large-scale data processing tasks, an orchestrator ensures smooth operation with built-in scaling features.
  
3. **Error handling and resiliency**: Orchestrators are designed to manage failures, retries, and dependencies. If a task fails, the orchestrator can automatically retry it, send alerts, or trigger a recovery process—ensuring resiliency in complex systems.
  
4. **Improved monitoring and control**: Most orchestrators provide real-time monitoring and logs, giving engineers insights into each task’s status, performance, and any bottlenecks. This visibility helps in troubleshooting and optimizing workflows.
  
5. **Process standardization**: Orchestrators allow companies to standardize processes across systems and services, improving consistency and making it easier to introduce and scale new processes.

## Common Use Cases for Orchestrators

Now that we’ve covered what an orchestrator is and its benefits, let’s look at some common use cases:

- **Data engineering and ETL pipelines**: In data-driven environments, orchestrators automate the process of extracting, transforming, and loading data from various sources. For example, a data orchestrator can trigger a pipeline to extract data from a database, transform it, and then load it into a data warehouse like Snowflake or Google BigQuery.

- **CI/CD pipelines**: Orchestrators help automate the continuous integration and deployment process by managing tasks such as code building, testing, and deployment. Engineers define the pipeline steps in configuration files, and the orchestrator executes them automatically whenever new code is pushed.

- **Microservices orchestration**: In distributed systems, microservices need to communicate and coordinate with each other. Orchestrators manage the lifecycle of these services, ensuring they start, stop, and scale according to predefined rules, improving service-to-service interactions.

- **Cloud infrastructure management**: Orchestrators automate the provisioning of cloud infrastructure, such as virtual machines, databases, and networking configurations, often working alongside continuous delivery pipelines.

## Kestra: An Example of an Orchestrator in Action

Let’s look at a practical example using Kestra, an event-driven orchestration platform that governs business-critical workflows as code in the UI.

### Example: Fetching Exchange Rates with Kestra

To reproduce this example, make sure you have Kestra installed. You can follow the [installation guide](../docs/02.installation/index.md) to get started.

Let’s say you’ve written a Python script that fetches currency exchange rates from a web API and prints them if the request is successful. Here’s a Python script for doing that:
```python
import requests

# Define the URL of the API
api_url = 'https://api.exchangerate-api.com/v4/latest/USD'

# Send a GET request to the API
response = requests.get(api_url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    print('Exchange rates data:')
    print(data)
else:
    print('Failed to retrieve data. Status code:', response.status_code)
```

Now, in Kestra, click on **Namespaces** > **Company**:

![Namespaces in Kestra - by Federico Trotta](/blogs/2024-09-16-what-is-an-orchestrator/company.png)

In **Editor** click on **Create folder** and call it *team*, for example:

![Creating a folder in Kestra - by Federico Trotta](/blogs/2024-09-16-what-is-an-orchestrator/new_folder.png)

Then, click on **Create file** and give it a name and an extension. Let's say you call it `python_test.py`; inside it put the Python code to fetch the data:

![A python test in Kestra - by Federico Trotta](/blogs/2024-09-16-what-is-an-orchestrator/python_test.png)

Now, in **Flows** click on **Create** and fill in the YAML file as follows:
```yaml
id: python_test
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install requests
    commands:
      - python python_test.py
```

> **NOTE**: The YAML reports the following:
> - The `company.team` namespace which is the subfolder where the Python file is stored.
> - The type `io.kestra.plugin.scripts.python.Commands` is used to run Python files that are stored into Kestra. Read more [here](https://kestra.io/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.commands).
> In `beforeCommands` the YAML installs the library `requests`. In this case, Kestra may output a warning where suggest using a virtual environment, but the code runs anyway.
> - `python python_test.py` executes the Python script.

When you've done, click on **Execute** and, in the logs section, you'll see the results:

![results.png]()

Finally, if you want to improve the workflow even more, you could add a [trigger](../docs/03.tutorial/04.triggers.md) that, for example, downloads the data every hour, so that your data are alwayd updated. In this case, you only need to modify the YAML and add a scheduling trigger, using crontab expressions, like so:

```yaml
id: python_test
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install requests
    commands:
      - python python_test.py

triggers:
    - id: schedule_trigger
      type: io.kestra.plugin.core.trigger.Schedule
      cron: 0 10 * * *
```


## Conclusions
So, an orchestrator is a tool or a platform for automating, managing, and scaling workflows across various domains, from data engineering to microservices and cloud infrastructure. By providing automation, scalability, and error handling, orchestrators enable engineers to focus on building and optimizing their systems rather than managing them manually.