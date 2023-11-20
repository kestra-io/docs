<template>
    <Head>
        <Title>{{ header.title }}</Title>
        <Meta name="description" :content="header.description" />
    </Head>
    <div class="main">
        <div class="container">
            <UseCaseCard :cta="header.cta" :description="header.description">
                <template v-slot:header>
                    <h1>
                        Orchestrate Your <br />Retail Ecosystem <br />with
                        Kestra
                    </h1>
                </template>
            </UseCaseCard>
            <SolutionsDetailFeatures
                :title="solutions.title"
                :items="solutions.items"
            />
            <UseCaseCard :cta="leroy.cta" :description="leroy.description">
                <template v-slot:header>
                    <h4>
                        Leroy Merlin France enabling data <br />mesh
                        architecture and 900% <br />
                        increase in productivity with Kestra:<br />
                    </h4>
                </template>
            </UseCaseCard>
            <UseCasePlugins
                :title="plugins.title"
                :plugins="plugins.items"
                :cta="plugins.cta"
            />
            <UseCaseRetailOps
                :items="ops.items"
                :description="ops.description"
                :header="ops.title"
            />
            <UseCaseFooter />
        </div>
    </div>
</template>

<script>
import retail from "~/data/retail.js";
import UseCaseCard from "~/components/use-cases/Card.vue";
import UseCaseFooter from "~/components/use-cases/Footer.vue";
import UseCasePlugins from "~/components/use-cases/Plugins.vue";
import UseCaseRetailOps from "~/components/use-cases/RetailOps.vue";

export default {
    name: "Retail",

    components: {
        UseCaseCard,
        UseCaseFooter,
        UseCasePlugins,
        UseCaseRetailOps,
    },

    data: () => ({
        ...retail,
    }),
};
</script>

<style scoped lang="scss"></style>
