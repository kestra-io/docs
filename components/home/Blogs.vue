<template>
    <div class="container">
        <Section subtitle="blog" title="What’s new at Kestra ?">
            <div class="row">
                <template v-for="i in [...Array(3).keys()]">

                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="/og-image.jpg" class="card-img-top rounded" alt="">
                            <div class="card-body">
                                <p class="type mt-3 mb-2">News & Product Updates</p>
                                <h5 class="card-title">
                                    Powerful Data Processing
                                </h5>
                                <p class="card-text">
                                    Execute complex data processing without the need for extensive coding skills
                                </p>
                                <p class="author">
                                    Ludovic Dehon  1 week ago - 5 min reading
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="text-center">
                <a class="btn btn-lg btn-primary " href="/blogs">See all news</a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .card-body {
        padding: 0;

        .type {
            font-size: $font-size-sm;
            color: $primary;
        }

        .author {
            font-size: $font-size-sm;
            color: $gray-500;
        }
    }
</style>