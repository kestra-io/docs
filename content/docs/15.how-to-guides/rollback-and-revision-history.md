---
title: Revision History & Rollback
icon: /docs/icons/tutorial.svg
stage: Getting Started 
topics:
  - Kestra Concepts
  - Version Control
---

Use revision history to rollback to an older version of a flow.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/lpHl52Rlvr0?si=RyPvvhGNkTmskLKP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What is Revision History

Kestra stores revision history which allows you to easily roll back to any older version of the flow. You can check out the older versions by going to the "Revisions" tab on the flow's page. By default, the page opens up a comparison of the current version of the flow against the previous version.

![revision_comparison](/docs/how-to-guides/rollback-and-revision-history/revision_comparison.png)

You can compare any two versions by choosing the appropriate revision number from the drop down on both sides, allowing you to see the changes made between the two selected versions.

![revision_dropdown](/docs/how-to-guides/rollback-and-revision-history/revision_dropdown.png)

There is a `Restore` button allowing you to roll back to the selected version. The `Restore` button is disabled for the current live version as there is nothing to restore.

![restore_option](/docs/how-to-guides/rollback-and-revision-history/restore_option.png)

