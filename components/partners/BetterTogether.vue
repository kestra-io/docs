<template>
    <div class="container">
        <Section
            title="What our Partners Love About Kestra"
            subtitle="Reasons to integrate with Kestra"
        >
            <div class="row">
                <div class="col-md-4 testimonials-item">
                    <TestimonialsItem
                        :item="testimonialData[0]"
                        data-aos="fade-left"
                    />
                </div>
                <div class="col-md-4 testimonials-item">
                    <TestimonialsItem
                        :item="testimonialData[1]"
                        data-aos="zoom-in"
                    />
                </div>
                <div class="col-md-4 testimonials-item">
                    <TestimonialsItem
                        :item="testimonialData[2]"
                        data-aos="fade-right"
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
import Section from "../layout/Section.vue";
import TestimonialsItem from "../home/TestimonialsItem.vue";

export default {
    components: { Section, TestimonialsItem },
    data() {
        return {
            testimonialData: [
                {
                    profile: "/partners/chris-tata.svg",
                    message:
                        "Airbyte and Kestra share a common vision: to simplify data pipeline creation. This partnership brings together the strengths of two leading data management companies, so our customers can get the most out of their data and achieve their business goals.",
                    name: "Chris Tata",
                    designation: "Head of Partnerships @ Airbyte",
                    alt: "Picture of Chris Tata",
                },
                {
                    profile: "/partners/adrian-brudaru.svg",
                    message:
                        "Kestra and dlt share a vision of simplifying data pipeline creation. Thanks to Kestra's and dlt's declarative interface, you can deploy existing pipelines in seconds or build new ones in minutes, complete with self healing schemas and lineage to increase robustness and trust.",
                    name: "Adrian Brudaru",
                    designation: "Co-Founder @ dlthub",
                    alt: "Picture of Adrian Brudaru",
                },
                {
                    profile: "/partners/charles-letaillieur.svg",
                    message:
                        "Kestra offers an elegant solution to the pain points we face in the data transformation projects of our customers: monitoring, management and maintenance of large-scale data flows.What sets Kestra apart is not only its open-source community but also its seamless integration with modern data stack tools like Airbyte and Restack. We are genuinely thrilled to engage Kestra.",
                    name: "Charles Letaillieur",
                    designation: "Senior Manager @ Converteo",
                    alt: "Picture of Charles Letaillieur",
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .row {
        align-items: center;
        justify-content: center;
    }

    :deep(.card-body) {
        padding: calc($spacer * 2);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 420px;

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
