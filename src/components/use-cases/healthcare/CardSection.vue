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

    const challengesTitle = `<span>Key Benefits</span> of Using Kestra for<br/> Healthcare Workflows`
    const cardsData = [
        {
            icon: RefreshAuto,
            cardInfo: {
                title: "Healthcare  Data Management",
                description:
                    "Automates the integration and management of patient data from various sources, ensuring that records are always updated and accurate.",
            },
        },
        {
            icon: CommentQuoteOutline,
            cardInfo: {
                title: "Genomic Data Processing",
                description:
                    "Process large volumes of genomic data quickly and accurately. Kestra automates sequencing workflows and data analysis, significantly cutting down processing times and minimizing errors,",
            },
        },
        {
            icon: ChartBellCurve,
            cardInfo: {
                title: "Regulatory Compliance",
                description:
                    "Automate the generation of compliance reports, access logs, and data usage reports. Ensure  compliance with regulatory standards reducing the risk of breaches and improving data governance.",
            },
        },
        {
            icon: FileChartOutline,
            cardInfo: {
                title: "Predictive Analytics",
                description:
                    " Integrates your workflows with machine learning models and analytics platforms to utilize patient data for predictive analytics.",
            },
        },
        {
            icon: ImageFilterCenterFocus,
            cardInfo: {
                title: "Streamlined Data Management",
                description:
                    "Centralize your fragmented data workflow into a unified control plane, thereby simplifying orchestration and improving efficiency.",
            },
        },
    ]
</script>