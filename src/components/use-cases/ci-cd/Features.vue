<template>
    <SolutionsDetailFeatures subtitle="Key" subtitleAfter="Features" :items="features" />
</template>

<script setup>
    import SolutionsDetailFeatures from "~/components/solutions/DetailFeatures.vue"
    import CodeBrackets from "vue-material-design-icons/CodeBrackets.vue"
    import OneUp from "vue-material-design-icons/OneUp.vue"
    import Git from "vue-material-design-icons/Git.vue"
    import Github from "vue-material-design-icons/Github.vue"

    const features = [
        {
            title: "Workflows as Code",
            text: "Define and manage data workflows using YAML configuration, which opens data workflows to more people in your organization.",
            icon: CodeBrackets,
        },
        {
            title: "Versioning",
            text: "Kestra workflows are automatically versioned, helping track changes and rollback to previous versions if needed.",
            icon: Git,
        },
        {
            title: "CI/CD Integration",
            text: "Kestra integrates with Terraform, GitLab, and GitHub Actions to automate the deployment of data workflows to production environments.",
            icon: Github,
        },
        {
            title: "Software Engineering Best Practices",
            text: "Kestra embraces software engineering best practices, promoting high-quality and reliable data pipelines.",
            icon: OneUp,
        },
    ]
</script>