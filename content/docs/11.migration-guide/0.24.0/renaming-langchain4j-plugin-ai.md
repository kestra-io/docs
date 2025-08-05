---
title: Migrate from LangChain4j Plugin to Plugin AI
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS", "EE"]
---


## Breaking Change

The LangChain4j plugin has been renamed and is now available as Plugin AI, with a new repository and package namespace. Starting in Kestra 0.24, you must update all flows using `langchain4j` to reference the new `plugin-ai` package. No functional changes were made; this is a rename for clarity and future extensibility.

The new Plugin AI repository is [https://github.com/kestra-io/plugin-ai](https://github.com/kestra-io/plugin-ai).

## Required Migration Steps

- Update all flow definitions:

  - Change `type:` and `provider:` values from `io.kestra.plugin.langchain4j.*` to `io.kestra.plugin.ai.*`
  - Adjust any provider types under `provider:` to use the new namespace, as shown in the examples below.

### Before 0.24 (using langchain4j):

```yaml
id: chat_completion
namespace: company.team

inputs:
  - id: prompt
    type: STRING

tasks:
  - id: chat_completion
    type: io.kestra.core.plugin.langchain4j.completion.ChatCompletion
    provider:
      type: io.kestra.plugin.langchain4j.provider.GoogleGemini
      apiKey: "{{secret('GOOGLE_API_KEY')}}"
      modelName: gemini-2.5-flash
    messages:
      - type: SYSTEM
        content: You are a helpful assistant, answer concisely, avoid overly casual language or unnecessary verbosity.
      - type: USER
        content: "{{inputs.prompt}}"
```

### After migrating to 0.24 (using plugin-ai):

```yaml
id: chat_completion
namespace: company.team

inputs:
  - id: prompt
    type: STRING

tasks:
  - id: chat_completion
    type: io.kestra.plugin.ai.completion.ChatCompletion
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      apiKey: "{{ secret('GOOGLE_API_KEY') }}"
      modelName: gemini-2.5-flash
    messages:
      - type: SYSTEM
        content: You are a helpful assistant, answer concisely, avoid overly casual language or unnecessary verbosity.
      - type: USER
        content: "{{inputs.prompt}}"
```

## Additional Notes

- The new namespace applies to all AI providers and task types previously under `langchain4j`.
- No configuration changes are needed apart from the updated type paths.

