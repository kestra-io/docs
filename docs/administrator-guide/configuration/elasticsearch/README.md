---
order: 4
---
# Elasticsearch configuration

**Elasticsearch is an [Enterprise Edition](https://kestra.io/features/enterprise.html) functionality.**

The most important thing is to configure the way Kestra connects to the Elasticsearch cluster.

Here is a minimal configuration example:
```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: http://localhost:9200
  repository:
    type: elasticsearch
```

Here is another example with a secured Elasticsearch cluster with basic authentication:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      basic-auth:
        username: "<your-user>"
        password: "<your-password>"
```

## `kestra.elasticsearch.client.trust-all-ssl`
Default `false`, if you enable this option, we trust all certificate during connection. Useful for development server with self-signed certificate.

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      trust-all-ssl: true
```

## `kestra.elasticsearch.defaults.indice-prefix`
This configuration allows to change the indices prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Elasticsearch cluster for multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  elasticsearch:
    defaults:
      indice-prefix: "uat_kestra"
```
