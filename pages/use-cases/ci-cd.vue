<template>
    <div>
        <Head>
          <Title>CI/CD for your Kestra Workflows</Title>
          <Meta name="description" content="Embrace software engineering practices for versioning, deploying, and maintaining data workflows" />
        </Head>

        <SolutionsDetailHeader
            title="for your Kestra Workflows"
            titleBefore="CI/CD"
            subtitle="Embrace software engineering practices for versioning, deploying, and maintaining data workflows"
            image="/landing/usecases/cicd/intro-bg.svg"
            imageWidth="785px"
        />
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailContent
                title="What is CI/CD?"
                subtitle="CI/CD stands for Continuous Integration and Continuous Deployment, software engineering practices that involve regularly merging code changes (Continuous Integration) and automated deployment to production (Continuous Deployment). CI/CD practices make the development process more efficient, less error-prone, and better aligned with business needs."
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutDetailMainContent
                subtitle="Build your Workflows"
                subtitleAfter="as Code"
                baseline="Kestra allows building workflows as code. This approach facilitates seamless integration with existing CI/CD processes, Infrastructure as Code tools like Terraform, and version control systems like Git."
                :items="mainContent"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailEmpower
                title="Apply DevOps best practices in your data engineering lifecycle"
                subtitle="Kestra provides a comprehensive solution to streamline the data engineering lifecycle by offering collaborative development and infrastructure as code capabilities. Through its user-friendly interface and integration with tools like Terraform, Kestra enables organizations to develop and deploy data workflows efficiently while maintaining the stability and security of production environments."
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailFeatures
                subtitle="Key"
                subtitleAfter="Features"
                :items="features"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Ready to take your data platform to the next level?"
                darkButtonText="get a demo"
                darkButtonHref="/demo"
                purpleButtonText="Get Started"
                purpleButtonHref="/docs/getting-started/quickstart"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script>
    import CodeBrackets from "vue-material-design-icons/CodeBrackets.vue";
    import OneUp from "vue-material-design-icons/OneUp.vue";
    import Git from "vue-material-design-icons/Git.vue";
    import Github from "vue-material-design-icons/Github.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
                mainContent: [
                    {
                        title: 'Implementing CI/CD for Kestra Flows',
                        img: '/landing/usecases/cicd/feature-1.svg',
                        imgAlt: 'Diagram illustrating Kestra\'s integration with GitHub Actions',
                        imgWidth: '877px',
                        imgHeight: '713px',
                        content: 'You can version-control your Kestra workflows in a Git repository, easily track changes, collaborate with other team members, and roll back to previous versions if necessary.<br /><br />' +
                            'The CI/CD pipeline automatically validates and deploys the updated workflows to the Kestra environment whenever changes are committed and pushed to a given Git branch.'
                    },
                    {
                        title: 'From Development to Production',
                        img: '/landing/usecases/cicd/feature-2.svg',
                        imgAlt: 'Picture of development workflow to production deployments',
                        imgWidth: '725px',
                        imgHeight: '762px',
                        content: 'Creating data workflows often starts locally and gradually moves towards production. It involves designing data pipelines, setting up tasks, dependencies, and verifying the code\'s functionality.<br />.<br />' +
                            'The typical workflow of moving a data pipeline from development to production starts with a pull request. Once approved, the changes get deployed to the production. .<br />.<br />' +
                            'This streamlined approach ensures that the production environment remains stable and secure while allowing for rapid adaptation to changing business needs and requirements.',
                    },
                    {
                        title: 'Manage DataOps Lifecycle with Kestra and Terraform',
                        img: '/landing/usecases/cicd/feature-3.svg',
                        imgAlt: 'Illustration showing Kestra integration to Hashicorp Terraform provider',
                        imgWidth: '878px',
                        imgHeight: '762px',
                        content: 'Combining Kestra and Terraform provides a reliable foundation for managing the data engineering lifecycle while promoting collaboration between engineers and business users. <br /><br />' +
                            'The combination of Infrastructure as Code and Workflow as Code enables organizations to embrace engineering best practices, balancing fast feedback loops during development with the benefits of infrastructure as code for production environments.'
                    },
                    {
                        title: 'Fast iteration cycles',
                        img: '/landing/usecases/cicd/feature-4.svg',
                        imgAlt: 'Image showing a fast feedback loop',
                        imgWidth: '877px',
                        imgHeight: '713px',
                        content: 'Kestra enables both data teams and business stakeholders to participate in workflow creation using a simple declarative configuration.<br /><br />' +
                            'Kestra UI provides an embedded code editor, versioning, auto-completion, and a topology view of workflow dependencies, simplifying the development process for all stakeholders. This way, Kestra facilitates collaboration and fast iteration cycles.\n',
                    },
                ],
                features: [
                    {
                        title: 'Workflows as Code',
                        text: 'Define and manage data workflows using YAML configuration, which opens data workflows to more people in your organization.',
                        icon: shallowRef(CodeBrackets)
                    },
                    {
                        title: 'Versioning',
                        text: 'Kestra workflows are automatically versioned, helping track changes and rollback to previous versions if needed.',
                        icon: shallowRef(Git)
                    },
                    {
                        title: 'CI/CD Integration',
                        text: 'Kestra integrates with Terraform, GitLab, and GitHub Actions to automate the deployment of data workflows to production environments.',
                        icon: shallowRef(Github)
                    },
                    {
                        title: 'Software Engineering Best Practices',
                        text: 'Kestra embraces software engineering best practices, promoting high-quality and reliable data pipelines.',
                        icon: shallowRef(OneUp)
                    },
                ]
            }
        },
    }
</script>