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
id: "upload"
type: "io.kestra.plugin.googleworkspace.drive.Upload"
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

::alert{type="warning"}
This is not recommended as you might expose your key. We'd recommend using [secrets](#add-service-account-as-a-secret) to store your Service Account JSON.
::

## Add Service Account as a Secret

We can add our Service Account with the `serviceAccount` property to any of our Google Cloud or Workspaces tasks. To do this, we'll need to add it as a secret to Kestra. There's a number of ways to add secrets, but we're going to add it directly to our Docker Compose file. If you want to look at alternative ways, check out the [secrets page](../05.concepts/04.secret.md).


Once you have the service account downloaded, you can encode it to base64 using the following command, where `sa.json` is your JSON file:
```bash
cat sa.json | base64
```

Once you've done that, copy and paste the response as a new environment variable, that starts with `SECRET_`, in your `docker-compose.yml`:
```yaml
kestra:
  environment:
    SECRET_GCP_SA: base64_encoded_json
```

## Add Secrets to a `.env` file

You can also add all of your secrets into a separate `.env` file and add this to your Docker Compose to keep them separate.

The script below requires you to have a `.env` file (even if it's empty) to work. This will create a `.env_encoded` file with the base64 encoded secrets inside of it.

```bash
while IFS='=' read -r key value; do
    echo "SECRET_$key=$(echo -n "$value" | base64)";
done < .env > .env_encoded

echo "SECRET_GCP_SA=$(cat sa.json | base64)" >> .env_encoded
```

You can then set the `.env_encoded` file inside of your `docker-compose.yml`:

```yaml
kestra:
  env_file: .env_encoded
```

## Access Service Account inside of Kestra

You can now access this inside of Kestra with the following pebble expression:
```yaml
"{{ secret('GCP_SA') }}"
```

With this, we can add this to the `serviceAccount` property like so:
```yaml
id: "upload"
type: "io.kestra.plugin.googleworkspace.drive.Upload"
from: "{{ inputs.file }}"
parents:
  - "1HuxzpLt1b0111MuKMgy8wAv-m9Myc1E_"
name: "My awesome CSV"
contentType: "text/csv"
mimeType: "application/vnd.google-apps.spreadsheet"
serviceAccount: "{{ secret('GCP_SA') }}"
```

```yaml
- id: fetch
  type: io.kestra.plugin.gcp.bigquery.Query
  fetch: true
  sql: |
    SELECT 1 as id, "John" as name
    UNION ALL
    SELECT 2 as id, "Doe" as name
  serviceAccount: "{{ secret('GCP_SA') }}"
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
      serviceAccount: "{{ secret('GOOGLE_SA') }}"
```

## Configuring Secrets in the Enterprise Edition

In Kestra Enterprise Edition, secrets can be managed directly from the UI meaning there's no need to encode them in base64. To learn more about this, check out the [secrets page](../05.concepts/04.secret.md#secrets-in-the-enterprise-edition).

## `GOOGLE_APPLICATION_CREDENTIALS`

While you can use the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, this is not advised as you'll need to mount the JSON file to Docker which isn't always possible depending on how you've setup Kestra.

## Google App Passwords

For some Google applications, like Gmail, you won't use a service account for authenticating. Instead, you'll use a normal username and password associated with a Google account. However, this doesn't work if your account has 2 factor authenication enabled. In this case, you'll need to generate an **App Password**. You can do this by going to **Manage your Google Account**, then go to **Security**. Select the **App Passwords** option and you'll be able to Generate a new one. This can be used where you'd put your normal password to connect it to Kestra.

::alert{type=info}
If your account is associated with Google Workspaces, you might need your Administrator to enable App Passwords in the Admin Console.
::
