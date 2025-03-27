<template>
    <HomeQuotes :quotes="randomizedQuotes">
        <template v-slot:default="{quote}">
            <div class="quote" >
                <q class="quote-text" :title="quote.quote">{{ quote.quote }}</q>
                <div class="quote-author"><b>{{ quote.author.name }}</b> <span>{{ quote.author.title }}</span></div>
                <NuxtImg v-if="quote.logo" height="36" :src="quote.logo" alt="Company Logo" />
            </div>
        </template>
    </HomeQuotes>
</template>

<script lang="ts" setup>
 const {data:randomizedQuotes} = await useAsyncData('randomizedQuotes-ee', () => {
    return import('@/data/enterprise-quotes.json').then((quotes: any) => quotes.default.sort(() => Math.random() - 0.5))
})
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .quote {
        width: 350px;
        min-width: 350px;
        display: flex;
        flex-direction: column;
        align-items: start;

        .quote-text {
            color: #3D3D3F;
            margin-bottom: 1rem;
            min-height: 150px;
        }
        .quote-author {
            font-size: 1rem;
            white-space: nowrap;
            span {
                color: #646465;
            }
        }
        > img{
            margin: 0;
            margin-top: 1rem;
        }
    }
</style>