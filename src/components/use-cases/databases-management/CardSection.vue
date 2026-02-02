<template>
    <CardSection :titleHtml="challengesTitle" :cardsData="cardsData" />
</template>

<script setup>
    import CardSection from "~/components/use-cases/CardSection.vue"
    import Cogs from "vue-material-design-icons/Cogs.vue"
    import ArchiveSync from "vue-material-design-icons/ArchiveSync.vue"
    import TimerCogOutline from "vue-material-design-icons/TimerCogOutline.vue"
    import ChartAreaspline from "vue-material-design-icons/ChartAreaspline.vue"
    import CloudRefreshVariant from "vue-material-design-icons/CloudRefreshVariant.vue"

    const challengesTitle = "Overcome Common <br> Databases Management Challenges"

    const cardsData = [
        {
            icon: Cogs,
            cardInfo: {
                title: "Operational Reliability",
                description:
                    "Ensure reliable database operations with automated backups and restoration workflows.",
            },
        },
        {
            icon: ArchiveSync,
            cardInfo: {
                title: "Data Archiving",
                description:
                    "Automate the archiving of historical data to ensure secure storage and easy retrieval when needed.",
            },
        },
        {
            icon: TimerCogOutline,
            cardInfo: {
                title: "Increase Efficiency",
                description:
                    "Automate repetitive tasks, allowing your team to concentrate on strategic initiatives.",
            },
        },
        {
            icon: ChartAreaspline,
            cardInfo: {
                title: "Scalability",
                description:
                    "Easily scale database management processes as your infrastructure grows without compromising performance.",
            },
        },
        {
            icon: CloudRefreshVariant,
            cardInfo: {
                title: "Data Consitency",
                description:
                    "Maintain integrity across all database environments through automated migrations and backups.",
            },
        },
    ]
</script>