---
title: dbt with Kestra's New Editor
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
version: ">= 0.18.0"
---

Using dbt with Kestra's New Editor

In this guide, we will look in detail as to how we can use dbt by leveraging Kestra's New Editor. With this new editor, you can now make changes to the dbt models on the fly, and later, push the changes to GitHub repository.

Let us understand this with the help of an example.

Using the below flow, you can clone the GitHub repository containing the dbt code, and then upload the files to your namespace.

```yaml
id: upload_dbt_project
namespace: company.datateam.dbt
description: |
  This flow will download the latest dbt project from a Git repository
  and upload it to the Kestra instance.
  It's useful when developing your dbt code directly from the Kestra Editor.
  Later, you can use the PushNamespaceFiles task to push the changes back to Git.
tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: git_clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-example
        branch: master

      - id: upload
        type: io.kestra.plugin.core.namespace.UploadFiles
        namespace: "{{ flow.namespace }}"
        files:
          - "glob:**/dbt/**"
```

With the files being present as namespace files, you can open them with the Editor, and make changes as appropriate. 

![dbt_as_namespace_files](/docs/how-to-guides/edit-dbt-files.png)

This simplifies the process of making changes and testing them, leading to faster iterations. The final changes can be then pushed to the GitHub using [PushNamespaceFiles task](./pushnamespacefiles.md).
