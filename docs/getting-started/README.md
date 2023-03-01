---
order: 1
---

# Getting Started

This document will guide you through setting up Kestra and creating your first flow in a few minutes.

## Prerequisites

Make sure the following is installed:
- Docker, [Docker Desktop](https://docs.docker.com/get-docker/) is the easiest way to use it.

## Run Kestra

### Download Docker Compose file

Download the Docker Compose file for Kestra using the following command: 

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml
```

If you don't have curl installed, you can download the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) and save it as `docker-compose.yml`. 

### Start your server

Make sure the Docker is up and running. Then, run the following command:

```bash
docker compose up -d
```

Open [http://localhost:8080](http://localhost:8080) in your browser; this is the Kestra interface.


## Create your first Flow

Kestra comes with some examples you can access in the **Flows** menu. 

Let's create a new Flow:

* Click on the **+ Create** button at the bottom right.

![Create a flow](./assets/flow-2.png)

* Paste the following Flow definition.

```yaml
id: logs
namespace: io.kestra.tests

tasks:
- id: t1
  type: io.kestra.core.tasks.debugs.Echo
  format: first {{task.id}}
  level: TRACE
- id: t2
  type: io.kestra.core.tasks.debugs.Echo
  format: second {{task.type}}
  level: WARN
- id: t3
  type: io.kestra.core.tasks.debugs.Echo
  format: third {{flow.id}}
  level: ERROR
```

* Click on the **Save** button.

A flow is a list of tasks executed one after the other and has an identifier (id) and a namespace.
A task is a piece of work that the flow will run. 

Here, the flow has three tasks of type `Echo`, each with a unique identifier (id). 
The `Echo` task displays something in the log, like the bash `echo` command.
Each task can have multiple properties, the `Echo` task has two properties which are the `format` property that represents the message that will be displayed on the log, and the `level` property.

Now, click on the **Topology** tab. You will see here a graph that is the topology of your flow.

![Flow Topology](./assets/flow-3.png)


## Execute your first Flow

Now let's execute our first Flow and see it running:

* Go to the **Execute** tab.
* Hit the **Execute** button on top.
* You will see in real-time the execution of the current flow.

![Execution Gantt](./assets/execution-1.png)

* Look at the log of the current task in the **Logs** tab.

![Execution Log](./assets/execution-2.png)

* Watch the topology of the current execution.

![Execution Topology](./assets/execution-3.png)


## Next Steps

Now, you are ready to use Kestra!

As the next steps, we suggest reading the following documentation in this order:
- Learn Kestra [concepts](../concepts).
- Read the [Developer Guide](../developer-guide) to understand how to build your own flow.
- Look at [Plugins](../../plugins) to perform some real tasks.
- [Deploy](../administrator-guide) your Kestra instance to real environments.
