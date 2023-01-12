---
order: 4
---
# Elasticsearch configuration
Another important configuration is to configure the way Kestra connects to the Elasticsearch cluster.

Here is a minimal configuration example :
```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: http://localhost:9200
  repository:
    type: elasticsearch
```

Here is another example with a secure Elasticsearch cluster with basic authentication.

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
Default `false`, if you enable this options, we trust all certificate during connection. Useful mostly for development server with self signed certificate.

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      trust-all-ssl: true
```

## `kestra.elasticsearch.defaults.indice-prefix`
This configuration allows you to change the indices prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Elasticsearch cluster for the multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  elasticsearch:
    defaults:
      topic-prefix: "uat_kestra"
```
