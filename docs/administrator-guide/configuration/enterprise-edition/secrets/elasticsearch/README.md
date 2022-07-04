# Elasticsearch configuration

The integration will store secrets in ElasticSearch. Since ElasticSearch is not a secured secret store, kestra will store the password using [AES encryption,](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), and you will need to provide a secret key in order to encrypt and decrypt secret stored inside elasticsearch. The secret key must be at least a 32 characters password.

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "wvgeQ(!]p[5^/{')pEs;xcm.LXwAxbyJ"
```

