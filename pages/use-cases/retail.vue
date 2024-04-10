<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <RetailCard :content="header" />
        <Line />
        <NuxtLazyHydrate when-visible>
            <UseCasesExamples :content="solutions" />
            <Line />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LeroyMerlin :content="leroy" />
            <Line />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <RetailOps :content="ops" />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <Plugins :content="plugins" />
            <Line />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <Footer :content="footer" />
        </NuxtLazyHydrate>
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
    background-color: $black-4;
    color: $white;
    font-weight: 300;
}
</style>
