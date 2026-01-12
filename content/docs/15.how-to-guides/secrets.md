---
title: Configure Secrets
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

Learn how to securely configure and use secrets in Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What are secrets

Secrets are sensitive values that should not be exposed in plain text, such as passwords, API tokens, access keys, or other confidential information.  
For a detailed overview, see the [Secrets](../06.concepts/04.secret.md) documentation.

This guide demonstrates how to add secrets to your Kestra server using an environment file (`.env`).  
If you prefer a simpler, UI-based experience, check out the [Enterprise Edition](../oss-vs-paid.md), which allows managing secrets per namespace directly from the web interface — without modifying server configuration files.

---

## Using secrets in Kestra

### Step 1: Create a `.env` file

Start by defining your secrets in a standard environment file:

```
POSTGRES_PASSWORD=actual_postgres_password
OPENAI_KEY=actual_openai_key
AWS_ACCESS_KEY=actual_aws_access_key
AWS_SECRET_KEY=actual_aws_secret_key
```

### Step 2: Encode and prefix your secrets

Kestra expects all secret keys to be **prefixed with `SECRET_`** and their values **base64-encoded**.  
The resulting `.env_encoded` file should look like this:

```
SECRET_POSTGRES_PASSWORD=base64_encoded_postgres_password
SECRET_OPENAI_KEY=base64_encoded_openai_key
SECRET_AWS_ACCESS_KEY=base64_encoded_aws_access_key
SECRET_AWS_SECRET_KEY=base64_encoded_aws_secret_key
```

To generate this file automatically, use the following Bash script:

```bash
while IFS='=' read -r key value; do
    echo "SECRET_$key=$(echo -n "$value" | base64)";
done < .env > .env_encoded
```

This script:
1. Base64-encodes all values.
2. Adds the `SECRET_` prefix to all variable names.
3. Saves the result as `.env_encoded`.

You can verify the output by opening `.env_encoded` — it should look like the example above.

Alternatively, you can manually write the file using macros to encode secrets dynamically:

```
SECRET_POSTGRES_PASSWORD={{ "actual_postgres_password" | base64encode }}
SECRET_OPENAI_KEY={{ "actual_openai_key" | base64encode }}
SECRET_AWS_ACCESS_KEY={{ "actual_aws_access_key" | base64encode }}
SECRET_AWS_SECRET_KEY={{ "actual_aws_secret_key" | base64encode }}
```

---

### Step 3: Point Docker to the encoded file

Update your `docker-compose.yaml` to use the `.env_encoded` file:

```yaml
kestra:
  image: kestra/kestra:latest
  env_file:
    - .env_encoded
```

This ensures your secrets are loaded when Kestra starts.

---

### Step 4: Use secrets in a flow

Once your secrets are loaded, reference them in your flows using the `secret()` function — **without** including the `SECRET_` prefix.

For example, this flow connects to PostgreSQL using `SECRET_POSTGRES_PASSWORD` and uploads query results to AWS S3 using `SECRET_AWS_ACCESS_KEY` and `SECRET_AWS_SECRET_KEY`.

```yaml
id: postgres_to_s3
namespace: company.team

tasks:
  - id: fetch
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: jdbc:postgresql://127.0.0.1:56982/
    username: pg_user
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: select id, first_name, last_name, city from users
    fetchType: STORE

  - id: write_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY') }}"
    region: "eu-central-1"
    from: "{{ outputs.fetch.uri }}"
    bucket: "kestra-bucket"
    key: "data/users.csv"
```

---

### How secrets are resolved

When you reference a secret using `{{ secret('POSTGRES_PASSWORD') }}`, Kestra automatically:
1. Finds the corresponding environment variable (e.g., `SECRET_POSTGRES_PASSWORD`).
2. Base64-decodes its value.
3. Injects it securely into the execution context.

This ensures your sensitive data stays encrypted at rest and never appears in logs or flow definitions.
