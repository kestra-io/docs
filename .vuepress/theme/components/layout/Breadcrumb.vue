<template>
    <div>
        <section class="bg-half text-white d-table w-100"
                 :style="backgroundStyles"
        >
            <div class="container">
                <div class="bg-overlay"></div>
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="page-next-level">
                            <h4 class="title"> {{ $page.title }} </h4>
                            <div class="page-next">
                                <nav aria-label="breadcrumb" class="d-inline-block">
                                    <ul class="breadcrumb bg-white rounded shadow mb-0">
                                        <li class="breadcrumb-item">
                                            <router-link to="/">Kestra</router-link>
                                        </li>
                                        <li v-for="(url, name) in links" class="breadcrumb-item">
                                            <router-link :to="url">{{ name }}</router-link>
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

        <div class="position-relative">
            <div class="shape overflow-hidden text-bg">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>

export default {

    props: {
        links: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        backgroundStyles() {
            return {backgroundImage: 'url(' + (this.$page.frontmatter.image || require('../../assets/home/bg-header.jpg')) + ')'}
        }
    }
}
</script>

<style lang="scss" scoped>

.bg-half {
    padding: 90px 0;
}

</style>
