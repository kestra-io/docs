---
title: Flows FAQ
icon: /docs/icons/faq.svg
---

Common questions about flows.

## Where does kestra store flows?

Flows are stored in a serialized format directly **in the Kestra backend database**.

The easiest way to add new flows is to add them directly from the Kestra UI. You can also use the Git Sync pattern or CI/CD integration to add flows automatically after a pull request is merged to a given Git branch.

To see how flows are represented in a file structure, you can leverage the `_flows` directory in the [Namespace Files](/docs/developer-guide/namespace-files) editor.

### How to load flows at server startup?

If you want to load a given local directory of flows to be loaded into Kestra (e.g. during local development), you can use the `-f` or `--flow-path` flag when starting Kestra:

```bash
./kestra server standalone -f /path/to/flows
```

That path should point to a directory containing YAML files with the flow definition. These files will be loaded to the Kestra repository at startup. Kestra will make sure to add flows to the right namespace, as declared in the flow YAML definition.

For more information about the Kestra server CLI, check the [Administrator Guide](/docs/administrator-guide/servers) section.

### Can I sync a local flows directory to be continuously loaded into Kestra?
At the time of writing, there is no syncing of a flows directory to Kestra. However, we are aware of that need and we are working on a solution. You can follow up in [this GitHub issue](https://github.com/kestra-io/kestra/issues/2403).
