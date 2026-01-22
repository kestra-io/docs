<template>
    <SolutionsDetailFeatures subtitle="Key" subtitleAfter="Features" :items="features" />
</template>

<script setup>
    import SolutionsDetailFeatures from "~/components/solutions/DetailFeatures.vue"
    import LightbulbOutline from "vue-material-design-icons/LightbulbOutline.vue"
    import FolderTextOutline from "vue-material-design-icons/FolderTextOutline.vue"
    import DeveloperBoard from "vue-material-design-icons/DeveloperBoard.vue"
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue"
    import TimerOutline from "vue-material-design-icons/TimerOutline.vue"
    import ImageMultiple from "vue-material-design-icons/ImageMultiple.vue"

    const features = [
        {
            title: "Efficient Data Capture",
            text: "CDC allows you to track and capture data changes promptly, ensuring that your data pipelines remain current and provide you with accurate, actionable insights.",
            icon: LightbulbOutline,
        },
        {
            title: "Integration with Data Sources",
            text: "Integrates with various data sources, databases, and platforms, allowing you to track changes across your entire data ecosystem.",
            icon: FolderTextOutline,
        },
        {
            title: "Scalable Processing",
            text: "Kestra is designed to handle high data volumes and can scale to meet your growing data needs.",
            icon: DeveloperBoard,
        },
        {
            title: "Reduced Data Latency",
            text: "Reduce data latency, ensuring that your data pipelines and analytics are always based on the latest information.",
            icon: LightningBolt,
        },
        {
            title: "Data Versioning",
            text: "Allow you to track and manage historical versions of your data for auditing, analysis, and compliance purposes.",
            icon: TimerOutline,
        },
        {
            title: "Delayed Data Capture",
            text: "Configure time delays for capturing data changes for handling time-sensitive data or for mitigating the impact of temporary data inconsistencies.",
            icon: ImageMultiple,
        },
    ]
</script>