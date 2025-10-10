---
title: No-Code Flow Development
icon: /docs/icons/flows.svg
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

# The Multi-Panel Flow Editor
- **No-Code View:** Form-based editing of tasks, inputs, triggers, and flow structure. Changes auto-generate YAML in real time.
- **Flow Code View (YAML):** Full editor with autocompletion, validation, and file sidebar.
- **Topology View:** Visual structure (DAG-like) that updates as you build.
- **Documentation & Blueprints Panels:** In-context docs and ready-to-use examples.

# Quick Start: First Flow in No-Code
1. **Create a flow** from **Flows → New**; confirm namespace and identifiers.
2. **Open No-Code view** and add your first task (e.g., a plugin from the catalog).
3. **Configure task properties** via forms; dynamic vs. static fields are indicated by the plugin’s schema/docs.
4. **Add flow logic** (If/Switch/ForEach/Subflow) to control execution paths.
5. **Connect tasks with outputs**: reference `{{ outputs.taskId.variable }}` in downstream properties; verify in topology.
6. **Add a trigger** (e.g., schedule, file-event) to automate runs.
7. **Validate & run**: save, then execute from the UI to see logs and results.

# Working with Tasks in No-Code
- **Finding tasks:** Browse or search the catalog; select to reveal form fields.
- **Understanding fields:** Use the **Documentation** panel for property descriptions and examples; check which fields support expressions.
- **Common patterns:**
  - File ingest → transform → load (ETL)
  - API call → condition → notification
  - Subflow orchestration with `wait`/error handling

# Switching Between No-Code and YAML
- **Round-trip editing:** Edits in forms update YAML instantly; edits in YAML reflect back in No-Code.
- **When to switch:**
  - Complex expressions or advanced plugin fields
  - Bulk edits across many tasks
  - Importing flows from repos/CI
- **Export/Share:** Use the **Actions** menu to export YAML or copy the flow.

# FAQ
- **Can I build everything No-Code?** Most flows, yes; complex cases may be faster in YAML. You can mix both seamlessly.
- **Do I lose control vs. YAML?** No—the No-Code editor writes standard Kestra YAML that you can export, version, and run anywhere Kestra runs.
