<template>
    <div>
        <section class="bg-half text-white d-table w-100" >
            <div class="container">
                <div class="bg-overlay" :style="backgroundStyles" />
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="page-next-level">
                            <h1> {{ $page.title }} </h1>
                            <div class="page-next">
                                <nav aria-label="breadcrumb" class="d-inline-block">
                                    <ul class="breadcrumb bg-white rounded shadow mb-0">
                                        <li class="breadcrumb-item">
                                            <router-link to="/">Kestra</router-link>
                                        </li>
                                        <li v-for="(url, name) in links" class="breadcrumb-item">
                                            <router-link v-if="url" :to="url">{{ name }}</router-link>
                                            <template v-else>{{ name }}</template>
                                        </li>
                                        <li class="breadcrumb-item active" aria-current="page">{{ $page.title }}</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
import Shape from "./Shape";

export default {
    components: {
        Shape
    },
    props: {
        links: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        backgroundStyles() {
            return {backgroundImage: 'url(' + (this.$page.frontmatter.image || require('../../assets/layout/bg.jpg')) + ')'}
        }
    }
}
</script>

<style lang="scss" scoped>
@import ".vuepress/theme/styles/variables";

.bg-half {
    padding: 90px 0;
    background-color: $primary;
}

.bg-overlay {
    background-size: cover;
    background-position: 100%;
}
</style>
