:::alert{type="info"}
**Enterprise Edition images** — log in to the private registry with your license credentials before pulling images:

```bash
docker login registry.kestra.io --username $LICENSEID --password $FINGERPRINT
```

Use `registry.kestra.io/docker/kestra-ee:latest` for the newest image, or pin a specific version such as `registry.kestra.io/docker/kestra-ee:v1.0`. See the [Enterprise documentation](/docs/enterprise) and [configuration requirements](/docs/enterprise/instance) for additional setup guidance.
Compare editions in [Open Source vs Enterprise](/docs/oss-vs-paid) if you are deciding between versions.
:::
