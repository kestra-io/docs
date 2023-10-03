<template>
    <div class="container">
        <Section
            title="What people say about us"
            subtitle="They love Kestra"
        >
            <div class="row">
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[0]" data-aos="fade-left" />
                    <TestimonialsItem :item="testimonialData[1]" data-aos="fade-left" />
                    <TestimonialsItem :item="testimonialData[2]" data-aos="fade-left" />
                </div>
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[4]" data-aos="zoom-in" />
                    <TestimonialsItem :item="testimonialData[5]" data-aos="zoom-in" />
                    <TestimonialsItem :item="testimonialData[6]" data-aos="zoom-in" />
                </div>
                <div class="col-md-4">
                    <TestimonialsItem :item="testimonialData[7]" data-aos="fade-right" />
                    <TestimonialsItem :item="testimonialData[8]" data-aos="fade-right" />
                    <TestimonialsItem :item="testimonialData[9]" data-aos="fade-right" />
                </div>
            </div>

        </Section>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';
    import TestimonialsItem from '~/components/home/TestimonialsItem.vue';

    export default {
        components: {Section, TestimonialsItem},
        data() {
            return {
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
                        profile: "/landing/home/testimonials/simonb.jpeg",
                        message: "In less than a month, with no previous experience in data orchestration, I felt autonomous with my data flows and could collaborate with my teammates. Kestra had become a total necessity for me.",
                        name: "Simon Barbier",
                        link: "https://www.linkedin.com/in/simon-barbier-4b97a5192/",
                        designation: "Data Engineer @ Leroy Merlin",
                        alt: "Picture of Simon testimony",
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
                        profile: "/landing/home/testimonials/danielt.jpeg",
                        message: "Thank you for your hard work in creating this good software. It is beginner friendly and easy to customize",
                        name: "Daniel Theodorus",
                        link: "https://www.linkedin.com/in/hamrio/",
                        designation: "IT Project Manager @ Airpaz",
                        enterpriseLogo: "/landing/enterprises/airpaz.svg",
                        alt: "Picture of Daniel testimony",
                    },
                    {
                        profile: "/landing/home/testimonials/michael.jpeg",
                        message: "I’ve spent a huge part of my career looking for a solution that handle huge data sets for semi-technicals users and Kestra is the first exciting thing I’ve seen in a long time.",
                        name: "Michael Reynolds",
                        link: "https://www.linkedin.com/in/michael-reynolds-a0a32a28/",
                        designation: "Lead Research Engineer @ Two Six Labs",
                        enterpriseLogo: "/landing/enterprises/twosix.svg",
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
                        profile: "/landing/home/testimonials/ousama.jpg",
                        message: "Kestra meets the needs perfectly, it’s very simple to use and manages the complexities behind it to offer a huge saving in time and costs.",
                        name: "Oussama Bakkali",
                        link: "https://www.linkedin.com/in/oussama-bakkali-949708b6/",
                        designation: "Data Engineer DevOps @ ADEO Services",
                        enterpriseLogo: "/landing/enterprises/adeo-services.svg",
                        alt: "Picture of Ousama testimony",
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
                        profile: "/landing/home/testimonials/patrick.jpeg",
                        message: "The exceptional pre-sales support and commitment to providing a high-performance product have laid the foundation for a great partnership.",
                        name: "Patrick Ferreira",
                        link: "https://www.linkedin.com/in/simon-barbier-4b97a5192/",
                        designation: "Product Manager @ CleverConnect",
                        alt: "Picture of Patrick testimony",
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