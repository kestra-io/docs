<template>
    <div class="container bd-gutter mt-3 my-md-4 bd-layout">
        <article class="bd-main order-1">
            <ContentRenderer :value="page" class="bd-markdown" />
        </article>
    </div>
</template>

<script setup>
import { CollectionNames } from "~/content.config.names";
const route = useRoute()
const {data: page} = await useAsyncData(
    route.path,
    () => queryCollection(CollectionNames.misc).path(route.path).first()
);
</script>


