<template>
    <HomeQuotes :quotes="randomizedQuotes">
        <template v-slot:default="{quote}">
            <div class="quote" >
                <q class="quote-text" :title="quote.text">{{ quote.text }}</q>
                <div class="quote-author"><b>{{ quote.author.name }}</b><span>{{ quote.author.title }}</span></div>
            </div>
        </template>
    </HomeQuotes>
</template>

<script setup lang="ts">
const {data:randomizedQuotes} = await useAsyncData('randomizedQuotes-oss', () => {
    return import('@/data/oss-quotes.json').then((quotes: any) => quotes.default.sort(() => Math.random() - 0.5))
})
</script>

<style lang="scss" scoped>
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
            text-align: right;
            b {
                white-space: nowrap;
                display: block;
            }
            span {
                color: #646465;
                white-space: nowrap;
            }
        }
    }
    .quote-separator {
        min-width: 1px;
        background-color: #e1e1e1;
    }
</style>