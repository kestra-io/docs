:::alert{type="info"}
For flows managed through CI/CD, GitOps, or infrastructure as code, add the [`system.readOnly`](/docs/concepts/system-labels#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::
