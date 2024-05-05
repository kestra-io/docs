---
title: Leverage Terraform for flow modularity
icon: /docs/icons/terraform.svg
---

Use Terraform to template Kestra flows

This coding examples will show you how you can leverage terraform to DRY (Do Not Repeat Yourself) your Kestra codebase and leverage powerful templating features brought by HCL.

## Introduction

In order to make your codebase easy to use for users unfamiliar with Kestra syntax, you may want to encapsulate most of the logic and DSL (Domain-specific programming language) into [Terraform modules](https://developer.hashicorp.com/terraform/language/modules).

Terraform can use YAML files as templates thanks to the function [templatefile()](https://developer.hashicorp.com/terraform/language/functions/templatefile).

In this quick tutorial we will see how using templating capbilities brought by Terraform can help you :

- DRY (Do Not Repeat Yourself) your codebase
- Facilitate onboarding on Kestra
- Incorporate extra modularity
- Implement complex pipelines while keeping syntax clear

## Subflows vs Terraform templating

## Example
