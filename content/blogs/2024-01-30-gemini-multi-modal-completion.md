---
title: "How to Use Google's Gemini Generative AI multimodal completion"
description: "Explore how to use Gemini, Google's Generative AI, with Kestra."
date: 2024-01-30T12:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: "lmathieu"
---

A few weeks ago, [Google introduce Gemini](https://blog.google/technology/ai/google-gemini-ai), a new Generative AI solution that allows not only to generate text or images, but to mix different types of content in a single prompt, what is called a multi modal completion, making it closer to what a human do: analysing multiple types of information in the same time.

Gemini is a generative AI based on a large language models (LLMs) that you can use via the [Google Vertex AI API](https://cloud.google.com/vertex-ai).

Kestra have a task that you can use in your flow to call the Gemini LLM, let's see how it works.

First, as I love jokes (I already told you that in my [How to Use Google's PaLM 2 Bard AI to Start Your Day with a Smile](2023-08-24-using-google-bard-ai-with-kestra.md) article that introduce Bard, the previous generation of Google's LLM), I'll ask Gemini to tell me one.

```yaml
id: gemini
namespace: company.team

tasks:
  - id: ask-for-jokes
    type: io.kestra.plugin.gcp.vertexai.MultimodalCompletion
    region: "{{vars.gcpRegion}}"
    projectId: "{{vars.gcpProjectId}}"
    contents:
      - content: Can you tell me a good joke?
```

This task will output Gemini's response in the form of a prediction.

![Gemini task outputs for a multimodal completion with a text](/blogs/2024-01-30-gemini-multi-modal-completion/text-completion-outputs.png)

OK, this is not very different as what we had with Bard, we have a prediction and safety ratings.

The real power of Gemini is with multimodal completion, a mutimodal completion is a single request to Gemini that contains multiple type of content: text, audio or video. You can mix contents in a single request to Gemini.

Here is a more complex example that ask to describe an image and a video passed to the flow as inputs. It add two contents, one is the question as a text, the other is the image or the video. You must set the `mimeType` attribute to the mime type of the image or video content so Gemini can analyse it.

```yaml
id: gemini
namespace: company.team

inputs:
  - name: image
    type: FILE
  - name: video
    type: FILE

tasks:
  - id: describe-image
    type: io.kestra.plugin.gcp.vertexai.MultimodalCompletion
    region: "{{vars.gcpRegion}}"
    projectId: "{{vars.gcpProjectId}}"
    contents:
      - content: Can you describe this image?
      - mimeType: image/jpeg
        content: "{{inputs.image}}"

  - id: describe-video
    type: io.kestra.plugin.gcp.vertexai.MultimodalCompletion
    region: "{{vars.gcpRegion}}"
    projectId: "{{vars.gcpProjectId}}"
    contents:
      - content: Can you describe this video?
      - mimeType: video/mpeg4
        content: "{{inputs.video}}"
```

This is the generated text for the description of the image.

![Gemini task outputs for a multimodal completion with an image](/blogs/2024-01-30-gemini-multi-modal-completion/image-completion-output.png)

The image was indeed a schema of the Java classloader system, the answer is pretty good, but we can see that it is truncated.

If we look at the outputs of the task, there is a `finishReason` that has the value `MAX_TOKENS`. The answer was truncated because it reach the completion max tokens limit, it can be increased by configuring the task with a higher max output tokens.

```yaml
  - id: describe-image
    type: io.kestra.plugin.gcp.vertexai.MultimodalCompletion
    region: "{{vars.gcpRegion}}"
    projectId: "{{vars.gcpProjectId}}"
    contents:
      - content: Can you describe this image?
      - mimeType: image/jpeg
        content: "{{inputs.image}}"
    parameters:
      maxOutputTokens: 1024
      temperature: 0.2
      topP: 0.95
      topK: 40
```

With this configuration, the description of the image is no more truncated.

This is the generated text for the description of the video, the video was a screencast of Kestra, the description is not very accurate except for the black color as I used Kestra's dark theme.

![Gemini task outputs for a multimodal completion with a video](/blogs/2024-01-30-gemini-multi-modal-completion/video-completion-output.png)

Gemini has security safety included, and it works for all type of content.

For example, if you ask Gemini to describe a photo of an identity card, the answer will be blocked for a safety reason and the task ends in WARNING.

![Gemini task outputs for a blocked answer due to safety reason](/blogs/2024-01-30-gemini-multi-modal-completion/safety-blocked-output.png)

You can see in the outputs that the safety category `HARM_CATEGORY_DANGEROUS_CONTENT` was evaluated as `MEDIUM` and blocked the answer.