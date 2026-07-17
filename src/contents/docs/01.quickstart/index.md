---
title: "Quickstart Guide: Run Your First Kestra Workflow"
h1: "Get Started with Kestra: Launch Locally with Docker and Run Your First Workflow"
sidebarTitle: Quickstart
icon: /src/contents/docs/icons/quickstart.svg
description: Get started with Kestra in minutes by launching Kestra locally with Docker and running your first workflow.
---

Launch Kestra locally, create a simple flow, and run your first execution in a few minutes.

## Watch the quickstart video

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/bQNmXge5vSY?si=ueqzWRVVtuGiAwjU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Prerequisites

- Install Docker in your environment. We recommend [Docker Desktop](https://docs.docker.com/get-docker/).
- If you use Windows, make sure [WSL](https://docs.docker.com/desktop/wsl/) is enabled.

## Step 1: Start the Kestra container

Once Docker is running, start Kestra with a single command:

```bash file=src/contents/docs/_snippets/install/docker-run.sh
```

If you re-run the command and Docker reports `You have to remove (or rename) that container to be able to reuse that name.`, remove the old container with `docker rm -f kestra` or pick a different `--name`.

:::collapse{title="This command does the following:"}
- starts Kestra on port `8080`
- stores local files in the `kestra_data` Docker volume
- persists the H2 database in the `kestra_db` Docker volume
- mounts `/tmp` and the Docker socket so script and container tasks can run locally
:::

The container is ready when the logs show `Main server is running at http://...:8080`.

## Step 2: Open the Kestra UI

Open `http://localhost:8080` in your browser. You will see the Kestra UI when the container is running. From here, create your user, create a flow with the AI Copilot, and complete the deep-dive tutorial to begin building your first flows.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/Vzkk6nAJSdkaXvGDSdBC?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Welcome to Kestra | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

<br />

:::alert{type="info"}
The above command starts Kestra with an embedded H2 database. Storage files are stored on the `kestra_data` Docker volume, and the H2 database is persisted on the `kestra_db` Docker volume. For production-ready persistence with a PostgreSQL database and more configurability, follow the [Docker Compose installation](../02.installation/03.docker-compose/index.md).
:::

## Stop and reset Kestra

To stop the container, press `Ctrl+C` in the terminal where it's running. Because the `docker run` command uses `--rm`, the container is removed automatically on exit — but the `kestra_data` and `kestra_db` Docker volumes are preserved.

When you re-run the same `docker run` command, Kestra picks up those volumes and your previous state (flows, executions, and your user account) is restored. If the sign-up page appears again, your account already exists — sign in with the credentials you created on the first run.

To start completely fresh, remove the volumes before re-running:

```bash
docker volume rm kestra_data kestra_db
```

:::alert{type="info"}
If you find yourself stopping and restarting Kestra frequently, the [Docker Compose installation](../02.installation/03.docker-compose/index.md) is easier to manage and gives you more control over configuration.
:::

## Next steps

You've taken the product tour, executed your first flow, and explored Kestra. Next, follow the documentation in this order to build on what you've learned:

- Continue with a [Tutorial](../03.tutorial/index.mdx) to add inputs, outputs, triggers, and more task types.
- Follow the full [Installation guide](../02.installation/index.mdx) for persistent local or distributed setups.
- Explore the available [Plugins](/plugins) to integrate with external systems, and begin orchestrating your applications, microservices, and processes.
- [Contribute to Kestra](../04.contribute-to-kestra/index.mdx) – whether a developer or not, we value outside contribution of all kinds: Plugins, Features, Documentation, Feature Requests, and Bug Reports. Get involved!

:::alert{type="info"}
**Using an AI coding agent?** Add the [Kestra MCP server](../ai-tools/kestra-mcp-resources/index.md) to Claude Code, Cursor, or any MCP-compatible tool for live access to plugin docs, blueprints, and Kestra documentation while you build.
:::
