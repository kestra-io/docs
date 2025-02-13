<template>
    <div>
        <Head>
            <Title>Join Us and Shape the Future of Orchestration Software</Title>
            <Meta name="description"
                  content="Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of orchestration software"/>
        </Head>

        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">{{ title }}</h1>
                <NuxtLink :href="'mailto:jobs@kestra.io?subject=' + title " class="btn btn-animated btn-purple-animated mt-4" data-aos="zoom-in">
                    Apply for this job
                </NuxtLink>
            </div>
        </div>
        <template v-if="slug === '/careers/'">
            <CareersPositions/>
            <CareersPerks/>
        </template>
        <div v-else class="container bd-gutter mt-3 my-md-4 bd-layout">
            <article class="bd-main order-1">
                <ContentRenderer :value="page"/>
            </article>
        </div>
        <LayoutFooterContact
            title="Join our team"
            subtitle="Interested in joining us but not able to find what you are looking for? Let's talk anyway. Write to us at"
            purpleButtonText="Apply for this job"
            :purpleButtonHref="'mailto:jobs@kestra.io?subject=' + title "
        />
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()

    const route = useRoute()
    const slug = "/careers/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const title = ref();

    const page = ref(null);

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
                { name: 'twitter:image', content: `${origin}/og-image.png` },
                { name: 'twitter:image:alt', content: "About-Us" },
                { property: 'og:title', content: "Join Us and Shape the Future of Orchestration Software" },
                {
                  property: 'og:description',
                  content: "Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of orchestration software"
                },
                { property: 'og:image', content: `${origin}/og-image.png` },
                { property: 'og:image:type', content: "image/svg+xml" },
                { property: 'og:image:alt', content: "Join Us and Shape the Future of Orchestration Software" },
            ]
        })
    } else {
        const {data:page, error} = await useAsyncData(`Careers-Page-Item-${slug}`, () => {
            try {
                return queryCollection("careers").path(slug).first();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });

        if (error && error.value) {
            throw error.value;
        }

        page.value.image = `${origin}/og-image.png`

        useContentHead(page)

        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary-large-image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: page.value.title },
                { name: 'twitter:description', content: page.value.description },
                { name: 'twitter:image:alt', content: page.value.title },
                { name: 'twitter:image', content: `${origin}/og-image.png` },
                { name: 'twitter:image:alt', content: "About-Us" },
                { property: 'og:title', content: page.value.title },
                { property: 'og:description', content: page.value.description },
                { property: 'og:image', content: `${origin}/og-image.png` },
                { property: 'og:image:type', content: "image/svg+xml" },
                { property: 'og:image:alt', content: page.value.title },
            ]
        })

        title.value = page.value.title;
    }

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        :deep(h2 > a) {
            color: $white;
        }

        :deep(li > a) {
            color: $purple-35;
        }

        :deep(.bd-main) .alert p {
            color: inherit;
        }
    }

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
