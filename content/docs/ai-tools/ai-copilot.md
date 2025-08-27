---
title: AI Copilot
icon: /docs/icons/ai.svg
editions: ["OSS", "EE", "Cloud"]
version: "1.0.0"
---

Build and modify flows directly from natural language prompts.

The AI Copilot can generate and iteratively edit declarative flow code with AI-assisted suggestions.

## Overview

The AI Copilot is designed to help build and modify flows directly from natural language prompts. Describe what you are trying to build, and Copilot will generate the YAML flow code for you to accept or adjust. Once your initial flow is created, you can iteratively refine it with Copilot’s help, adding new tasks or adjusting triggers without touching unrelated parts of the flow. Everything stays as code and in Kestra's usual declarative syntax.

## Configuration

To add Copilot to your flow editor, add the following to your Kestra configuration:

```yaml
kestra:
  ai:
    type: gemini
    gemini:
      model-name: "gemini-2.5-flash"
      api-key: yourkey
```

Replace `api-key` with your Google Gemini API key, and Copilot will appear in the top right corner of the flow editor.

![AI Copilot](/docs/ai-tools/ai-copilot.png)

::alert{type="info"}
For now, only Gemini models are supported, but we will release support for other models -- including open source -- in the future.
::

## Build flows with Copilot

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/kvO69FrLnnXVsMkrLi7T?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Flows | Kestra EE" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>