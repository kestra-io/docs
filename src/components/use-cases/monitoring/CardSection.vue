<template>
    <CardSection :titleHtml="challengesTitle" :cardsData="cardsData" />
</template>

<script setup>
    import CardSection from "~/components/use-cases/CardSection.vue"
    import MathLog from "vue-material-design-icons/MathLog.vue"
    import AlertCircle from "vue-material-design-icons/AlertCircle.vue"
    import Speedometer from "vue-material-design-icons/Speedometer.vue"
    import ToyBrickPlus from "vue-material-design-icons/ToyBrickPlus.vue"
    import Cogs from "vue-material-design-icons/Cogs.vue"

    const challengesTitle = `<span>Key Benefits</span> of Using Kestra for<br/> Alerting`
    const cardsData = [
        {
            icon: MathLog,
            cardInfo: {
                title: "Log Management",
                description:
                    "Collect, analyze, and visualize log data to  troubleshoot issues effectively.",
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
            icon: Speedometer,
            cardInfo: {
                title: "Rapid Response",
                description:
                    "Alerts and automated incident response workflows ensure quick resolution of issues.",
            },
        },
        {
            icon: ToyBrickPlus,
            cardInfo: {
                title: "Extensibility",
                description:
                    "Use built-in plugins or create custom plugins to seamlessly integrate with popular monitoring tools and services.",
            },
        },
        {
            icon: Cogs,
            cardInfo: {
                title: "Reduce Manual Effort",
                description:
                    "Automate monitoring and alerting processes, allowing your team to focus on strategic initiatives.",
            },
        },
    ]
</script>