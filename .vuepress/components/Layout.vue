<template>
    <div class="theme-container landing">
        <Navbar />

        <main class="page">
            <slot name="top" />

            <div class="container" v-if="container">
                <Content class="theme-default-content custom" />
            </div>
            <div v-else>
                <Content class="theme-default-content custom" />
            </div>

            <slot name="bottom" />

            <Footer />
        </main>

    </div>
</template>

<script>
    import Home from '@vuepress/theme-default/components/Home.vue'
    import Navbar from '@vuepress/theme-default/components/Navbar.vue'
    import Page from '@vuepress/theme-default/components/Page.vue'
    import PageEdit from '@vuepress/theme-default/components/PageEdit.vue'

    export default {
        name: 'Layout',
        components: {
            Home,
            Page,
            Navbar,
            PageEdit
        },
        props: {
            container: {
                type: [ Boolean ],
                default: true
            },
        },
        computed: {


        },
        mounted () {

        },
        methods: {

        }
    }
</script>

<style lang="scss">
@import '../styles/index.scss';
</style>
