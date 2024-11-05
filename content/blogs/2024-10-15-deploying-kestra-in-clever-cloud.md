---
title: Deploying Kestra in Clever Cloud
description: How to deploy Kestra in Clever Cloud Platform as a Service.
date: 2024-10-15T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  role: Lead Software Engineer
  image: lmathieu
image: /blogs/2024-10-15-deploying-kestra-in-clever-cloud.jpg
---

[Clever Cloud](https://www.clever-cloud.com/) is a Platform as a Service provider that uses Kestra itself.
As they have deployed Kestra in Clever Cloud, I was wondering how easy it is to yourself, moreover I personally know some of the Clever Cloud developers and wanted to test their product for a long time ... so let's do it!

To deploy Kestra on Clever Cloud we used their CLI tool: [Clever Tools](https://www.npmjs.com/package/clever-tools)

**Prerequisite**: you need a Clever Cloud account and the `clevercloud` CLI installed on your machine, see the [Clever Cloud quickstart](https://developers.clever-cloud.com/doc/quickstart/) for setup instructions.

## Architecture design

Clever Cloud offers managed S3 compatible object storages (Cellar), managed PostgreSQL databases, and managed Docker applications. We will use these three services to deploy Kestra.

![Architecture](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/archi.png)

## Creating a Docker image

Clever Cloud has a code-first approach, you deploy an application into Clever Cloud by pushing to a Git branch.

As Kestra is published as a Docker container, we will deploy it as a Docker application.
So the first thing is to create a Git repository and add a Dockerfile into it.

I'm using this Dockerfile to launch the latest version of Kestra in standalone mode (all-in-one server mode):

```dockerfile
FROM kestra/kestra:latest

CMD ["server", "standalone"]
```

## Creating a Docker application

On the Clever Cloud console, click on **CREATE**, select **an application**, **Create a brand new app**, then select **Docker**.

By default, Clever Cloud selects the **XS** instance type with 1 CPU and 1 GB of RAM. As we will start Kestra in an all-in-one process (the standalone server), it's better to choose the **S** instance type with 2 CPU and 2GB of RAM. So click on **Edit** and select **S**.

![Step 1 - Docker](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-1-docker.png)

Select **NEXT**, then set the application name and the location. Here we will name our application `kestra-clever` and deploy it in the France region.

![Step 2 - Docker](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-2-docker.png)

Once you select **Finish**, you'll arrive to the add-ons page. We will create these later so we can select **I don't need any add-ons**.

Now that we have finished the application setup, we can now configure environment variables. This is the most tricky part as you will need to configure these properly so Clever Cloud and Kestra to work together.

We will add the following environment variables:

- `CC_HEALTH_CHECK_PATH` to the `/ping` URI so Clever Cloud health check uses the lightweight ping endpoint.
- `KESTRA_CONFIGURATION` to the Kestra [configuration](../docs/configuration/index.md) YAML file.

Here is the configuration file that we will use:

```yaml
datasources:
  # Configure Postgres with the env vars from the add-on <1>
  postgres:
    url: jdbc:postgresql://${POSTGRESQL_ADDON_HOST}:${POSTGRESQL_ADDON_PORT}/${POSTGRESQL_ADDON_DB}
    driverClassName: org.postgresql.Driver
    username: ${POSTGRESQL_ADDON_USER}
    password: ${POSTGRESQL_ADDON_PASSWORD}
kestra:
  server:
    # Configure basic auth as Kestra will be publicly available <2>
    basicAuth:
      enabled: true
      username: user@domain.com
      password: supersecretpassword
  repository:
    type: postgres
  # Configure MinIO storage with the env vars from the add-on <3>
  storage:
    type: minio
    minio:
      endpoint: https://${CELLAR_ADDON_HOST}
      port: 80
      accessKey: ${CELLAR_ADDON_KEY_ID}
      secretKey:  ${CELLAR_ADDON_KEY_SECRET}
      region: US
      bucket: kestra-internal-storage
  queue:
    type: postgres
  tasks:
     tmpDir:
      path: /tmp/kestra-wd/tmp
  # Setup the URL to the CleverCloud host <4>
  url: ${APP_ID}.cleverapps.io
  # As the Docker engine is not accessible, configure globally the Process runner for all plugins <5>
  plugins:
    defaults:
      - type: io.kestra.plugin.scripts
        values:
          taskRunner:
            type: io.kestra.plugin.core.runner.Process
```

1. We configure Kestra to use PostgreSQL as its backend by using the environment variables injected from the add-on (more on this later).
2. The application will be available publicly, so we set a user and password. I strongly recommend you to do the same.
3. We configure Kestra to use the MinIO storage by using the environment variables injected from the add-on. The MinIO storage works with all S3 compatible storage including Cellar.
4. We set the URL of Kestra to the URL of the application, by default, this will be `${APP_ID}.cleverapps.io` where `APP_ID` is an environment variable injected by Clever Cloud with the identifier of your application.
5. As the Docker engine is not accessible from the Kestra container, we configure globally the `Process` [task runner](../docs/task-runners/index.md) for all plugins using [Plugins Default](../docs/04.workflow-components/09.plugin-defaults.md).

![Step 3 - Docker](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-3-docker.png)

Remember to select **UPDATE CHANGES** before selecting **NEXT** to save your changes. You will arrive at a page which explains how to deploy a Docker application via git push. Follow the instructions on this page and push your Git branch to Clever Cloud.

![Step 4 - Docker](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-4-docker.png)

After a few seconds, the console will detect the push and switch to the logs of the deployment. As we're missing the necessary services, you can abort the deployment.

![Step 5 - Docker](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-5-docker.png)

## Creating a Cellar bucket

On the Clever Cloud console, select **CREATE**, then select **an add-on** then pick **Cellar S3 storage**.

![Step 6 - Cellar](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-6-cellar.png)

There is only one plan available, so select **NEXT**, then select **LINK** in front of the `kestra-clever` to link the add-on to the application. Linking the add-on will inject environment variables to the linked application with the connection URL and credentials so it can be easily configured without needed to hardcode them. This is a very nice feature 😉.

![Step 7 - Cellar](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-7-cellar.png)

Select **NEXT**, then fill in the name of the Cellar bucket and change the location if required. In our example, we created a bucket named `kestra-clever` in the Paris region.

![Step 8 - Cellar](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-8-cellar.png)

After that, the console will display the Key ID and Key Secret to connect to the bucket, we will need them later, but you don't need to copy them as we link the service to the application, so they will be injected.

## Creating a Postgres Database

On the Clever Cloud console, select **CREATE**, and **an add-on** then pick **PostgreSQL**.

![Step 9 - PostgreSQL](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-9-postgres.png)

Select your plan, here I select **XXS Small Space** as it's a demo environment, but for a production environment you may choose a plan with more capacity. Select **NEXT**, then select **LINK** in front of the `kestra-clever` to link the add-on to the application.

![Step 10 - PostgreSQL](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-10-postgres.png)

Select **NEXT**, then fill in the name of the PostgreSQL instance and change the version and location if required. In our example, we created a PostgreSQL v15 instance named `kestra-clever` in the Paris region.

![Step 11 - PostgreSQL](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-11-postgres.png)

Next, the console asks if encryption at rest should be enabled, the default is disabled, depending on your security needs you may want to enable it. Click on **Confirm Options**.

![Step 12 - PostgreSQL](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-12-postgres.png)

After that, the console will display the Host name, database name and authentication information to connect to PostgreSQL, we will need them later, but you don't need to copy them as we link the service to the application, so they will be injected.

## Starting Kestra

Now that everything has been created, go to your `kestra-clever` application and select **START**.

While the application is starting, you can go to the **Environment variables** page to see if the variables from the Cellar and PostgreSQL add-ons are correctly injected.

You can also go to the **Logs** page to see the deployment logs and the Kestra server logs. When Kestra is successfully started, you will see a log like the following:

```
2024-09-18 14:17:52,678 INFO  standalone   io.kestra.cli.AbstractCommand Server Running: http://453ec0e8-093f-44df-bb00-c682573bc61f:8080, Management server on port http://453ec0e8-093f-44df-bb00-c682573bc61f:8081/health
```

![Step 13 - Kestra](/blogs/2024-10-15-deploying-kestra-in-clever-cloud/clever-cloud-step-13-kestra.png)

Select the link in the top right corner, Kestra should open in a new browser with a login popup!

Try deploying Kestra to Clever Cloud today and let us know what you think!

- If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
- If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).

You can also read more about the Clever Cloud journey to [offload billions of metrics datapoints each month with Kestra](https://www.clever-cloud.com/blog/engineering/2024/04/04/metrics-offloading-billions-of-datapoints-each-month/).