<template>
    <div class="oss-quotes-container">
        <button class="navigation navigation-left" @click="scrollLeft"><ArrowLeftIcon/></button>
        <button class="navigation navigation-right" @click="scrollRight"><ArrowRightIcon/></button>
        <div class="oss-quotes" ref="wrapper">
            <template v-for="quote, index in randomizedQuotes" :key="quote.text">
                <div class="quote-separator" v-if="index > 0"/>
                <div class="quote" >
                    <quote class="quote-text">“{{ quote.text }}“</quote>
                    <div class="quote-author"><b>{{ quote.author.name }}</b><span>{{ quote.author.title }}</span></div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue"
import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"

const wrapper = ref<HTMLElement | null>(null)

const {data:randomizedQuotes} = await useAsyncData('randomizedQuotes', () => {
    return import('@/data/oss-quotes.json').then((quotes: any) => quotes.default.sort(() => Math.random() - 0.5))
})

const scrollLeft = () => {
    if(wrapper.value){
        wrapper.value.scrollTo({left:wrapper.value.scrollLeft - 400, behavior: 'smooth'})
    }
}

const scrollRight = () => {
    if(wrapper.value){
        wrapper.value.scrollTo({left:wrapper.value.scrollLeft + 400, behavior: 'smooth'})
    }
}
</script>

<style lang="scss" scoped>
    .oss-quotes {
        display: flex;
        flex-wrap: nowrap;
        padding: 2rem 4rem;
        background-color: #f7F7F8;
        gap: 2rem;
        overflow: auto;

        scrollbar-width: none;
        .quote {
            min-width: 260px;
            min-height: 270px;
            display: flex;
            flex-direction: column;
            .quote-text {
                color: #3D3D3F;
                flex: 1;
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

    }

    .oss-quotes-container{
        position: relative;
        .navigation{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: black;
            color: white;
            border-radius: 50%;
            &-left{
                left: 1rem;
            }
            &-right{
                right: 1rem;
            }
        }
    }
</style>