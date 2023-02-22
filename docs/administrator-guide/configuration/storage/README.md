---
order: 2
---

# Storage configuration

Kestra needs an [internal storage](../../../architecture#storage) to store data processed by flow tasks (files from flow inputs and data stored as task outputs).

The default internal storage is the local storage which is **not suitable for production** as it will store data inside a local folder on the host filesystem.

Other internal storage types are:
- [Storage GCS](#gcs) for [Google Cloud Storage](https://cloud.google.com/storage)
- [Storage Minio](#minio) compatible with [AWS S3](https://aws.amazon.com/s3/) and all others *S3 like* storage
- [Storage Azure](#azure) for [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)

## GCS
First, you need to be sure to have the GCS storage plugin installed. You can install it with the following Kestra command:
`./kestra plugins install io.kestra.storage:storage-gcs:LATEST`, it will download the plugin jar in the Kestra plugins directory.

Then, you need to enable the storage with this configuration:

```yaml

kestra:
  storage:
    type: gcs
    gcs:
      bucket: "<your-bucket-name>"
      service-account: "<service-account key as JSON or use default credentials>"
      project-id: "<project-id or use default projectId>"
```

If you didn't configure the `kestra.storage.gcs.service-account` option, Kestra will use the default service account, meaning that it will:
- use the service account defined on the cluster for GKE.
- use the service account defined on the compute instance for GCE.

You can also provide the environment variable `GOOGLE_APPLICATION_CREDENTIALS` with a path to a JSON GCP service account key.

More details can be found [here](https://cloud.google.com/docs/authentication/production).

## Minio

First, you need to be sure to have the Minio storage plugin installed. You can install it with the following Kestra command:
`./kestra plugins install io.kestra.storage:storage-minio:LATEST`, it will download the plugin jar in the Kestra plugins directory.

Then, you need to enable the storage with this configuration:

```yaml

kestra:
  storage:
    type: minio
    minio:
      endpoint: "<your-endpoint>"
      port: "<your-port>"
      accessKey: "<your-accessKey>"
      secretKey: "<your-secretKey>"
      region: "<your-region>"
      secure: "<your-secure>"
      bucket: "<your-bucket>"
```

## Azure

First, you need to be sure to have the Azure storage plugin installed. You can install it with the following Kestra command:
`./kestra plugins install io.kestra.storage:storage-azure:LATEST`, it will download the plugin jar in the Kestra plugins directory.

Then, you need to enable the storage with this configuration (adapt depending on authentication method):

```yaml

kestra:
  storage:
    type: azure
    azure:
      endpoint: "https://unittestkt.blob.core.windows.net"
      container: storage
      connection-string: "<connection-string>"
      shared-key-account-name: "<shared-key-account-name>"
      shared-key-account-access-key: "<shared-key-account-access-key>"
      sas-token: "<sas-token>"
```
