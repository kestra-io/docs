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

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/kSGf8FZf7-Q?si=iMfRzj-6XB8GpRx1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

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

:::collapse{title="macOS troubleshooting"}
If you're on macOS, you may need to add `-e JAVA_OPTS="-XX:UseSVE=0"`

```bash
docker run --pull=always -it -p 8080:8080 --user=root \
  --name kestra --restart=always \
  -v kestra_data:/app/storage \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  -e JAVA_OPTS="-XX:UseSVE=0" \
  kestra/kestra:latest server local
```
:::

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
- Get to know the [building blocks](../05.workflow-components/index.mdx) of a flow in more detail.
- Learn the core [concepts](../06.concepts/index.mdx) and their use cases.
- Explore the available [Plugins](/plugins) to integrate with external systems, and begin orchestrating your applications, microservices, and processes.
- [Deploy](../10.administrator-guide/index.mdx) Kestra to remote development and production environments.
- Almost everything is configurable in Kestra. You can find the different configuration options available to Administrators in the [Configuration Guide](../configuration/index.md).
- [Contribute to Kestra](../04.contribute-to-kestra/index.mdx) – whether a developer or not, we value outside contribution of all kinds: Plugins, Features, Documentation, Feature Requests, and Bug Reports. Get involved!
