---
title: Quickstart
icon: /docs/icons/quickstart.svg
---

Start Kestra in a Docker container, and create your first flow.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/3gS3-mu9GvU?si=ox_KahyFm9dSGJGG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Start Kestra

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/kSGf8FZf7-Q?si=iMfRzj-6XB8GpRx1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

:::alert{type="info"}
**Prerequisite**: Make sure Docker is installed in your environment. We recommend [Docker Desktop](https://docs.docker.com/get-docker/).
:::
Once Docker is running, start Kestra with a single command. (*If you are using Windows, make sure to use [WSL](https://docs.docker.com/desktop/wsl/).*):

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp kestra/kestra:latest server local
```


:::collapse{title="macOS troubleshooting"}
If you're on macOS, you may need to add `-e JAVA_OPTS="-XX:UseSVE=0"`

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp -e JAVA_OPTS="-XX:UseSVE=0" kestra/kestra:latest server local
```
:::

Open `http://localhost:8080` in your browser to launch the UI and begin building your first flow.

:::alert{type="info"}
The above command starts Kestra with an embedded H2 database that will not persist data. If you want to use a persistent database backend with PostgreSQL and more configurability, follow the [Docker Compose installation](../02.installation/03.docker-compose.md).
:::

---

## Create your user

Once you open Kestra in your browser, Kestra will prompt you to create your user. Once created, you will be able to build your first flow.

![login](/docs/getting-started/login.png)

---

## Create your first flow

Navigate to **Flows** in the left menu, then click the **Create** button and paste the following configuration into the editor to create your first flow:

```yaml
id: getting_started
namespace: company.team

tasks:
  - id: hello_world
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
```

This flow uses the [Kestra Log plugin](/plugins/core/tasks/log/io.kestra.plugin.core.log.log) to log a message to the console. Click **Save**, then click **Execute** to start your first execution.

## Next steps

Congratulations! You have installed Kestra and executed your first flow.

Next, you can follow the documentation in this order:
- Check out the [tutorial](../03.tutorial/index.md).
- Get to know the [building blocks](../05.workflow-components/index.md) of a flow.
- Learn the core [concepts](../06.concepts/index.md).
- Explore the available [Plugins](/plugins) to integrate with external systems, and begin orchestrating your applications, microservices, and processes.
- [Deploy](../10.administrator-guide/index.md) Kestra to remote development and production environments.
- Almost everything is configurable in Kestra. You can find the different configuration options available to Administrators in the [Configuration Guide](../configuration/index.md).
