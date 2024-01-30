<template>
    <div>
        <Head>
            <Title>Join Us and Shape the Future of Orchestration Software</Title>
            <Meta name="description"
                  content="Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of orchestration software"/>
        </Head>

        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Developer Advocate</h1>
            </div>
        </div>
        <template v-if="slug === '/careers/'">
            <CareersPositions/>
            <CareersPerks/>
        </template>
        <div v-else class="container bd-gutter mt-3 my-md-4 bd-layout">
            <article class="bd-main order-1">
                <ContentDoc />
            </article>
        </div>
        <CareersApply :title="title"/>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()

    const route = useRoute()
    const slug = "/careers/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const title = ref();

    if (slug === '/careers/') {
        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary-large-image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: "Join Us and Shape the Future of Orchestration Software" },
                {
                    name: 'twitter:description',
                    content: "Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of orchestration software"
                },
                { name: 'twitter:image', content: `${origin}/landing/careers/header.svg` },
                {
                    name: 'twitter:image:alt',
                    content: "A square with circles inside with emojis in It representing Kestra's inclusive and dynamic workplace culture"
                }
            ]
        })
    } else {
        const {data, error} = await useAsyncData(`Careers-Page-Item-${slug}`, () => {
            try {
                return queryContent(slug).findOne();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });

        if (error && error.value) {
            throw error.value;
        }

        useContentHead(data.value)

        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary-large-image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: data.value.title },
                { name: 'twitter:description', content: data.value.description },
                { name: 'twitter:image:alt', content: data.value.title }
            ]
        })

        title.value = data.value.title;
    }

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .header-container {
        padding-top: 6rem;
        background: url("/landing/careers/bg.svg") no-repeat bottom;
        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);

            h1 {
                color: $white;
                text-align: center;
                font-weight: 300;
                margin-bottom: 0;
                font-size: $font-size-4xl;

                @include media-breakpoint-down(sm) {
                    font-size: 1.875rem !important;
                }

                span {
                    background: linear-gradient(90deg, #E151F7 58.97%, #5C47F5 85.36%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }

    }
</style>
