<template>
    <div class="container-fluid">
        <div class="container">
            <Section
                subtitle-before="Loved"
                subtitle="by the"
            >
                <p class="subtitle" data-aos="fade-right">open-source community</p>
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
    import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
    export default {
        components: {
            Section,
            TestimonialsItem,
            ArrowLeft,
            ArrowRight,
            Carousel,
            Slide,
            Pagination,
            Navigation,
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
                    },
                    {
                        profile: "/landing/home/testimonials/patrick.jpeg",
                        message: "The exceptional pre-sales support and commitment to providing a high-performance product have laid the foundation for a great partnership.",
                        name: "Patrick Ferreira",
                        link: "https://www.linkedin.com/in/simon-barbier-4b97a5192/",
                        designation: "Product Manager @ CleverConnect",
                        alt: "Picture of Patrick testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/mourad.jpg",
                        message: "Kestra is an easy-to-learn, feature-rich platform for a wide variety of use cases. Its web interface simplifies flows and logs monitoring.",
                        name: "Mourad Bouloussa",
                        link: "https://www.linkedin.com/in/mourad-bouloussa-541146191/",
                        designation: "Senior Data Engineer @ Sopra Steria",
                        alt: "Picture of Mourad testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/ousama.jpg",
                        message: "Kestra meets the needs perfectly, it’s very simple to use and manages the complexities behind it to offer a huge saving in time and costs.",
                        name: "Oussama Bakkali",
                        link: "https://www.linkedin.com/in/oussama-bakkali-949708b6/",
                        designation: "Data Engineer DevOps @ ADEO Services",
                        alt: "Picture of Ousama testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/michael.jpeg",
                        message: "I’ve spent a huge part of my career looking for a solution that handle huge data sets for semi-technicals users and Kestra is the first exciting thing I’ve seen in a long time.",
                        name: "Michael Reynolds",
                        link: "https://www.linkedin.com/in/michael-reynolds-a0a32a28/",
                        designation: "Lead Research Engineer @ Two Six Labs",
                        alt: "Picture of Michael testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/yohann.jpeg",
                        message: "I enjoy the overall robustness of Kestra, which allows for processing data at scale in cloud environments and ensures the reproducibility of processes. Its strong observability, ease of development, and flexibility make it a versatile solution for managing data pipelines, including those in the field of genomics.",
                        name: "Yohann Nédélec",
                        link: "https://www.linkedin.com/in/yohann-n%C3%A9d%C3%A9lec-9b367685/",
                        designation: "Tech Lead, Bioinformatician",
                        alt: "Picture of Yohann testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/samuelb.jpg",
                        message: "I Love Kestra! It allows me to focus on the hard problems and the interesting part of my work without having to spend time on boring and repetitive tasks. Orchestrating and monitoring complex systems has never been easier thanks to the beautiful web interface. It takes the best of Airflow and Google Workflows in one simple and elegant solution. It scales and integrates itself easily in any ecosystem thanks to the plugins library.",
                        name: "Samuel Boisgontier",
                        link: "https://www.linkedin.com/in/samuelboisgontier/",
                        designation: "Data Engineer @ SFEIR",
                        alt: "Picture of Samuel testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/danielt.jpg",
                        message: "Thank you for your hard work in creating this good software. It is beginner friendly and easy to customize.",
                        name: "Daniel Theodorus",
                        link: "https://www.linkedin.com/in/hamrio/",
                        designation: "IT Project Manager @ Airpaz",
                        alt: "Picture of Daniel testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/alex.jpg",
                        message: "Kestra is really capable of supporting the growth of the company thanks to a complete and controlled scalability!",
                        name: "Alexandre Millet-Bassez",
                        link: "https://www.linkedin.com/in/alexandre-m-618399103/",
                        designation: "Product Owner @ Ntico",
                        alt: "Picture of Alex testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/antoineb.jpg",
                        message: "Kestra has been a keystone to design complex executions flows while enhancing our Infrastructure as Code best practices. It now empowers our ingestion with Airbyte, transformation with dbt and our HighTouch reverse-ETL jobs seamlessly!",
                        name: "Antoine Balliet",
                        link: "https://www.linkedin.com/in/antoineballiet/",
                        designation: "Data & Analytics Engineer @ Gorgias",
                        alt: "Picture of Antoine testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/antoineb.jpg",
                        message: "I'm very impressed with what your team has here in Kestra. I started sharing it more and more at my company and I still need to work through a few things but have moved some of my automated jobs over from Apache NIFI to Kestra and it's working great. Also I tried Apache Airflow prior to learning about Kestra and wow, Kestra is wayyyy easier to work with because of everything being in the UI.",
                        name: "Jake Kruse",
                        link: "https://www.linkedin.com/in/jake-kruse-608471174/",
                        designation: "Research AssistantResearch Assistant @ GeoDS Lab, Department of Geography · Full-time",
                        alt: "Picture of Antoine testimony",
                    }
                ],
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container-fluid {
        background: url("/demo/bg-mask.svg") no-repeat bottom;
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
            font-weight: 300;
            line-height: calc($spacer * 3.125);

            @include media-breakpoint-down(sm) {
                font-size: calc($font-size-base * 1.875);
                line-height: calc($spacer * 1.875);
            }
        }
    }
    .container {
        :deep(section) {
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
