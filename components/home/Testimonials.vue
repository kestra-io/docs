<template>
    <div class="container">
        <Section
            title="What people say about us"
            subtitle="They love Kestra"
        >
            <div class="row">
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[0]" data-aos="fade-left" />
                </div>
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[1]" data-aos="zoom-in" />
                    <TestimonialsItem :item="testimonialData[2]" data-aos="zoom-in" />
                </div>
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[3]" data-aos="fade-right" />
                </div>
            </div>

        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import TestimonialsItem from './TestimonialsItem.vue';

    export default {
        components: {Section, TestimonialsItem},
        data() {
            return {
                testimonialData: [
                    {
                        profile: "/landing/home/testimonials/alex.jpg",
                        message: "Kestra is a product designed to facilitate the work of Ops & Data Engineers! The possibilities offered by the application are exponential, thanks to the many plugins that come out regularly.\n" +
                            "Whatever the size of the organization that implements this solution, it has all the latitude to decide to keep control of its production plan or to leave sufficient autonomy to its employees to carry out their processing operations.\n" +
                            "This application is really capable of supporting the growth of the company thanks to a complete and controlled scalability!",
                        name: "Alexandre Millet-Bassez",
                        link: "https://www.linkedin.com/in/alexandre-m-618399103/",
                        designation: "Ntico",
                        alt: "Picture of Alex testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/fares.jpeg",
                        message: "It's been great. Easy to use and very powerful, it does everything I need, and orchestrating flows has never been easier. It has also become such an integral part of our work thanks to a good documentation to help quickly gain technical knowledge.",
                        name: "Fares Daoud",
                        link: "https://www.linkedin.com/in/faresdaoudofficiel/",
                        designation: "Logic@l Conseils",
                        alt: "Picture of Fares testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/mourad.jpg",
                        message: "Kestra is very easy to learn, with a large number of features covering a large number of use cases (scheduled workflows, API calls, triggers, flow synchronization, data and file transfers, etc.).\n"+
                            "The Web interface facilitates the monitoring of flows and log consolidation.\n"+
                            "New features are added very regularly in response to need. Kestra is evolving rapidly.",
                        name: "Mourad Bouloussa",
                        link: "https://www.linkedin.com/in/mourad-bouloussa-541146191/",
                        designation: "Sopra Steria",
                        alt: "Picture of Mourad testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/ousama.jpg",
                        message: "The product allows you to build almost anything you want. You can also integrate different types of data (csv, json, txt, Avro) from SFTP server, google bucket, google drive, JDBC database (PostgreSQL, Oracle). The system of tasks is easy to manipulate/use and offers maximum flexibility in development.\n" +
                            "The tool meets the needs perfectly; it’s very simple to use and manages all the complexities behind it to offer a huge saving in time and cost.",
                        name: "Oussama Bakkali",
                        link: "https://www.linkedin.com/in/oussama-bakkali-949708b6/",
                        designation: "Umanis",
                        alt: "Picture of Ousama testimony",
                    }
                ],
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .row {
        align-items: center;
        justify-content: center;
    }

    :deep(.card-body) {
        padding: calc($spacer * 2);

        &:before {
            content: "“";
            font-size: 10rem;
            color: var(--bs-primary);
            position: absolute;
            margin-top: -3.5rem;
            margin-left: -0.5rem;
        }

        p {
            margin-top: calc($spacer * 3.5);
        }

        .footer {
            img {
                border-radius: 50%;
                float: left;
                margin-right: $spacer;
            }

            span {
                font-size: $font-size-sm;
                float: left;
            }
        }

    }
</style>