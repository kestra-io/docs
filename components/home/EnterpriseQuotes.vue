<template>
    <HomeQuotes :quotes="randomizedQuotes">
        <template v-slot:default="{quote}">
            <div class="quote" >
                <q class="quote-text" :title="quote.quote">{{ quote.quote }}</q>
                <div class="quote-author"><b>{{ quote.author.name }}</b> <span>{{ quote.author.title }}</span></div>
                <img :src="quote.logo" alt="Company Logo" />
            </div>
        </template>
    </HomeQuotes>
</template>

<script lang="ts" setup>
 const {data:randomizedQuotes} = await useAsyncData('randomizedQuotes', () => {
    return import('@/data/enterprise-quotes.json').then((quotes: any) => quotes.default.sort(() => Math.random() - 0.5))
})
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .quote {
        min-width: 260px;
        display: flex;
        flex-direction: column;
        .quote-text {
            color: #3D3D3F;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            margin-bottom: 1rem;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 150px;
            line-clamp: 6;
        }
        .quote-author {
            font-size: 1rem;
            white-space: nowrap;
            span {
                color: #646465;
            }
        }
    }
</style>