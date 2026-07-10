---
title: Ceph Storage for Kestra via MinIO S3 Gateway
h1: Set Up a Local Ceph Cluster as S3-Compatible Storage for Kestra
icon: /src/contents/docs/icons/ceph.svg
stage: Intermediate
topics:
- DevOps
- Object Storage
description: Set up a local Ceph cluster using cephadm and connect Kestra directly to the Ceph Rados Gateway S3 endpoint.
---

This guide demonstrates how to deploy a local Ceph cluster using [`cephadm`](https://docs.ceph.com/en/latest/cephadm/) and connect Kestra directly to its S3-compatible Rados Gateway (RGW) endpoint using `type: minio`.

---

:::alert{type="warning"}
This guide is intended for **local testing only**. It sets up a single-node Ceph cluster using `cephadm`. This configuration is **not suitable for production** use.
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

`cephadm` uses SSH to manage hosts, even in local single-node setups. Ensure `sshd` is running:

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

### Check Ceph status

```sh
sudo cephadm shell -- ceph -s
```

The `ceph` CLI is only available inside the `cephadm` shell.

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

```plaintext
rgw.default.kestra.xxxxxx  kestra  *:80  running (...)
```

Confirm RGW is listening:

```sh
ss -tuln | grep ':80'
```

---

## Create a Ceph S3 User

Generate credentials for Kestra to use:

```sh
sudo cephadm shell -- radosgw-admin user create --uid="kestra" --display-name="Kestra Storage"
```

Copy the `access_key` and `secret_key` from the output.

---

## Create a bucket

```sh
sudo cephadm shell -- radosgw-admin bucket create --bucket=kestra-bucket --uid=kestra
```

---

## Configure Kestra

Ceph RGW exposes a native S3-compatible endpoint. Point Kestra directly at it using `type: minio`:

```yaml
kestra:
  storage:
    type: minio
    minio:
      endpoint: localhost
      port: 80
      secure: false
      bucket: kestra-bucket
      access-key: YOUR_CEPH_ACCESS_KEY
      secret-key: YOUR_CEPH_SECRET_KEY
```

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

---

## Cleanup a Broken Cluster

If the bootstrap process fails and the cluster is partially created, you can remove it with:

```sh
sudo cephadm rm-cluster --force --zap-osds --fsid <fsid>
```

📚 Docs: [Purging a cluster](https://docs.ceph.com/en/latest/cephadm/operations/#purging-a-cluster)

---

## References

- [cephadm Install Guide](https://docs.ceph.com/en/latest/cephadm/install/)
- [RGW User Management](https://docs.ceph.com/en/latest/radosgw/admin/#user-management)
- [Kestra storage configuration](../../configuration/02.runtime-and-storage/index.md#minio--s3-compatible)
