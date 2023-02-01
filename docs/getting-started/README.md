---
order: 1
---

# Getting Started

This document will guide you through setting up Kestra in a few minutes.

## Prerequisites

Make sure the following is installed:
- [Docker Desktop](https://docs.docker.com/get-docker/)

## Run Kestra

### Download Docker Compose File

Download the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) and save it as `docker-compose.yml`. In Linux and macOS, you can run the following command: 

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml
```

### Start your server

Make sure the Docker Desktop app is running. Then, run the following command:

```bash
docker-compose up -d
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

**Note:** If you run into memory issues, check out the [Troubleshooting page](../troubleshooting/).

## Create your first flow

Kestra comes with some examples you can access in the **Flows** menu. Let's create a new one:

* Click on the **+ Create** button at the bottom right.

<CaptionedImage src="/docs/getting-started/flow-2.png" width="700" caption="Create a flow"></CaptionedImage>

* Paste the flow below.

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

You will see the topology of your flow as a graph in the **Topology** tab.

<!-- ![Flow Topology](./assets/flow-3.png) -->


## Execute your first flow

Now let's execute our first flow and see it running:

* Go to the **Execute** tab.
* Hit the **Execute** button on top.
* You will see in real-time the execution of the current flow.

<CaptionedImage src="/docs/getting-started/execution-1.png" width="700" caption="Execution Gantt"></CaptionedImage>

* Look at the log of the current task in the **Logs** tab.

<CaptionedImage src="/docs/getting-started/execution-2.png" width="700" caption="Execution Log"></CaptionedImage>

* And watch the topology of the current execution.

<CaptionedImage src="/docs/getting-started/execution-3.png" width="700" caption="Execution Topology"></CaptionedImage>


## Next Steps

Now, you are ready to use Kestra!

As next steps, we suggest reading the following documentations in this order:
- Learn Kestra [concepts](../concepts).
- Read the [Developer Guide](../developer-guide) to understand how to build your own flow.
- Look at [Plugins](../../plugins) to perform some real tasks.
- [Deploy](../administrator-guide) your Kestra instance to real environments.
