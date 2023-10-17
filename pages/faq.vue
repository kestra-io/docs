<template>
    <Head>
        <Title>Frequently Asked Questions</Title>
        <Meta name="description" content="Get responses on all your common questions about Kestra" />
    </Head>
    <div>
        <div class="container mb-5">
            <div class="mt-5">
                <p class="top-breadcrumb" data-aos="fade-right">
                    FAQ
                </p>
                <h1 data-aos="fade-left">Frequently Asked Questions</h1>
            </div>

            <h2 data-aos="zoom-in" class="mt-5">General Questions</h2>
            <CustomDetails title="What is Kestra?">
                <p>Kestra is an open-source orchestrator designed to bring Infrastructure as Code (IaC) best practices to all workflows — from those orchestrating mission-critical operations, business processes, and data pipelines to simple Zapier-style automation. Built with an API-first philosophy, Kestra enables users to define and manage data pipelines through a simple YAML configuration file. This approach frees you from being tied to a specific client implementation, allowing for greater flexibility and easier integration with various tools and services.</p>
            </CustomDetails>
            <CustomDetails title="What is a declarative Orchestrator?">
                <p>A declarative orchestrator is a system that allows you to define and manage complex workflows using a high-level, descriptive language. Instead of specifying the exact steps and sequences to achieve a specific outcome, a declarative orchestrator lets you define the desired end state and the system figures out how to reach it.</p>

                <p>Kestra is a declarative orchestrator designed for managing all kinds of workflows. It uses YAML (Yet Another Markup Language) to define workflows in a human-readable and structured format. Kestra workflows consist of tasks and triggers that represent various data processing operations, connected by data dependencies and flow control structures.</p>
            </CustomDetails>
            <CustomDetails title="What are the advantages of a Declarative Orchestrator?">
                <p>By using a declarative approach, Kestra simplifies the development, maintenance, and scalability of workflows. It allows you to focus on the high-level goals and objectives of your data workflows, while Kestra takes care of executing the tasks and handling errors, retries, and parallelism.</p>

                <p>Some key benefits of using Kestra as a declarative orchestrator include:</p>
                <ol>
                    <li>Improved readability and maintainability: Declarative workflows are easier to understand and modify, making it simpler for teams to collaborate and maintain their data pipelines over time.</li>
                    <li>Enhanced flexibility: Declarative orchestration enables easy modification and extension of workflows as requirements change, without the need for extensive refactoring.</li>
                </ol>
            </CustomDetails>
            <CustomDetails title="Who can benefit from using Kestra?">
                <p>Kestra is perfect for data engineers, developers, data scientists, and anyone who needs to process, manage, and orchestrate workflows across multiple systems.</p>
            </CustomDetails>

            <h2 data-aos="zoom-in" class="mt-5">Features and Functionality</h2>
            <CustomDetails title="What are some of the key features of Kestra?">
                <p>Kestra offers a wide range of features, including:</p>
                <ul>
                    <li>Intuitive flow creation with a built-in code editor</li>
                    <li>Powerful and flexible task execution with support for parallelism and retries</li>
                    <li>Comprehensive plugin ecosystem for easy integration with various services and systems</li>
                    <li>Advanced flow and task monitoring with metrics, logs, and notifications</li>
                    <li>Highly extensible and customizable architecture</li>
                </ul>
            </CustomDetails>
            <CustomDetails title="Can I create custom plugins for Kestra?">
                <p>Yes, Kestra allows developers to create custom plugins to add new tasks and integrations that suit their specific requirements.</p>
            </CustomDetails>
            <CustomDetails title="What languages are supported in Kestra flows?">
                <p>Kestra flows are primarily defined in YAML, which provides a simple and human-readable syntax for describing your data workflows. In addition to YAML, you can also use various scripting languages within your tasks, such as Python, JavaScript, or Bash, to perform custom operations and data transformations.</p>
                <p>Furthermore, Kestra supports Docker, which enables you to execute tasks using any language, expanding the range of possibilities for your workflows. This flexibility allows you to leverage the power of different programming languages within your Kestra flows to suit your specific requirements.</p>
            </CustomDetails>

            <h2 data-aos="zoom-in" class="mt-5">Getting Started</h2>
            <CustomDetails title="How do I get started with Kestra?">
                <p>To get started with Kestra, follow the <NuxtLink href="/docs/getting-started">Getting Started Guide</NuxtLink> on the Kestra website. This guide will walk you through the installation and configuration process, as well as provide an introduction to creating your first flows and tasks.</p>
            </CustomDetails>
            <CustomDetails title="How to install Kestra?">
                <p>Kestra is designed to be easy to install and set up. The installation process involves following the <NuxtLink href="/docs/getting-started/">official documentation</NuxtLink>, which provides step-by-step instructions on how to get started with Kestra on various platforms, including Docker, Kubernetes, and Helm. We are also available on our <a target="_blank" href="/slack">Slack channel</a> to provide assistance and answer any questions you might have during the installation process.</p>
            </CustomDetails>
            <CustomDetails title="Is there a community or support forum for Kestra?">
                <p>Yes, Kestra has a growing community. You can join the <a target="_blank" href="https://kestra.io/slack">Kestra Slack channel</a> to ask questions, share your experience, and connect with other users and developers.</p>
            </CustomDetails>

            <h2 data-aos="zoom-in" class="mt-5">Pricing and Licensing</h2>
            <CustomDetails title="Is Kestra open-source?">
                <p>Yes, Kestra is an open-source project. The source code is available on <a href="https://github.com/kestra-io/kestra" target="_blank">GitHub</a> under the Apache 2.0 license.</p>
            </CustomDetails>
            <CustomDetails title="Are there any costs associated with using Kestra?">
                <p>Kestra is free to use as an open-source project. However, there might be additional costs related to hosting, infrastructure, and any third-party services you choose to integrate with Kestra.</p>
            </CustomDetails>

            <h2 data-aos="zoom-in">Enterprise Edition</h2>
            <CustomDetails title="What additional features does the Kestra Enterprise Edition offer?">
                <p>The Kestra Enterprise Edition provides enhanced features designed to meet the needs of large-scale and
                    complex organizations. These features include:</p>
                <ul>
                    <li><strong>Improved scalability</strong>: Enterprise Edition allows you to scale up your Kestra deployment to handle a larger number of flows, tasks, and users.</li>
                    <li><strong>Enhanced security</strong>: Enterprise Edition offers additional security features such as encryption, access control, single sign-on (SSO) integration, fine-grained management permissions, and audit logs.</li>
                    <li><strong>Dedicated support</strong>: With the Enterprise Edition, you'll have access to dedicated support from the Kestra team to help you resolve any issues and ensure a smooth deployment.</li>
                    <li><strong>Customizable dashboard</strong>: Enterprise Edition includes a customizable dashboard that provides advanced monitoring and analytics capabilities for better insights into your data workflows.</li>
                    <li><strong>User management</strong>: Enterprise Edition enables you to easily add and manage users, ensuring that the right people have access to the appropriate resources and workflows within your organization.</li>
                </ul>
            </CustomDetails>
            <CustomDetails title="How can I get access to the Kestra Enterprise Edition?">
                <p>To get access to the Kestra Enterprise Edition, please contact us through our <a target="_blank" href="/slack">Slack channel</a> or <a target="_blank" href="/demo">book a demo</a>. We will provide you with the necessary information and guide you through the process of setting up the Enterprise Edition.</p>
            </CustomDetails>
            <CustomDetails title="Are there additional costs associated with the Enterprise Edition?">
                <p>Yes, there are additional licensing fees for using the Kestra Enterprise Edition. The fees depend on the size of your organization and the specific features you require. To get more information about pricing, please get in touch with the Kestra team.</p>
            </CustomDetails>

            <h2 data-aos="zoom-in">Miscellaneous</h2>
            <CustomDetails title="How does Kestra compare to other data orchestration platforms?">
                <p>Kestra stands out from other data orchestration platforms due to its focus on ease of use thanks to declarative language YAML, powerful features, and a growing ecosystem of plugins. The user-friendly interface and robust architecture make it an excellent choice for orchestrating complex data workflows across various systems and services.</p>
                <ul>
                <li> See how Kestra compare with <a target="_blank" href="/vs/airflow">Airflow</a> </li>
                <li> See how Kestra compare with <a target="_blank" href="/vs/prefect">Prefect</a> </li>
                </ul>
            </CustomDetails>
            <CustomDetails title="Are there any limitations when using declarative flows in YAML?">
                <p>YAML's simplicity and readability make it easy to understand and maintain your data workflows. Kestra provides extensive support for various YAML features, such as variables, loops, and conditions, allowing you to create complex workflows without the need for a separate programming language. If you require more advanced functionality, you can always use scripting languages like Python, JavaScript, or Bash within your tasks to extend your flows' capabilities.</p>
            </CustomDetails>
            <CustomDetails title="How can I contribute to the Kestra project?">
                <p>Contributions to the Kestra project are always welcome! You can contribute by submitting bug reports, feature requests, or pull requests on the <a href="https://github.com/kestra-io/kestra" target="_blank">GitHub repository</a>. You can also join the community on <a target="_blank" href="https://kestra.io/slack">Slack</a> to discuss ideas and collaborate with other developers.</p>
            </CustomDetails>
        </div>
    </div>
    <Newsletter />
</template>

<script>
    import CustomDetails from "../components/layout/CustomDetails.vue";
    import Newsletter from "../components/layout/Newsletter.vue";

    export default {
        components: {CustomDetails, Newsletter},
    }

useHead({
    meta:[
      {name:'twitter:card',content:'summary-large-image'},
      {name : 'twitter:site',content:'@kaestra_io'},
      {name : 'twitter:title',content:"Frequently Asked Questions"},
      {name:'twitter:description',content:"Get responses on all your common questions about Kestra"},
      {name : 'twitter:image' ,content:"/landing/home/header-bg.png"},
      {name : 'twitter:image:alt',content : "FAQ"}
    ]
  })
</script>


<style scoped lang="scss">

    h2 {
        margin-top: 2rem;
    }
</style>
