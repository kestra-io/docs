<template>
    <CardSection :titleHtml="challengesTitle" :cardsData="cardsData" />
</template>

<script setup>
    import CardSection from "~/components/use-cases/CardSection.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import CommentQuoteOutline from "vue-material-design-icons/CommentQuoteOutline.vue"
    import ChartBellCurve from "vue-material-design-icons/ChartBellCurve.vue"
    import FileChartOutline from "vue-material-design-icons/FileChartOutline.vue"
    import ImageFilterCenterFocus from "vue-material-design-icons/ImageFilterCenterFocus.vue"

    const challengesTitle = `Use Cases in <span>Automotive</span>`
    const cardsData = [
        {
            icon: RefreshAuto,
            cardInfo: {
                title: "Predictive Maintenance",
                description:
                    "Use Kestra to orchestrate data from sensors and IoT devices, triggering maintenance workflows based on predictive analytics to reduce downtime and maintenance costs.",
            },
        },
        {
            icon: CommentQuoteOutline,
            cardInfo: {
                title: "Data Gathering",
                description:
                    "From multiple car dealerships to  warehouses, maintain financial health and operational transparency of all your suppliers or ressellers from a single place.",
            },
        },
        {
            icon: ChartBellCurve,
            cardInfo: {
                title: "Quality Control Automation",
                description:
                    "Automate quality control processes by orchestrating data from various stages of the manufacturing or supply process, ensuring real-time defect detection and quality assurance.",
            },
        },
        {
            icon: FileChartOutline,
            cardInfo: {
                title: "Inventory Management",
                description:
                    "Manage  vast inventory across numerous dealerships. Automated workflows handle data collection, processing, and analysis, enabling real-time inventory tracking and optimization.",
            },
        },
        {
            icon: ImageFilterCenterFocus,
            cardInfo: {
                title: "Delivery Alerting",
                description:
                    "Automate car delivery alerts, ensuring customers are notified promptly when their vehicle or package is ready for pickup. ",
            },
        },
    ]
</script>