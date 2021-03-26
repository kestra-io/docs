---
order: 3
---

# Storage configuration

Kestra need a [internal storage](../../../architecture#storage) in order to store file proceed (uploaded files & between tasks). 

The default storage is Local storage **not production ready**

Available storage are :
- [Storage GCS](#gcs) for [Google Cloud Storage](https://cloud.google.com/storage)
- [Storage Minio](#minio) compatible with [AWS S3](https://aws.amazon.com/s3/) and all others *S3 like* storage

## GCS
For you need to be sure to have the GCS storage plugins installed, you can install it with Kestra command : 
`./kestra plugins install io.kestra.storage.gcs:storage-gcs:LATEST`, it will download the plugins jar on kestra plugins directory.

After you need to enable the storage with this configuration: 

```yaml

kestra:
  storage:
    type: gcs
    gcs:
      bucket: "<your-bucket-name>"
```

Kestra will use the default service account GCP service account, meaning that :
- will use on GKE, the service account defined on the cluster 
- will use on GCE, the service account defined on the VM.
- you can provide an environment variable `GOOGLE_APPLICATION_CREDENTIALS` with a path to a json GCP service account key. 

More detail can be found [here](https://cloud.google.com/docs/authentication/production)

## Minio

For you need to be sure to have the Minio storage plugins installed, you can install it with Kestra command :
`./kestra plugins install io.kestra.storage.minio:storage-minio:LATEST`, it will download the plugins jar on kestra plugins directory.

After you need to enable the storage with this configuration:

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
