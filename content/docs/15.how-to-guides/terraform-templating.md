---
title: Leverage Terraform for flow modularity
icon: /docs/icons/terraform.svg
---

Scale your codebase using Terraform to template and define flows

## Introduction

This article will show you how to leverage terraform in your Kestra codebase and its powerful templating features brought by HCL (Hashicorp Configuration Language).

In order to make your codebase easy to use for users unfamiliar with Kestra syntax, you may want to encapsulate most of the logic and DSL (Domain-specific programming language) into [Terraform modules](https://developer.hashicorp.com/terraform/language/modules).

This quick tutorial, will show you how templating capbilities brought by Terraform can help you :

- DRY (Do Not Repeat Yourself) your codebase
- Facilitate onboarding on Kestra
- Incorporate extra modularity
- Implement complex pipelines while keeping syntax clear

## Code structure

```
.
└── environment/
    ├── development
    ├── production/ # Contains subfolders defining Kestra flows resources
    │   ├── airbyte/
    │   ├── dbt/
    │   ├── triggers/
    │   ├── main.tf # Instanciate each folder (airbyte, dbt ...)
    │   └── ...
    ├── modules/ # Terraform modules to be used in environments
    │   ├── airbyte_sync/
    │   ├── trigger_cron/
    │   └── ...
    └── subflows/ # Kestra subflows
        ├── main.tf
        ├── sub_cloud_sql_airbyte_query.yml
        └── ...
```

Modules are folders under `modules` folder and can be instantiated either in `development` or `production` environments.

They only expose variables that are meant to be changed for usage purpose.

Inside a module, you can define a `main.tf` file that will define the resources to be created.

## Creating a module

Let's create a module that will define a Kestra flow that will sync data from Airbyte and run a DBT.


# tree structure of a terraform module :

```
.
└── airbyte_sync/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

## Subflows vs Terraform templating



## Example
