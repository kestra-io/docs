---
title: Script tasks moved to dedicated plugins
icon: /docs/icons/migration-guide.svg
release: 0.11.0
---

Script tasks included in the core plugin have been deprecated in 0.11.0 and moved to dedicated plugins.

Previously, there was scripting tasks inside the core plugin (the plugin that offers core task and is always included inside any Kestra distribution). Since the introduction of the new [Script tasks](../../16.scripts/index.md) in dedicated plugins, the old core scripting tasks have been deprecated and moved out of the core plugin.

If you use one of these tasks, you should migrate to the new one that offers improved scripting capabilities and runs by default in a separate Docker container.

If you still want to use one of the old tasks and you don't use one of our `*-full` Docker images and manually install plugins, you must include the new plugin that now includes the old deprecated tasks.

Here is the list of the old tasks with their new location and the replacement tasks:

- The [Bash](/plugins/plugin-script-shell/io.kestra.core.tasks.scripts.bash) task is now located inside the `plugin-script-shell` plugin and replaced by the Shell [Commands](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.commands) and [Script](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.script) tasks.
- The [Node](/plugins/plugin-script-node/io.kestra.plugin.core.scripts.Node) task is now located inside the `plugin-script-node` plugin and replaced by the Node [Commands](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.commands) and [Script](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.script) tasks.
- The [Python](/plugins/plugin-script-python/io.kestra.core.tasks.scripts.python) task is now located inside the `plugin-script-python` plugin and replaced by the Python [Commands](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.commands) and [Script](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script) tasks.
