<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <RetailCard :content="header" />
        <Line style="padding: 3rem 0 3rem 0" />
        <UseCasesExamples :items="solutions.items" />
        <Line class="mt-5" />
        <LeroyMerlin :content="leroy" />
        <Line />
        <RetailOps :content="ops" />
        <Plugins :content="plugins" />
        <Line class="mb-5" />
        <Footer class="mb-5" :content="footer" />
    </div>
</template>

<script>
import retail from "~/data/retail.js";
import RetailCard from "~/components/use-cases/Card.vue";
import Footer from "~/components/use-cases/Footer.vue";
import Plugins from "~/components/use-cases/Plugins.vue";
import RetailOps from "~/components/use-cases/RetailOps.vue";
import LeroyMerlin from "~/components/use-cases/LeroyMerlin.vue";
import Examples from "~/components/use-cases/Examples.vue";
import Line from "~/components/use-cases/Line.vue";

export default {
    name: "Retail",

    components: {
        Line,
        RetailCard,
        Examples,
        Footer,
        LeroyMerlin,
        Plugins,
        RetailOps,
    },

    data: () => ({
        ...retail,
    }),
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.main {
    background-color: #111113;
    color: $white;
    font-weight: 300;
}
</style>
