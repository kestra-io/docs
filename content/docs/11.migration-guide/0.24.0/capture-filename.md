---
title: Capture filename on input type FILE
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS", "EE"]
---

## Breaking Change

To upload a file for an input of type `FILE`, you should now use the part **name** for the input and the part **filename** attribute for the file name.

For example, when using `cURL` to start an execution for the following flow:

```yaml
id: file
namespace: company.team

inputs:
  - id: file
    type: FILE

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{inputs.file}}"
```

**Before 0.24 - now deprecated**

```bash
curl -v "http://localhost:8080/api/v1/executions/company.team/file" \
    -H "Content-Type:multipart/form-data"    \ 
    -F "files=@/tmp/test.txt;filename=file"
```

**Since 0.24**

```bash
curl -v "http://localhost:8080/api/v1/executions/company.team/file" \
    -H "Content-Type:multipart/form-data" \
    -F "file=@/tmp/test.txt;filename=test.txt"
```