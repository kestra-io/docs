---
title: Using Pulumi's Terraform Provider to Integrate Kestra
icon: /src/contents/docs/icons/pulumi.svg
stage: Advanced
topics:
  - DevOps
  - Integrations
description: Integrate Kestra infrastructure management into your Pulumi projects using Pulumi's Terraform Provider bridge.
---

Utilize Pulumi's Terraform Provider to manage Kestra infrastructure.

## Using Pulumi's Terraform Provider to Integrate Kestra

This post outlines the process of leveraging Pulumi's terraform-provider package to seamlessly integrate the Kestra Terraform provider into your Pulumi projects. This approach allows you to manage Kestra resources using the familiar Pulumi infrastructure-as-code workflow, even if the provider isn't officially published in the main Pulumi Registry.

## About the example repository

The repository we will be using, the [pulumi-kestra-example](https://github.com/japerry911/pulumi-kestra-example) repository, is a hands-on example that shows how to provision and manage Kestra resources with Pulumi using a Python-based provider and SDK generated locally. The repo includes:
 - a Pulumi project YAML
 - a complete example flow and namespace
 - an app - demonstrating a real-world use case: uploading a file to Google Cloud Storage via a Kestra flow and app
Note the flow.yaml does not perform an actual GCS File Upload, and that portion is commented out. This blog post is meant to prioritize understanding of the Pulumi Terraform-Provider.

## Step-by-step process

Follow these steps to set up your environment and begin managing Kestra resources with Pulumi:

1. Clone/Fork the Example Repository
- Start by cloning or forking the example repository, which provides a foundational structure for your project: https://github.com/japerry911/pulumi-kestra-example

2. Download and Install Pulumi
- If you haven't already, install the Pulumi CLI on your system:
    - Mac: `brew install pulumi/tap/pulumi`
    - Linux: `curl -fsSL https://get.pulumi.com | sh`
    - Windows: Refer to the official Pulumi documentation for installation instructions: [Pulumi Docs](https://www.pulumi.com/docs/get-started/download-install/)

3. Create a Pulumi Python Project
- For this example, we'll be using Python. You can create a new Pulumi Python project with the following command: `pulumi new python`
    - During the project creation process, you will be prompted to:
        - Log in with your browser or an access token.
        - Fill in project-specific options such as project name, stack, and preferred package management tool.

4. Add the Terraform Provider
- Pulumi's `pulumi package add terraform-provider <your-terraform-provider>` command is a powerful feature that utilizes local packages. This command instantly generates a language-specific SDK for any existing Terraform or OpenTofu provider directly within your project. This means you can use providers in your Pulumi code even if they are not officially published in the main Pulumi Registry.
- Execute the following command in your terminal to add the Kestra Terraform provider: `pulumi package add terraform-provider kestra-io/kestra`
    - This command downloads the specified provider (kestra-io/kestra) and creates all the necessary wrapper code in a local directory (e.g., ./sdks/), enabling you to immediately manage that provider's resources as part of your Pulumi infrastructure.

5. Install the Local SDK
- Now that you have a local SDK in your project's `sdks` folder, you need to install it into your local Python virtual environment. (If you're using a different language project, you'll need to follow the equivalent installation steps for that language.)
    - Add the SDK path to your requirements.txt file: `echo sdks/kestra >> requirements.txt`
    - Install the project dependencies: `pulumi install`

6. Create and Fill .env File
- Create a .env file based on a .env.local template. This file will hold your Kestra secrets and provider URL.

```
## Kestra secrets
## API Token is required (Enterprise-only),
## or Username AND Password are required
KESTRA_API_TOKEN=
KESTRA_USERNAME=
KESTRA_PASSWORD=

## Kestra Provider URL for Provider declaration
KESTRA_PROVIDER_URL=
```

- Fill in the appropriate values for `KESTRA_API_TOKEN`, `KESTRA_USERNAME`, `KESTRA_PASSWORD`, and `KESTRA_PROVIDER_URL` based on your Kestra instance edition.

7. Prepare for Resource Building
- With the local Pulumi SDK for the Kestra Terraform provider set up and installed, let's install some additional Python packages before we start defining our resources:
    - Activate your Python environment: `source venv/bin/activate`
    - Install python-dotenv and PyYAML: `pip install python dotenv PyYaml`

8. Build and Deploy
- You are now ready to build and deploy your Kestra resources using Pulumi!
    - Execute the following command: `pulumi up`
        - This will initiate the deployment process, and Pulumi will provision your Kestra resources as defined in your project.

## What did we provision?

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/O6YaDo2Nmws?si=hCxLE5K8L6bEvsas" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Conclusion

By following these steps, you can effectively integrate the Kestra Terraform provider into your Pulumi workflows, allowing for robust and consistent management of your Kestra infrastructure.

Thank you for reading, Happy Coding!
