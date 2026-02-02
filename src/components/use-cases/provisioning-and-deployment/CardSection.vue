<template>
    <CardSection :titleHtml="challengesTitle" :cardsData="cardsData" />
</template>

<script setup>
    import CardSection from "~/components/use-cases/CardSection.vue"
    import Cogs from "vue-material-design-icons/Cogs.vue"
    import AlertCircle from "vue-material-design-icons/AlertCircle.vue"
    import TimerCogOutline from "vue-material-design-icons/TimerCogOutline.vue"
    import ChartAreaspline from "vue-material-design-icons/ChartAreaspline.vue"
    import CloudRefreshVariant from "vue-material-design-icons/CloudRefreshVariant.vue"

    const challengesTitle = `<span>Key Benefits</span> of Using Kestra for<br/> Provisioning and Deployment`
    const cardsData = [
        {
            icon: Cogs,
            cardInfo: {
                title: "Reduce Manual Effort",
                description:
                    "Automate repetitive tasks, allowing your team to focus on strategic initiatives.",
            },
        },
        {
            icon: AlertCircle,
            cardInfo: {
                title: "Minimize Errors",
                description:
                    "Automation ensures consistency and accuracy, reducing the likelihood of human errors.",
            },
        },
        {
            icon: TimerCogOutline,
            cardInfo: {
                title: "Increase Efficiency",
                description:
                    "Ensure infrastructure components are provisioned in a standardized manner.",
            },
        },
        {
            icon: ChartAreaspline,
            cardInfo: {
                title: "Scalability",
                description:
                    "Easily scale your infrastructure to meet growing demands without compromising performance or reliability.",
            },
        },
        {
            icon: CloudRefreshVariant,
            cardInfo: {
                title: "Consistency",
                description:
                    "Ensure uniform deployment across all environments, from development to production.",
            },
        },
    ]
</script>