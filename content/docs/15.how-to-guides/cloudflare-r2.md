---
title: Use Cloudflare R2 with MinIO Gateway for Kestra
icon: /docs/icons/cloudflare.svg
stage: Intermediate
topics:
- DevOps
- Object Storage
---

This guide demonstrates how to use **Cloudflare R2** as an object storage backend through an S3-compatible interface, exposed to **Kestra** via a **MinIO Gateway**.
This setup enables Kestra to continue using S3 storage without requiring configuration changes.

---

:::alert{type="warning"}
This guide assumes that **MinIO runs locally in gateway mode** to access Cloudflare R2. It is intended for **local development and QA environments**, and is **not optimized for production deployments**.
:::

## Create an R2 Bucket

Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) and create a new R2 bucket:

1. Navigate to **R2 → Create Bucket**
2. Choose a name like `kestra-bucket`

---

## Generate Access Keys

Go to **API Tokens → R2 Keys** and create a new key pair:

- `access_key_id`: Your user access key
- `secret_access_key`: Your secret key

Be sure to save these credentials securely.

---

## Retrieve the R2 Endpoint

Cloudflare R2 provides a static S3-compatible endpoint:

```
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Replace `<ACCOUNT_ID>` with your Cloudflare account ID, found in the R2 dashboard.

---

## Set Up MinIO Gateway to R2

MinIO will act as a gateway, forwarding all S3 traffic to Cloudflare R2.

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  minio:
    image: minio/minio:latest
    container_name: minio-r2-gateway
    command: gateway s3 https://<ACCOUNT_ID>.r2.cloudflarestorage.com
    environment:
      MINIO_ROOT_USER: <R2_ACCESS_KEY>
      MINIO_ROOT_PASSWORD: <R2_SECRET_KEY>
    ports:
      - "9000:9000"
    restart: always
```

> Replace `<ACCOUNT_ID>`, `<R2_ACCESS_KEY>`, and `<R2_SECRET_KEY>` with your actual Cloudflare and access values.

---

## Validate Setup with MinIO Client

Install the [MinIO Client (mc)](https://min.io/docs/minio/linux/reference/minio-mc.html):

```sh
mc alias set r2 http://localhost:9000 <R2_ACCESS_KEY> <R2_SECRET_KEY>
mc mb r2/kestra-bucket
mc ls r2
```

---

## Configure Kestra (No Changes Required)

Since Kestra supports MinIO-compatible S3 endpoints, no changes to your configuration are required:

```yaml
storage:
  type: minio
  minio:
    endpoint: localhost
    port: 9000
    bucket: kestra-bucket
    access-key: <R2_ACCESS_KEY>
    secret-key: <R2_SECRET_KEY>
```

Kestra will interact with MinIO, which in turn proxies to R2.

---

## Test with a Flow

```yaml
id: r2_test_flow
namespace: company.team

tasks:
  - id: write_output
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      containerImage: ghcr.io/kestra-io/pydata:latest
    outputFiles:
      - r2-output.json
    script: |
      import json
      from kestra import Kestra
      data = {'message': 'stored in R2'}
      Kestra.outputs(data)
      with open('r2-output.json', 'w') as f:
          json.dump(data, f)
```

Then, verify the file was stored correctly using:

```sh
mc cat r2/kestra-bucket/main/company/team/r2_test_flow/...
```

Expected output:

```json
{"message": "stored in R2"}%
```

---

## References

- 🌩️ [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- 🔐 [R2 Access Keys](https://developers.cloudflare.com/api/)
- 🧰 [MinIO Gateway for S3](https://min.io/docs/minio/linux/gateway/s3.html)

---

You now have Cloudflare R2 configured as your object storage backend for Kestra, fully integrated via MinIO Gateway.
