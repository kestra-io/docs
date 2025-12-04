---
title: "Kestra 1.2 introduces ..."
description: "Kestra 1.2 delivers ..."
date: 2026-01-06T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: /blogs/release-1-2.jpg
---


We're excited to announce Kestra 1.2, delivering ...

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="" title="Kestra 1.2 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## New Feature 1

...




## New Feature 2

...



## New Feature 3

...


## New Feature 4

...




## New Feature 5

...


## New Feature 6

...



## New Feature 7

...




## New Feature 8

...


## New Feature 9

...

## New Feature 10

...

## Additional Improvements

- ...
- ...
- ...
- ...
- ...

## New Plugins



## Migration Note for Upgrading to 1.2

Version 1.2 changes how Namespace Files metadata are handled: the backend now indexes this metadata to optimize search and scalability, replacing the previous approach of fetching all stored files directly from storage, which was inefficient for large datasets. Additionally, Namespace Files can now be versioned and restored.


```shell
/app/kestra migrate metadata nsfiles
```

For **Docker Compose** setups, replace the command by the following

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata nsfiles
```

After the migration completes, revert to the standard startup command to run the server, e.g., `server standalone --worker-thread=128`.

For **Kubernetes** deployments, create a one-time pod to run the same migration commands before restarting your regular Kestra server pods.

:::alert{type="info"}
Running the migration after the upgrade is safe and will restore the missing UI data immediately. Check the [migration guide](https://kestra.io/docs/migration-guide) for complete upgrade instructions.
:::

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.2. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
