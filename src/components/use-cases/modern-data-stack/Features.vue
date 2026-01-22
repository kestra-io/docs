<template>
    <SolutionsDetailFeatures subtitle="Key" subtitleAfter="Features" :items="features" />
</template>

<script setup>
    import SolutionsDetailFeatures from "~/components/solutions/DetailFeatures.vue"
    import FileCodeOutline from "vue-material-design-icons/FileCodeOutline.vue"
    import ArrowDecisionAutoOutline from "vue-material-design-icons/ArrowDecisionAutoOutline.vue"
    import ToyBrickOutline from "vue-material-design-icons/ToyBrickOutline.vue"
    import Connection from "vue-material-design-icons/Connection.vue"
    import OpenInApp from "vue-material-design-icons/OpenInApp.vue"
    import CloudCheckOutline from "vue-material-design-icons/CloudCheckOutline.vue"

    const features = [
        {
            title: "Declarative Language",
            text: "Easily define and manage data workflows using YAML, which simplifies the integration process with modern data stack tools.",
            icon: FileCodeOutline,
        },
        {
            title: "Workflow Orchestration",
            text: "Execute tasks sequentially, in parallel, or conditionally, providing better control and flexibility while working with various data stack components.",
            icon: ArrowDecisionAutoOutline,
        },
        {
            title: "Extensibility",
            text: "Use built-in plugins or create custom plugins to seamlessly integrate with popular data stack tools and services.",
            icon: ToyBrickOutline,
        },
        {
            title: "Connectivity",
            text: "Connect to popular data sources and cloud services such as AWS, GCP, Azure, Snowflake, and more.",
            icon: Connection,
        },
        {
            title: "Rich & real-time UI",
            text: "Create, execute, and manage data workflows using an intuitive user interface, making it easier to work with modern data stack tools.",
            icon: OpenInApp,
        },
        {
            title: "Cloud-Native",
            text: "Kestra's cloud-native architecture ensures seamless scaling and compatibility with modern data stack tools.",
            icon: CloudCheckOutline,
        },
    ]
</script>