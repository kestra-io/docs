---
order: 2
---
# ElasticSearch configuration
Most important configuration is to configure the way Kestra connect to ElasticSearch cluster.

Here is a minimal configuration example :
```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: http://localhost:9200
  repository:
    type: elasticsearch
```

Here is another example with a secure ElasticSearch cluster with basic auth 

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      basic-auth:
        username: "<your-user>"
        password: "<your-password>"
```
