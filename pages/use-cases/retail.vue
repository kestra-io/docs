<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <RetailCard :content="header" />
        <Line class="line-margin" />
        <UseCasesExamples :content="solutions" />
        <Line class="line-margin" />
        <LeroyMerlin :content="leroy" />
        <Line class="line-margin" />
        <RetailOps :content="ops" />
        <Plugins :content="plugins" />
        <Line class="line-margin" />
        <Footer :content="footer" />
    </div>
</template>

<script>
import retail from "~/data/retail.js";

import Examples from "~/components/use-cases/Examples.vue";
import Footer from "~/components/use-cases/Footer.vue";
import Line from "~/components/use-cases/Line.vue";
import LeroyMerlin from "~/components/use-cases/LeroyMerlin.vue";
import Plugins from "~/components/use-cases/Plugins.vue";
import RetailCard from "~/components/use-cases/Card.vue";
import RetailOps from "~/components/use-cases/RetailOps.vue";

export default {
    name: "Retail",

    components: {
        Examples,
        Footer,
        LeroyMerlin,
        Line,
        Plugins,
        RetailCard,
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

.line-margin {
    margin-top: 4rem;
    margin-bottom: 4rem;
}
</style>
