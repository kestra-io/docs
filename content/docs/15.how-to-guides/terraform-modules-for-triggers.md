---
title: Modularize your triggers and schedules with Terraform
icon: /docs/icons/terraform.svg
---

Scale your codebase using Terraform to template and make scheduling a breeze

## Introduction

As seen in this [terraform templating](/docs/how-to-guides/terraform-templating) guide, you can leverage Terraform to template and define flows.

Managing triggers and schedules can be a **tedious task**, especially when you have a lot of flows to manage and you start to generate **peak hours**.

This guide will show you how to use Terraform to define triggers and schedules for your flows with modularity.

## Code structure

```
.
└── environment/
    ├── development
    ├── production/ # Contains subfolders defining Kestra flows resources
    │   ├── airbyte/
    │   └── ...

    ├── modules/ # Terraform modules to be used in environments
    │   ├── trigger_cron/
    │   ├── trigger_cron_hourly_random/
    │   └── ...

```