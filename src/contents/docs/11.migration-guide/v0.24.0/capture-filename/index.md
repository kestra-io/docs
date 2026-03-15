---
title: Capture filename on input type FILE
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS", "EE"]
description: Information on the requirement to use part name and filename for uploading FILE-type inputs via API in Kestra 0.24.0.
---


## Capture filename on input type FILE

To upload a file for an input of type `FILE`, you should now use the part **name** for the input and the part **filename** attribute for the file name.

For example, when using `cURL` to start an execution for the following flow:

```yaml
id: file_flow
namespace: company.team

inputs:
  - id: fileInput
    type: FILE

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{inputs.fileInput}}"
```

**Before 0.24 - now deprecated**

```bash
curl -v "http://localhost:8080/api/v1/executions/company.team/file_flow" \
    -H "Content-Type:multipart/form-data"    \
    -F "files=@/tmp/test.txt;filename=fileInput"
```

**Since 0.24**

```bash
curl -v "http://localhost:8080/api/v1/executions/company.team/file_flow" \
    -H "Content-Type:multipart/form-data" \
    -F "fileInput=@/tmp/test.txt;filename=test.txt"
```
