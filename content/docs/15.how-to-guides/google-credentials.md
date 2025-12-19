---
title: Configure Google Service Account
icon: /docs/icons/gcp-compute.svg
stage: Getting Started
topics:
  - Integrations
  - Best Practices
---

Setup a Google Service Account inside of Kestra.

When you're using Google Cloud (and for some Google Workspace apps), you're going to need to authenticate inside of Kestra. The best way to do this is by using a Service Account. However, there's a few ways you can set this up. This guide will walk you through the best way to get your service account working correctly inside of Kestra.

## Create Service Account inside of Google Cloud

Inside of Google Cloud, head to `IAM` and then `Service Accounts`. In here you can add the specific roles to the service account before creating it (this will depend on your use case).

Once you've done that, you can go to `Keys` and click on `Add Key`. From the dropdown, select `Create New Key`. Select the Key type as `JSON` and click on `Create`. Download this as we'll need this in a second.

For more information on Google Cloud Service Accounts, check out the [documentation](https://cloud.google.com/iam/docs/service-account-overview).

## Configuring a task with a Service Account

Inside of Kestra, you can paste the service account JSON directly to the task property. This is useful for testing purposes:

```yaml
- id: upload
  type: io.kestra.plugin.googleworkspace.drive.Upload
  from: "{{ inputs.file }}"
  parents:
    - "1HuxzpLt1b0111MuKMgy8wAv-m9Myc1E_"
  name: "My awesome CSV"
  contentType: "text/csv"
  mimeType: "application/vnd.google-apps.spreadsheet"
  serviceAccount: |
    {
      "type": "service_account",
      "project_id": "...",
      "private_key_id": "...",
      "private_key": "...",
      "client_email": "...",
      "client_id": "...",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "...",
      "universe_domain": "googleapis.com"
    }
```

:::alert{type="warning"}
This is not recommended as you might expose your key. We'd recommend using [secrets](#add-service-account-as-a-secret) to store your Service Account JSON.
:::

## Add Service Account as a Secret

We can add our Service Account with the `serviceAccount` property to any of our Google Cloud or Workspaces tasks. To do this, we'll need to add it as a secret to Kestra. There's a number of ways to add secrets, but we're going to add it via environment variables which will link to our Docker Compose file. If you want more information regarding how secrets work, check out the [secrets page](../06.concepts/04.secret.md).

Once you have the service account file downloaded, you can rename it to `service-account.json`. Then we'll encode the service account JSON and store it inside of a file named `.env_encoded` which will hold all of our encoded secrets:

```bash
echo SECRET_GCP_SERVICE_ACCOUNT=$(cat service-account.json | base64 -w 0) >> .env_encoded
```

If you already have an existing `.env` file, you can use the following bash script:

```bash
#!/bin/bash

ENV_FILENAME=.env_encoded

while IFS='=' read -r key value; do
  echo "SECRET_$key=$(echo -n "$value" | base64)";
done < .env > $ENV_FILENAME

# Encodes the service account file without line wrapping to make sure the whole JSON value is intact.
echo "SECRET_GCP_SERVICE_ACCOUNT=$(cat service-account.json | base64 -w 0)" >> $ENV_FILENAME
```

You can then set the `.env_encoded` file inside of your `docker-compose.yml`:

```yaml
kestra:
  env_file: .env_encoded
```

## Access Service Account inside of Kestra

You can now access this inside of Kestra with the following pebble expression:

```yaml
"{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

With this, we can add this to the `serviceAccount` property like so:

```yaml
- id: upload
  type: io.kestra.plugin.googleworkspace.drive.Upload
  from: "{{ inputs.file }}"
  parents:
    - "1HuxzpLt1b0111MuKMgy8wAv-m9Myc1E_"
  name: "My awesome CSV"
  contentType: "text/csv"
  mimeType: "application/vnd.google-apps.spreadsheet"
  serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

```yaml
- id: fetch
  type: io.kestra.plugin.gcp.bigquery.Query
  fetch: true
  sql: |
    SELECT 1 as id, "John" as name
    UNION ALL
    SELECT 2 as id, "Doe" as name
  serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

## Set the Service Account with `PluginDefaults`

If you're using multiple tasks that will require the service account secret, you can set up a Plugin Default to apply this property to all tasks of this type. For example:
```yaml
tasks:
  - id: "upload"
    type: "io.kestra.plugin.googleworkspace.drive.Upload"
    from: "{{ inputs.file }}"
    parents:
      - "1HuxzpLt1b0111MuKMgy8wAv-m9Myc1E_"
    name: "My awesome CSV"
    contentType: "text/csv"
    mimeType: "application/vnd.google-apps.spreadsheet"

pluginDefaults:
  - type: io.kestra.plugin.googleworkspace.drive.Upload
    values:
      serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

## Configuring Secrets in the Enterprise Edition

In Kestra Enterprise Edition, secrets can be managed directly from the UI meaning there's no need to encode them in base64. To learn more about this, check out the [secrets page](../06.concepts/04.secret.md#secrets-in-the-enterprise-edition).

## `GOOGLE_APPLICATION_CREDENTIALS`

By setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable on the nodes running Kestra. It must point to an application credentials file. Warning: it must be the same on all worker nodes and can cause some security concerns.

While you can use the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, this is not advised as you'll need to mount the JSON file to Docker which isn't always possible depending on how you've setup Kestra.

To set it up, you will need to make sure Kestra has access to the JSON file containing the service account details. If you're using Docker, you'll need to create a bind mount like the example below:

```yaml
kestra:
  image: kestra/kestra:latest
  pull_policy: always
  user: "root"
  command: server standalone
  volumes:
    - kestra-data:/app/storage
    - /var/run/docker.sock:/var/run/docker.sock
    - /tmp/kestra-wd:/tmp/kestra-wd
    - ~/.gcp/workflow-orchestration-credentials.json:/.gcp/credentials.json
  ...
```

The xample uses a file in the location `~/.gcp/workflow-orchestration-credentials.json` so make sure to change this to the location of your JSON file. It maps it to `/.gcp/credentials.json` inside the container, which we'll need to reference in the environment variable.

After that, add an environment variable under `environment` called `GOOGLE_APPLICATION_CREDENTIALS`

```yaml
environment:
  GOOGLE_APPLICATION_CREDENTIALS: '/.gcp/credentials.json'
  KESTRA_CONFIGURATION: |
  ...
```

:::collapse{title="Full Docker Compose with GOOGLE_APPLICATION_CREDENTIALS"}
Here is a full Docker Compose that you can use to add a service account using the environment variable `GOOGLE_APPLICATION_CREDENTIALS`:

```yaml
volumes:
  postgres-data:
    driver: local
  kestra-data:
    driver: local

services:
  postgres:
    image: postgres:18
    volumes:
      - postgres-data:/var/lib/postgresql
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s

      retries: 10

  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    user: "root"
    command: server standalone
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
      - ~/.gcp/workflow-orchestration-credentials.json:/.gcp/credentials.json
    environment:
      GOOGLE_APPLICATION_CREDENTIALS: '/.gcp/credentials.json'
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              enabled: false
              username: "admin@kestra.io" # it must be a valid email address
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              base-path: "/app/storage"
          tutorial-flows:
            enabled: false
          queue:
            type: postgres
          tasks:
            tmp-dir:
              path: /tmp/kestra-wd/tmp
          url: http://localhost:8080/
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      postgres:
        condition: service_started
```

::

## Google App Passwords

For some Google applications, like Gmail, you won't use a service account for authenticating. Instead, you'll use a normal username and password associated with a Google account. However, this doesn't work if your account has 2 factor authenication enabled. In this case, you'll need to generate an **App Password**. You can do this by going to **Manage your Google Account**, then go to **Security**. Select the **App Passwords** option and you'll be able to Generate a new one. This can be used where you'd put your normal password to connect it to Kestra.

:::alert{type="info"}
If your account is associated with Google Workspaces, you might need your Administrator to enable App Passwords in the Admin Console.
::::
