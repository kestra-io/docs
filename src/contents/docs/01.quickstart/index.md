---
title: Kestra Quickstart Guide – Run Your First Workflow
sidebarTitle: Quickstart
icon: /src/contents/docs/icons/quickstart.svg
description: Get started with Kestra in minutes by running your first workflow using Docker or the standalone JAR.
---

Start Kestra in a Docker container, and create your first flow.

## Run your first Kestra Workflow with Docker

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/3gS3-mu9GvU?si=ox_KahyFm9dSGJGG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Start Kestra

:::alert{type="info"}
**Prerequisite**: Make sure Docker is installed in your environment. We recommend [Docker Desktop](https://docs.docker.com/get-docker/).
:::
Once Docker is running, start Kestra with a single command. (*If you are using Windows, make sure to use [WSL](https://docs.docker.com/desktop/wsl/).*):

```bash
docker run --pull=always -it -p 8080:8080 --user=root \
  --name kestra --restart=always \
  -v kestra_data:/app/storage \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  kestra/kestra:latest server local
```

If you re-run the command and Docker reports `You have to remove (or rename) that container to be able to reuse that name.`, remove the old container with `docker rm -f kestra` or pick a different `--name`.

Open `http://localhost:8080` in your browser to launch the UI, create your user, and take the product tour to begin building your first flow.

:::alert{type="info"}
The above command starts Kestra with an embedded H2 database stored on the `kestra_data` Docker volume. For production-ready persistence with PostgreSQL and more configurability, follow the [Docker Compose installation](../02.installation/03.docker-compose/index.md).
:::

---

## Next steps

Congratulations! You have installed Kestra and executed your first flow.

Next, you can follow the documentation in this order:
- Check out the [tutorial](../03.tutorial/index.mdx) to get introduced to concepts and workflow components.
- Follow the full [installation guide](../02.installation/index.mdx) for persistent local or distributed setups.
- Explore the available [Plugins](/plugins) to integrate with external systems, and begin orchestrating your applications, microservices, and processes.
- [Contribute to Kestra](../04.contribute-to-kestra/index.mdx) – whether a developer or not, we value outside contribution of all kinds: Plugins, Features, Documentation, Feature Requests, and Bug Reports. Get involved!
