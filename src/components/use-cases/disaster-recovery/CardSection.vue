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

    const challengesTitle = "<span>Key Benefits</span> of Using Kestra for<br/> Disaster Recovery"
    const cardsData = [
        {
            icon: Cogs,
            cardInfo: {
                title: "Minimize Data Loss",
                description:
                    "Regular automated backups ensure that your data is always protected and recoverable.",
            },
        },
        {
            icon: AlertCircle,
            cardInfo: {
                title: "Reduce Downtime",
                description:
                    "Automated failover and restoration processes minimize downtime and ensure business continuity.",
            },
        },
        {
            icon: TimerCogOutline,
            cardInfo: {
                title: "Data Security",
                description: "Secure backup storage and automated recovery processes",
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
                title: "Increase Efficiency",
                description: "Automate disaster recovery workflows, reducing manual intervention.",
            },
        },
    ]
</script>