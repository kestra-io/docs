---
title: Configure Secrets in Kestra
h1: Securely Store and Use Secrets in Your Flows
icon: /src/contents/docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
editions: ["OSS"]
description: Learn how to securely configure and use secrets in Kestra to protect sensitive information like passwords and API keys in your flows.
---

Configure sensitive values as base64-encoded environment variables so flows can reference them without exposing plain text in flow definitions or logs.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

For a detailed overview of how secrets work across editions, see the [Secrets concept page](../../06.concepts/04.secret/index.md). For a UI-based secrets manager with access controls and audit logs, see the [Enterprise Edition](../../oss-vs-paid/index.md).

---

## Using secrets in Kestra

### Step 1: Create a `.env` file

Start by defining your secrets in a standard environment file:

```bash
POSTGRES_PASSWORD=actual_postgres_password
OPENAI_KEY=actual_openai_key
AWS_ACCESS_KEY=actual_aws_access_key
AWS_SECRET_KEY=actual_aws_secret_key
```

### Step 2: Encode and prefix your secrets

Kestra expects all secret keys to be **prefixed with `SECRET_`** and their values **base64-encoded**.
The resulting `.env_encoded` file should look like this:

```bash
SECRET_POSTGRES_PASSWORD=base64_encoded_postgres_password
SECRET_OPENAI_KEY=base64_encoded_openai_key
SECRET_AWS_ACCESS_KEY=base64_encoded_aws_access_key
SECRET_AWS_SECRET_KEY=base64_encoded_aws_secret_key
```

To generate this file automatically, use the following Bash script:

```bash
while IFS='=' read -r key value; do
    echo "SECRET_$key=$(echo -n "$value" | openssl base64 -A)";
done < .env > .env_encoded
```

This script:
1. Base64-encodes all values.
2. Adds the `SECRET_` prefix to all variable names.
3. Saves the result as `.env_encoded`.

The script uses `openssl base64 -A` instead of plain `base64` because each encoded value must stay on a single line. On Linux, `base64` wraps output every 76 characters, so a long secret such as an API token or private key splits across several lines. Docker Compose reads only the first line of the value, and Kestra receives a truncated secret without logging an error. The `-A` flag disables wrapping, and the command works the same on Linux and macOS. To encode a single value, run:

```bash
echo -n "<SECRET>" | openssl base64 -A
```

Verify the output by opening `.env_encoded`. Each line should match the format in the example above, with one `SECRET_` variable per line.

:::alert{type="warning"}
Encode the value without a trailing newline. `echo "<SECRET>"` (without `-n`) or a `.env` file saved with Windows (CRLF) line endings adds `\n` or `\r` to the end of the value, and Kestra decodes it as part of the secret. API calls then fail with authentication or invalid header errors even though the key itself is correct. To check a value, decode it with `echo "<ENCODED>" | openssl base64 -d -A | od -c` and look for `\n` or `\r` at the end. Re-encode it with `echo -n`, or convert the `.env` file to LF line endings first. As a workaround, you can strip the whitespace in the flow with the `trim` filter: `{{ secret('OPENAI_KEY') | trim }}`.
:::

Alternatively, you can manually write the file using macros to encode secrets dynamically:

```bash
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

When you reference a secret using `{{ secret('POSTGRES_PASSWORD') }}`, Kestra finds the corresponding `SECRET_POSTGRES_PASSWORD` environment variable, base64-decodes its value, and injects it into the execution context. The decoded value does not appear in flow definitions or logs, but base64 encoding is not encryption — secure your host environment accordingly.
