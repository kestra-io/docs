---
title: Configure Local Ceph Storage for Kestra via MinIO Gateway
icon: /docs/icons/ceph.svg
stage: Intermediate
topics:
- DevOps
- Object Storage
---

This guide demonstrates how to deploy a local Ceph cluster using [`cephadm`](https://docs.ceph.com/en/latest/cephadm/) and expose a S3-compatible endpoint (Rados Gateway).
MinIO will act as a gateway to Ceph, and Kestra will continue to use MinIO as its object storage.

---

:::alert{type="warning"}
This guide is intended for **local testing only**. It sets up a single-node Ceph cluster using `cephadm` and exposes it via MinIO in gateway mode. This configuration is **not suitable for production** use.
:::

## Install `cephadm`

Install `cephadm` and dependencies:

```sh
curl --silent --remote-name https://download.ceph.com/keys/release.asc
gpg --no-default-keyring --keyring ./ceph-release.gpg --import release.asc
sudo apt update
sudo apt install cephadm
```

Verify installation:

```sh
cephadm version
```

🔗 [Full installation reference](https://docs.ceph.com/en/latest/cephadm/install/#installing-cephadm)

---

## Enable SSH locally

`cephadm` uses SSH to manage hosts, even in local single-node setups. Make sure `sshd` is running:

```sh
sudo apt install openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
```

Test the connection:

```sh
ssh root@localhost
```

---

## Bootstrap the Ceph Cluster

Use `--mon-ip 127.0.0.1` and skip network autodetection:

```sh
sudo cephadm bootstrap --mon-ip 127.0.0.1 --skip-mon-network
```

This sets up:

- MON, MGR
- SSH key for managing the host
- Admin keyring

---

### 📋 Check Ceph status

```sh
sudo cephadm shell -- ceph -s
```

> The `ceph` CLI is only available inside the `cephadm` shell.

---

## Enable Rados Gateway (S3 endpoint)

Ceph RGW provides a fully compatible S3 interface.

First, find your actual hostname:

```sh
hostname
```

Then deploy RGW on that hostname (e.g., `kestra`):

```sh
sudo cephadm shell -- ceph orch apply rgw default kestra
```

:::alert{type="warning"}
The second argument **must match your system's hostname**. Using `default` or a wrong name will result in an `Unknown hosts` error.
:::

Verify RGW is running:

```sh
sudo cephadm shell -- ceph orch ps
```

Look for a line like:

```
rgw.default.kestra.xxxxxx  kestra  *:80  running (...)
```

Confirm RGW is listening:

```sh
ss -tuln | grep ':80'
```

---

## Create a Ceph S3 User

Generate credentials for MinIO to use:

```sh
sudo cephadm shell -- radosgw-admin user create --uid="demo" --display-name="Demo User"
```

Copy the `access_key` and `secret_key` from the output.

---

## Connect MinIO to Ceph (Gateway Mode)

We'll configure MinIO to proxy all S3 requests to Ceph RGW.

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  minio:
    image: minio/minio:latest
    container_name: minio-ceph-gateway
    command: gateway s3 http://host.docker.internal:80
    environment:
      MINIO_ROOT_USER: ABCDEF1234567890
      MINIO_ROOT_PASSWORD: abc/xyz890foobar==
    ports:
      - "9000:9000"
    restart: always
```

> Replace `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` with the credentials from the RGW user you just created.

---

## Validate with MinIO Client

```sh
mc alias set ceph http://localhost:9000 ABCDEF1234567890 abc/xyz890foobar==
mc mb ceph/kestra-bucket
mc ls ceph
```

---

## Use in Kestra (no changes)

Your existing `application-psql.yml` remains valid:

```yaml
storage:
  type: minio
  minio:
    endpoint: localhost
    port: 9000
    bucket: kestra-bucket
    access-key: ABCDEF1234567890
    secret-key: abc/xyz890foobar==
```

Kestra will talk to MinIO as usual, and MinIO will write to Ceph transparently.

---

## Test with a Flow

```yaml
id: ceph_test_flow
namespace: company.team

tasks:
  - id: py_outputs
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      containerImage: ghcr.io/kestra-io/pydata:latest
    outputFiles:
      - ceph-output.json
    script: |
      import json
      from kestra import Kestra
      data = {'message': 'stored in Ceph'}
      Kestra.outputs(data)
      with open('ceph-output.json', 'w') as f:
          json.dump(data, f)
```

Validate the output:

```sh
mc cat ceph/kestra-bucket/main/company/team/ceph_test_flow/...
```

Expected:

```json
{"message": "stored in Ceph"}%
```

---

## Cleanup a Broken Cluster

If the bootstrap process fails and the cluster is partially created, you can remove it with:

```sh
sudo cephadm rm-cluster --force --zap-osds --fsid <fsid>
```

📚 Docs: [Purging a cluster](https://docs.ceph.com/en/latest/cephadm/operations/#purging-a-cluster)

---

## References

- 🧰 [cephadm Install Guide](https://docs.ceph.com/en/latest/cephadm/install/)
- 🔐 [RGW User Management](https://docs.ceph.com/en/latest/radosgw/admin/#user-management)
- 🎯 [MinIO Gateway S3](https://docs.min.io/docs/minio-gateway-for-s3.html)

---

You now have a local Ceph cluster backing MinIO for object storage, and Kestra continues to function without any change in configuration.
