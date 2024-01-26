---
title: Google Secret Manager configuration
---

This integration will store secrets in [Google Secret Manager](https://cloud.google.com/secret-manager). Kestra authentication must have [roles/secretmanager.admin](https://cloud.google.com/secret-manager/docs/access-control) permission.

## Authentication
You can authenticate the Secrets Manager with Google Cloud in multiple ways:
- By setting the `serviceAccount` property that must contain the contents of the service account JSON key file.
- By setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable on the nodes (or server) running Kestra. It must point to a JSON credentials file. Keep in mind that you'd need to use the same variable on all worker nodes and that this authentication method can cause some security concerns.
- If none is set, the default service account will be used.

```yaml
kestra:
  secret:
    type: azure-key-vault
    google-secret-manager:
      project: kestra-unit-test
      serviceAccount: 'JSON content of the service account'
```

## Other configurations

### `kestra.secret.google-secret-manager.project`
Google Cloud project ID that Kestra will use.

### `kestra.secret.google-secret-manager.prefix`
Optional. All key handled by Kestra will be prefixed with this. Can be useful to share the same secret manager between Kestra instances.