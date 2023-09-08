<template>
  <div class="container">
        <Section
            title="What people say about us"
            subtitle="They love Kestra"
        >
            <div class="row">
                <div class="col-md-4">
                    <HomeTestimonialsItem :item="testimonialData[0]" data-aos="fade-left" />
                    <HomeTestimonialsItem :item="testimonialData[1]" data-aos="fade-left" />
                    <HomeTestimonialsItem :item="testimonialData[2]" data-aos="fade-left" />
                </div>
                <div class="col-md-4">
                    <HomeTestimonialsItem :item="testimonialData[3]" data-aos="zoom-in" />
                    <div class="testimonial-center-card">
                        <HomeTestimonialsItem :item="testimonialData[4]" data-aos="zoom-in" />
                    </div>
                </div>
                <div class="col-md-4">
                    <HomeTestimonialsItem :item="testimonialData[5]" data-aos="zoom-in" />
                    <HomeTestimonialsItem :item="testimonialData[6]" data-aos="fade-right" />
                    <HomeTestimonialsItem :item="testimonialData[7]" data-aos="fade-right" />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
import Section from "../layout/Section.vue";

const testimonialData = ref([
    {
        profile: "/landing/home/testimonials/yohann.jpeg",
        message: "I enjoy the overall robustness of Kestra, which allows for processing data at scale in cloud environments and ensures the reproducibility of processes. Its strong observability, ease of development, and flexibility make it a versatile solution for managing data pipelines and I see great potential for Kestra's application in the genomics field.",
        name: "Yohann Nédélec",
        link: "https://www.linkedin.com/in/yohann-n%C3%A9d%C3%A9lec-9b367685/",
        designation: "Tech Lead, Bioinformatician",
        alt: "Picture of Yohann testimony",
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
        profile: "/landing/home/testimonials/fares.jpeg",
        message: "Easy to use and very powerful, it does everything I need, and orchestrating flows has never been easier.",
        name: "Fares Daoud",
        link: "https://www.linkedin.com/in/simon-barbier-4b97a5192/",
        designation: "Senior Data Engineer @Decathlon",
        alt: "Picture of Fares Daoud",
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
        profile: "/landing/home/testimonials/samuelb.jpg",
        message: "I Love Kestra! It allows me to focus on the hard problems and the interesting part of my work without having to spend time on boring and repetitive tasks. Orchestrating and monitoring complex systems has never been easier thanks to the beautiful web interface. It takes the best of Airflow and Google Workflows in one simple and elegant solution. It scales and integrates itself easily in any ecosystem thanks to the plugins library.",
        name: "Samuel Boisgontier",
        link: "https://www.linkedin.com/in/samuelboisgontier/",
        designation: "Data Engineer @ SFEIR",
        alt: "Picture of Samuel testimony",
    },
    {
        profile: "/landing/home/testimonials/danielt.jpg",
        message: "Thank you for your hard work in creating this good software. It is beginner friendly and easy to customize",
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
        profile: "/landing/home/testimonials/ousama.jpg",
        message: "Kestra meets the needs perfectly, it’s very simple to use and manages the complexities behind it to offer a huge saving in time and costs.",
        name: "Oussama Bakkali",
        link: "https://www.linkedin.com/in/oussama-bakkali-949708b6/",
        designation: "Data Engineer DevOps @ ADEO Services",
        alt: "Picture of Ousama testimony",
    },

])
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.row {
    align-items: start;
    justify-content: center;
}
.testimonial-center-card {
    height: 663px;
}
:deep(.card) {
    height: 100%;
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