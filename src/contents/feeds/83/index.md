---
title: "⚡️ Kestra v0.21 is live! ⚡️"
link: "Learn More"
href: "https://go.kestra.io/release-021-newsfeed"
image: ./image.jpg
publicationDate: 2025-02-04T16:00:00
addedDate: 2024-06-05T07:28:23.662
---

This release adds no-code forms for easier flow creation, custom dashboards for flexible monitoring, a new `finally` property to handle cleanup tasks, and advanced log forwarding across your entire infrastructure. It also introduces Maintenance Mode for platform upgrades and a host of UI/UX enhancements.

**What’s new in the Open-Source Edition:**
 • Redesigned no-code flow builder with organized drawers
 • Custom dashboards to visualize execution metrics in a way that fits your needs
 • New `finally` flow property to ensure cleanup tasks always run even if prior tasks fail
 • Improved handling of Restarts and Change state across parent-child executions
 • Write task for creating files on the fly, Exit task for early termination
 • New HuggingFace plugin to integrate LLM-based capabilities into your workflows
 • AWS EMR plugin for on-demand Spark clusters

**For Enterprise Edition users, this release additionally brings:**
 • Log Shipper to forward Kestra logs to your existing log & observability systems
 • Maintenance Mode to queue new workflows and let running jobs finish before upgrades
 • Revision history for all resources.
