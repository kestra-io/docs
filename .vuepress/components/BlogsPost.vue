<template>
    <div>
        <!-- Hero Start -->
        <section class="bg-half d-table w-100"
                 :style="{backgroundImage: 'url(' + $page.frontmatter.image + ')'}"
        >
            <div class="bg-overlay"></div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="page-next-level">
                            <h4 class="title text-white title-dark">{{ $page.title }}</h4>
                            <div class="page-next">
                                <nav aria-label="breadcrumb" class="d-inline-block">
                                    <ul class="breadcrumb bg-white rounded shadow mb-0">
                                        <li class="breadcrumb-item">
                                            <router-link to="/">Kestra</router-link>
                                        </li>
                                        <li class="breadcrumb-item"><a href="/blogs">Blog</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">
                                            {{ $page.title }}
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </section>
        <!--end section-->
        <div class="position-relative">
            <div class="shape overflow-hidden text-white">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
        <div class="theme-default-content">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BlogsPost',
        components: {},
        computed: {},
        mounted() {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
/deep/ .content__default {
    margin-top: 1rem;
}
</style>