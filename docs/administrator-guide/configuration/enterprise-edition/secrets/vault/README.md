# Vault configuration

The integration will store secrets in the vault [KV Secrets Engine - Version 2](https://www.vaultproject.io/docs/secrets/kv/kv-v2). Kestra authentications must have  full [read & write policies](https://www.vaultproject.io/docs/concepts/policies) on this secrets store. You can optionally change `root-engine` or `namespace` (if you are using Vault Enterprise).


## Authentication
### Password authentification

We can use a [Userpass Auth Method](https://www.vaultproject.io/docs/auth/userpass) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      password:
        user: john
        password: foo
```

### Token authentification
We can use a [Token Auth Method](https://www.vaultproject.io/docs/auth/token) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      token:
        token: your-secret-token
```

### AppRole authentification
We can use an [AppRole Auth Method](https://www.vaultproject.io/docs/auth/approle) using the following configuration:

```yaml
kestra:
  secret:
    type: vault
    vault:
      address: "http://localhostt:8200"
      app-role:
        path: approle
        role-id: your-role-id
        secret-id: your-secret-id
```

## Others configurations

### `kestra.secret.vault.address`
The fully qualified address with scheme & port to your vault instance.

### `kestra.secret.vault.namespace`
Optional. Sets a global namespace to the Vault server instance. Namespace support requires [Vault Enterprise Pro](https://learn.hashicorp.com/vault/operations/namespaces)

### `kestra.secret.vault.engine-version`
Optional. Sets the KV Secrets Engine version of the Vault server instance. Default is `2`

### `kestra.secret.vault.root-engine`
Optional. Sets the KV Secrets Engine of the Vault server instance. Default is `secret`

