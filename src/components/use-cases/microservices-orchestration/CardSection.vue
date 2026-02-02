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

    const challengesTitle = `<span>Key Benefits</span> of Using Kestra for<br/> Microservices Orchestration`
    const cardsData = [
        {
            icon: Cogs,
            cardInfo: {
                title: "Flexible Integration",
                description:
                    "Integrate seamlessly with various tools and platforms, providing a unified orchestration solution.",
            },
        },
        {
            icon: AlertCircle,
            cardInfo: {
                title: "Minimize Errors",
                description:
                    "Ensure reliable communication and coordination between microservices, reducing the risk of errors and downtime.",
            },
        },
        {
            icon: TimerCogOutline,
            cardInfo: {
                title: "Increase Efficiency",
                description:
                    "Automate routine tasks and workflows, allowing your team to focus on strategic development",
            },
        },
        {
            icon: ChartAreaspline,
            cardInfo: {
                title: "CI/CD Pipelines",
                description:
                    "Automate continuous integration and continuous deployment pipelines, ensuring smooth and reliable releases of microservices.",
            },
        },
        {
            icon: CloudRefreshVariant,
            cardInfo: {
                title: "Data Synchronization",
                description:
                    "Ensure data consistency across microservices by orchestrating data synchronization workflows.",
            },
        },
    ]
</script>