<template>
    <div class="container-fluid">
        <div class="container">
            <Section
                subtitle-before="Loved"
                subtitle="by"
            >
                <p class="subtitle" data-aos="fade-right">our users</p>
                <div  data-aos="fade-left">
                    <Carousel v-bind="settings" :breakpoints="breakpoints">
                        <Slide v-for="slide in testimonialData" :key="slide">
                            <div class="carousel--item">
                                <TestimonialsItem :item="slide" />
                            </div>
                        </Slide>
                        <template #addons>
                            <navigation>
                                <template #next>
                                    <div class="carousel-control carousel-control-next">
                                        <ArrowRight />
                                    </div>
                                </template>
                                <template #prev>
                                    <div class="carousel-control carousel-control-prev">
                                        <ArrowLeft />
                                    </div>
                                </template>
                            </navigation>
                        </template>
                    </Carousel>
                </div>
            </Section>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import TestimonialsItem from './TestimonialsItem.vue';
    import ArrowLeft from "vue-material-design-icons/ArrowLeft.vue";
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
    import 'vue3-carousel/dist/carousel.css'
    export default {
        components: {
            Section,
            TestimonialsItem,
            ArrowLeft,
            ArrowRight,
        },
        data() {
            return {
                settings: {
                    itemsToShow: 1,
                    snapAlign: 'center',
                },
                breakpoints: {
                    768: {
                        itemsToShow: 2,
                        snapAlign: 'start',
                    },
                    1024: {
                        itemsToShow: 3,
                        snapAlign: 'start',
                    },
                },
                testimonialData: [
                    {
                        profile: "/landing/home/testimonials/julien.jpeg",
                        message: "Kestra is the unifying layer for our data and workflows. You can start small, but then there is no limit to the possibilities and scalability of such an open architecture.",
                        name: "Julien Henrion",
                        link: "https://www.linkedin.com/in/julien-henrion-b007b416/",
                        designation: "Head of Data Engineering @ Leroy Merlin",
                        alt: "Picture of Julien testimony",
                        imgName: 'leroymerlin',
                    },
                    {
                        profile: "/landing/home/testimonials/patrick.jpeg",
                        message: "The exceptional pre-sales support and commitment to providing a high-performance product have laid the foundation for a great partnership.",
                        name: "Patrick Ferreira",
                        link: "https://www.linkedin.com/in/simon-barbier-4b97a5192/",
                        designation: "Product Manager @ CleverConnect",
                        alt: "Picture of Patrick testimony",
                        imgName: 'cleverconnect',
                    },
                    {
                        profile: "/landing/home/testimonials/mourad.jpg",
                        message: "I'd like to say the product is fantastic! I love it so far! I heard about it during a dbt event in Sydney!",
                        name: "Ohad Srur",
                        link: "https://au.linkedin.com/in/ohad-srur-11b06225",
                        designation: "Co-Founder @ EduBI Analytics",
                        alt: "Picture of Ohad testimony",
                        imgName: 'analytics',
                    },
                    {
                        profile: "/landing/home/testimonials/ousama.jpg",
                        message: "Congratulation, it’s a really great product!",
                        name: "Rubén Bonil Martínez",
                        link: "https://es.linkedin.com/in/rub%C3%A9n-bonil-mart%C3%ADnez-2b49a44b",
                        designation: "Software Architect @ Quadis",
                        alt: "Picture of Ruben testimony",
                        imgName: 'quadis',
                    },
                    {
                        profile: "/landing/home/testimonials/michael.jpeg",
                        message: "Kestra is the first exciting thing I’ve seen in a long time.I’ve spent a huge part of my career looking for a solution that handle huge data sets.",
                        name: "Michael Reynolds",
                        link: "https://www.linkedin.com/in/michael-reynolds-a0a32a28/",
                        designation: "Lead Research Engineer @ Two Six Labs",
                        alt: "Picture of Michael testimony",
                        imgName: 'twosix',
                    },
                    {
                        profile: "/landing/home/testimonials/yohann.jpeg",
                        message: "I enjoy the overall robustness of Kestra, which allows for processing data at scale in cloud environments and ensures the reproducibility of processes.",
                        name: "Yohann Nédélec",
                        link: "https://www.linkedin.com/in/yohann-n%C3%A9d%C3%A9lec-9b367685/",
                        designation: "Tech Lead, Bioinformatician",
                        alt: "Picture of Yohann testimony",
                        imgName: 'bioinformatician'
                    },
                    {
                        profile: "/landing/home/testimonials/samuelb.jpg",
                        message: "it's great product with a fantastic web UI: it's extremely approachable and clear, and I love the yaml declarative approach!",
                        name: "Noelle Chubb",
                        link: "https://www.linkedin.com/in/noelle-chubb-a68141134",
                        designation: "Political Scientist @ IDEA Public Schools",
                        alt: "Picture of Noelle testimony",
                        imgName: 'ideaPublicSchools'
                    },
                    {
                        profile: "/landing/home/testimonials/danielt.jpg",
                        message: "Thank you for your hard work in creating this good software. It is beginner friendly and easy to customize.",
                        name: "Daniel Theodorus",
                        link: "https://www.linkedin.com/in/hamrio/",
                        designation: "IT Project Manager @ Airpaz",
                        alt: "Picture of Daniel testimony",
                        imgName: 'airpazz',
                    },
                    {
                        profile: "/landing/home/testimonials/alex.jpg",
                        message: "I'm transitioning because I like Kestra platform. I'm loving it!",
                        name: "Cristian Pinela",
                        link: "https://www.linkedin.com/in/cristianpinella/",
                        designation: "Data Leader @ Treinta",
                        alt: "Picture of Alex testimony",
                        imgName: 'treinta',
                    },
                    {
                        profile: "/landing/home/testimonials/antoineb.jpg",
                        message: "Kestra has been a keystone to design complex executions flows while enhancing our Infrastructure as Code best practices.",
                        name: "Antoine Balliet",
                        link: "https://www.linkedin.com/in/antoineballiet/",
                        designation: "Data & Analytics Engineer @ Gorgias",
                        alt: "Picture of Antoine testimony",
                        imgName: 'gorgias',
                    },
                    {
                        profile: "/landing/home/testimonials/antoineb.jpg",
                        message: "I'm very impressed with what your team has here in Kestra. I moved some of my automated jobs over from Apache NIFI to Kestra. Kestra is wayyyy easier to work with because of everything being in the UI.",
                        name: "Jake Kruse",
                        link: "https://www.linkedin.com/in/jake-kruse-608471174/",
                        designation: "Research Assistant @ GeoDS Lab",
                        alt: "Picture of Jake testimony",
                        imgName: 'geoDSLab'
                    }
                ],
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container-fluid {
        background: url("/demo/bg-mask.webp") no-repeat bottom;
        background-size: 100% 100%;
        padding-top: 8rem;
        @include media-breakpoint-down(lg) {
            padding-top: 4rem;
        }
        @include media-breakpoint-down(md) {
            padding-top: 2rem;
        }
        @include media-breakpoint-down(sm) {
            padding-top: 0;
        }
        .subtitle {
            color: var(--Kestra-io-Token-color-white, #FFF);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 400;
            line-height: calc($spacer * 3.125);

            @include media-breakpoint-down(sm) {
                font-size: calc($font-size-base * 1.875);
                line-height: calc($spacer * 1.875);
            }
        }
    }

    .container {
        :deep(section) {
            padding: 0;
            padding-bottom: 4rem;
            .subtitle, .subtitle p {
                margin: 0 !important;
                text-align: left !important;

                @include media-breakpoint-down(sm) {
                    line-height: calc($spacer * 1.875);
                }
            }

            .main {
                padding-top: 0;
            }
        }

        .carousel {
            margin-top: 3rem;
        }

        .carousel--item {
            height: 100%;
            padding: 0 8px;
        }

        .carousel-control {
            border-radius: 50%;
            width: 44px;
            height: 44px;
            background: $black;
            margin: auto;

            &-prev {
                left: -60px;
            }

            &-next {
                right: -60px;
            }

            @include media-breakpoint-down(xxl) {
                &-prev {
                    left: -26px;
                }

                &-next {
                    right: -26px;
                }

            }

            .material-design-icon {
                font-size: $font-size-xl;
                color: $white;
                height: 18px;
            }
        }

        .row {
            align-items: center;
            justify-content: center;
        }
    }
</style>
