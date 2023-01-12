---
order: 2
---

# Storage configuration

Kestra needs [internal storage](../../../architecture#storage) in order to store file proceeded (uploaded files & between tasks).

The default storage is the Local storage (**not production ready**).

Available storage options include:
- [Storage GCS](#gcs) for [Google Cloud Storage](https://cloud.google.com/storage)
- [Storage Minio](#minio) compatible with [AWS S3](https://aws.amazon.com/s3/) and all others *S3 like* storage
- [Storage Azure](#azure) for [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)

## GCS
First, you need to be sure to have the GCS storage plugin installed. You can install it with the following Kestra command:
`./kestra plugins install io.kestra.storage.gcs:storage-gcs:LATEST`, it will download the plugin jar in Kestra plugins directory.

Then, you need to enable the storage with this configuration:

```yaml

kestra:
  storage:
    type: gcs
    gcs:
      bucket: "<your-bucket-name>"
      service-account: "<service-account key as json or use default credentials>"
      project-id: "<project-id or use default projectId>"
```

Kestra will use the default service account 'GCP service account', meaning that it will:
- use the service account defined on the cluster for GKE.
- use the service account defined on the VM for GCE.

You can also provide the environment variable `GOOGLE_APPLICATION_CREDENTIALS` with a path to a json GCP service account key.

More details can be found [here](https://cloud.google.com/docs/authentication/production).

## Minio

First, you need to be sure to have the Minio storage plugin installed. You can install it with the following Kestra command:
`./kestra plugins install io.kestra.storage.minio:storage-minio:LATEST`, it will download the plugin jar in Kestra plugins directory.

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
`./kestra plugins install io.kestra.storage.azure:storage-azure:LATEST`, it will download the plugin jar in Kestra plugins directory.

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
