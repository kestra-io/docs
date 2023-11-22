<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <UseCaseCard :cta="header.cta" :description="header.description" />
        <UseCasesExamples :items="solutions.items" />
        <UseCaseLeroyMerlin
            :cta="leroy.cta"
            :description="leroy.description"
            :icon='leroy.icon'
            :alt='leroy.alt'
            descr-class="fs-6"
        />

        <UseCaseRetailOps
            :items="ops.items"
            :description="ops.description"
            :header="ops.title"
        />

        <UseCasePlugins
            :title="plugins.title"
            :plugins="plugins.items"
            :cta="plugins.cta"
        />

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

export default {
    name: "Retail",

    components: {
        UseCaseCard,
        UseCaseFooter,
        UseCasePlugins,
        UseCaseRetailOps,
        UseCaseLeroyMerlin,
        UseCaseExamples,
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
