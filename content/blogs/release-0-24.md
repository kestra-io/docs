---
title: Kestra 0.24 introduces XXX
description: Kestra 0.24 XXX
date: 2025-08-05T17:00:00
category: News & Product Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-24.jpg
---


The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
| Java, Python, JavaScript, and Go SDKs     | Official Software Development Kits for multiple programming languages to interact with Kestra APIs and build integrations | All Edition |
| Basic Authentication Default     | User authentication and management capabilities now enforced in the open source version | Open Source Edition |
| Apps catalog for Enterprise Edition     | Display and listing of pre-built applications and integrations designed specifically for enterprise workflows and use cases | Enterprise Edition |
| HTTP function improvements     | Enhanced HTTP-based functions with improved performance, better error handling, and expanded functionality | All Edition |
| Playground feature (initial release)     | Shortened feedback loop with a new Playground mode for faster task editing and execution | All Edition |
| Dependency handling improvements     | Better management and resolution of workflow dependencies with enhanced visualization | All Edition |
| CSV export functionality for workflow data     | Export workflow metadata to CSV format for analysis and reporting | All Edition |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
    <iframe src="XXXX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.


## Feature 1

::collapse{title="XXX"}

::

<div class="video-container">
    <iframe src="XXX" title="Multi Panel Editor" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>



## Notable Enhancements

**Universal `from`**: 

The `from` property is now universal across many tasks. Each file can be defined in two ways: inline with its content, or as a URI with supported schemes including `kestra:///` for internal storage files, `file:///` for host local files, and `nsfile:///` for namespace files.
Here is an example to read from Namespace Files:

```yaml
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    script: '{{ read("nsfile:///main.py") }}'
```

or in the same way with `inputFiles` property

```yaml
  - id: python
    type: io.kestra.plugin.scripts.python.Commands
    inputFiles:
      main.py: nsfile:///main.py
    commands:
      - python main.py
```

For local files on the host, you can use the `file:///` scheme:

or with `inputFiles`:

```yaml
  - id: python
    type: io.kestra.plugin.scripts.python.Commands
    inputFiles:
      main.py: file:///tmp/scripts/main.py
    commands:
      - python main.py
```

## Plugin Enhancements

### Plugin Name



::collapse{title="xxxx"}
```yaml
xxx
```
::


## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues). With the [DevContainer support](docs/01.getting-started/03.contributing.md), it's easier than ever to start contributing to Kestra.

## Next Steps

This post covered new features and enhancements added in Kestra 0.24.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack). 