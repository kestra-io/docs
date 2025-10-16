---
title: No-Code Flow Development
icon: /docs/icons/flow.svg
editions: ["OSS", "EE", "Cloud"]
---

Build flows without touching YAML.

# Introduction

The No-Code editor lets you design Kestra flows directly in the UI using structured forms. It’s ideal for teams who want to move fast, enable non-developers, and still keep a clean handoff to code. You can switch between No-Code and YAML at any time — the editor generates schema-validated YAML for you and stays in sync with topology and documentation panels.

## Why choose No-Code (or combine it with code):

- **Speed & onboarding**: Start building flows without learning YAML first; power users can drop into code view whenever needed. 
- **Clarity**: Live topology and documentation help you “see” the flow while you edit. 
- **Consistency & governance**: UI-driven forms align with plugin schemas and validation, reducing drift. 
- **No ceiling**: When you outgrow forms, switch to YAML, add files/scripts, and keep everything in one place.

::alert{type="info"}
In addition to No-Code flow building, avoid writing your own YAML by checking out the Kestra [AI Copilot](../ai-tools/ai-copilot.md) to get your YAML started for you.
::

# The Multi-Panel Flow Editor
- **No-Code View:** Form-based editing of tasks, inputs, triggers, and flow structure. Changes auto-generate YAML in real time.
- **Flow Code View (YAML):** Full editor with autocompletion, validation, and file sidebar.
- **Topology View:** Visual structure (DAG-like) that updates as you build.
- **Documentation & Blueprints Panels:** In-context docs and ready-to-use examples.

# Quick Start: First flow in No-Code
1. **Create a flow** from **Flows → + Create**; confirm namespace and identifiers.
2. **Open No-Code view** by selecting the view from the editor panel and add your first task (e.g., a plugin from the catalog). Browse or search the catalog; select to reveal form fields.

![No-Code Panel View](/docs/no-code/no-code-flow-panel.png)

Use the **Documentation** panel for property descriptions and examples. With multi-panel editing, you can close, open, and reposition any view at any time. For example, below the Slack plugin documentation is opened up alongside the No-Code editor while the flow-code YAML editor is closed.

![No-Code Documentation View](/docs/no-code/multi-panel.png)

3. **Configure Inputs** by clicking **+ Add** in the inputs section of the no-code editor. This action opens a new tab for configuring your input with all required and optional properties available. As you finish an input, you can close the tab or navigate back to the **No-code** tab, click **+ Add** again to create another input. If you leave the **Flow Code** YAML view open, you can see YAML code propagating in real time as you add inputs.

![No-Code Input Configuration](/docs/no-code/no-code-inputs.png)

4. **Configure task properties** via forms; dynamic vs. static fields are indicated by the plugin’s schema/docs. Each task opens a No-Code tab and propagates code as you select and configure properties. Property fields can even autocomplete expressions for inputs previously configured.

![No-Code Task Configuration](/docs/no-code/no-code-tasks.png)

5. **Add flow logic** (If/Switch/ForEach/Subflow) tasks to control execution paths.
6. **Add a trigger** (e.g., schedule, file-event) to automate runs.

![No-Code Trigger Configuration](/docs/no-code/no-code-trigger.png)

7. **Add additional flow components** such as [outputs](../04.workflow-components/06.outputs.md), [retry](../04.workflow-components/12.retries.md), [SLA](../04.workflow-components/18.sla.md), [afterExecution](../04.workflow-components/20.afterexecution.md), [Plugin Defaults](../04.workflow-components/09.plugin-defaults.md), and every other possible Kestra flow component. Everything possible with code, can be done with No-Code.

![Additonal Flow Components](/docs/no-code/additional-components.png)

8. **Validate & run**: save, then execute from the UI to see logs and results.

# Switching between No-Code and YAML
- **Round-trip editing:** Edits in forms update YAML instantly; edits in YAML reflect back in No-Code.
- **When to switch:**
  - Complex expressions or advanced plugin fields
  - Bulk edits across many tasks
  - Importing flows from repos/CI
- **Export/Share:** Use the **Actions** menu to export YAML or copy the flow.

# FAQ
- **Can I build everything No-Code?** Most flows, yes; complex cases may be faster in YAML. You can mix both seamlessly.
- **Do I lose control vs. YAML?** No—the No-Code editor writes standard Kestra YAML that you can export, version, and run anywhere Kestra runs.
