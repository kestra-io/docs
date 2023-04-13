---
title: Elasticsearch configuration
---


This integration will store secrets in Elasticsearch. Since Elasticsearch is not a secured secret store, Kestra will store the secrets using [AES encryption,](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), and you will need to provide a cryptographic key in order to encrypt and decrypt secrets stored inside Elasticsearch. The cryptographic key must be at least a 32 characters.

```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "wvgeQ(!]p[5^/{')pEs;xcm.LXwAxbyJ"
```

