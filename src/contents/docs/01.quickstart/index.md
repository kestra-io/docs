---
title: Kestra Quickstart Guide – Run Your First Workflow
sidebarTitle: Quickstart
icon: /src/contents/docs/icons/quickstart.svg
description: Get started with Kestra in minutes by launching Kestra locally with Docker and running your first workflow.
---

Launch Kestra locally, create a simple flow, and run your first execution in a few minutes.

## Run your first Kestra Workflow with Docker

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/3gS3-mu9GvU?si=ox_KahyFm9dSGJGG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Start Kestra

:::alert{type="info"}
**Prerequisite**: Make sure Docker is installed in your environment. We recommend [Docker Desktop](https://docs.docker.com/get-docker/).
:::
Once Docker is running, start Kestra with a single command. If you are using Windows, make sure to use [WSL](https://docs.docker.com/desktop/wsl/):

```bash
docker run --pull=always -it -p 8080:8080 --user=root \
  --name kestra --restart=always \
  -v kestra_data:/app/storage \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  kestra/kestra:latest server local
```

If you re-run the command and Docker reports `You have to remove (or rename) that container to be able to reuse that name.`, remove the old container with `docker rm -f kestra` or pick a different `--name`.

:::collapse{title="This command does the following:"}
- starts Kestra on port `8080`
- stores local files in the `kestra_data` Docker volume
- mounts `/tmp` and the Docker socket so script and container tasks can run locally
:::

Open `http://localhost:8080` in your browser to launch the UI, create your user, and take the product tour to begin building your first flow.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/Vzkk6nAJSdkaXvGDSdBC?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Welcome to Kestra | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

<br />

:::alert{type="info"}
The above command starts Kestra with an embedded H2 database that does not persist data. Storage files are stored on the `kestra_data` Docker volume. For production-ready persistence with a PostgreSQL database and more configurability, follow the [Docker Compose installation](../02.installation/03.docker-compose/index.md).
:::

---

## Next steps

Congrats! You've take the product tour, executed your first flow, and familiarized yourself with Kestra. Next, you can follow the documentation in this order to build on what you've learned so far:

- Continue with a [Tutorial](../03.tutorial/index.mdx) to add inputs, outputs, triggers, and more task types.
- Follow the full [Installation guide](../02.installation/index.mdx) for persistent local or distributed setups.
- Explore the available [Plugins](/plugins) to integrate with external systems, and begin orchestrating your applications, microservices, and processes.
- [Contribute to Kestra](../04.contribute-to-kestra/index.mdx) – whether a developer or not, we value outside contribution of all kinds: Plugins, Features, Documentation, Feature Requests, and Bug Reports. Get involved!
