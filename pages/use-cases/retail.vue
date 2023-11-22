<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <UseCaseCard :cta="header.cta" :description="header.description" />
        <Line class="py-5" />
        <UseCasesExamples :items="solutions.items" />
        <UseCaseLeroyMerlin
            :alt="leroy.alt"
            :cta="leroy.cta"
            :description="leroy.description"
            :icon="leroy.icon"
        />
        <UseCaseRetailOps
            :description="ops.description"
            :header="ops.title"
            :items="ops.items"
        />
        <UseCasePlugins
            :cta="plugins.cta"
            :plugins="plugins.items"
            :title="plugins.title"
        />
        <Line class="py-5" />
        <UseCaseFooter class="mb-5" :cta="footer.cta" :title="footer.title" />
    </div>
</template>

<script>
import retail from "~/data/retail.js";
import UseCaseCard from "~/components/use-cases/Card.vue";
import UseCaseFooter from "~/components/use-cases/Footer.vue";
import UseCasePlugins from "~/components/use-cases/Plugins.vue";
import UseCaseRetailOps from "~/components/use-cases/RetailOps.vue";
import UseCaseLeroyMerlin from "~/components/use-cases/LeroyMerlin.vue";
import UseCaseExamples from "~/components/use-cases/Examples.vue";
import Line from "~/components/use-cases/Line.vue";

export default {
    name: "Retail",

    components: {
        Line,
        UseCaseCard,
        UseCaseExamples,
        UseCaseFooter,
        UseCaseLeroyMerlin,
        UseCasePlugins,
        UseCaseRetailOps,
    },

    data: () => ({
        ...retail,
    }),
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.main {
    background-color: $purple-34;
    color: white;
}
</style>
