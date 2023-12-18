<template>
    <div class="main">
        <Head>
            <Title>{{ data.header.title }}</Title>
            <Meta name="description" :content="data.header.description" />
        </Head>
        <div>
            <HeaderCard :content="data.header" />
            <Line class='divider-md'/>
            <Examples :content="data.drafts" />
            <Line class="mb-0" />
            <Write :content="data.write" />
            <Line class="mt-0 mb-0" />
            <Process :content="data.process" />
            <Faqs :content="data.faqs" />
            <Line />
            <Footer :content="data.footer" />
        </div>
    </div>
</template>

<script setup>
import community from "~/data/community.js";

import Examples from "~/components/use-cases/Examples.vue";
import Footer from "~/components/use-cases/Footer.vue";
import Line from "~/components/use-cases/Line.vue";
import HeaderCard from "~/components/use-cases/Card.vue";

import Faqs from "~/components/write-for-us/Faqs.vue";
import Process from "~/components/write-for-us/Process.vue";
import Write from "~/components/write-for-us/Write.vue";

const data = { ...community };
</script>

<style scoped lang="scss">
@import "../assets/styles/variable";

.main {
    background-color: #111113;
    color: $white;
    font-weight: 300;
}

.line-margin {
    margin-top: 5rem;
    margin-bottom: 5rem;
}
</style>
