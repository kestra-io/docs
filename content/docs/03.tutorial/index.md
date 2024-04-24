---
title: Tutorial
---

Kestra is an open-source orchestrator designed to bring Infrastructure as Code (IaC) best practices to all workflows — from those orchestrating mission-critical applications, IT operations, business processes, and data pipelines, to simple Zapier-style automations.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/videoseries?si=27rzEZFWtYMSbjXu&amp;list=PLEK3H8YwZn1oaSNybGnIfO03KC_jQVChL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

You can use Kestra to:
- run workflows **on-demand**, **event-driven** or based on a regular **schedule**
- programmatically interact with any system or programming language
- orchestrate **microservices**, **batch jobs**, ad-hoc **scripts** (written in Python, R, Julia, Node.js, and more), **SQL queries**, data ingestion syncs, dbt or Spark jobs, or any other **applications** or **processes**

This tutorial will guide you through **key concepts** in Kestra. We'll start with the same "Hello world" flow from the [Quickstart Guide](../01.getting-started/01.quickstart.md), and we'll gradually introduce new concepts including `namespaces`, `tasks`, parametrization with `inputs` and scheduling using `triggers`.

We'll then dive into `parallel` task execution, error handling, as well as custom scripts and microservices running in isolated containers. Let's get started!


::next-link
[Fundamentals: build a "Hello World" flow](./01.fundamentals.md)
::

::ChildCard
::
