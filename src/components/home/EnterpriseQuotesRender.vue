<template>
    <HomeQuotes :quotes="sorted">
        <template v-slot:default="{ quote }">
            <div class="quote">
                <q class="quote-text">{{ quote.text }}</q>
                <div class="quote-author">
                    <b>{{ quote.author.name }}</b>
                    <span>{{ quote.author.title }}</span>
                </div>
                <NuxtImg
                    v-if="quote.logo && quotesCompaniesLogos[quote.logo]"
                    height="36"
                    :src="quotesCompaniesLogos[quote.logo]"
                    alt="Company Logo"
                />
            </div>
        </template>
    </HomeQuotes>
</template>

<script setup lang="ts">
    import HomeQuotes from "~/components/home/Quotes.vue"
    import { onMounted, ref } from "vue"

    defineProps<{
        quotesCompaniesLogos: Record<string, string>
    }>()

    const quotes = [
        {
            text: "This tool is an absolute game changer for Orchestration: the UI, build quality, architecture and features are top notch. It's by far the easiest tool I've ever set-up, thanks to the excellent documentation and rapid response. It's already revolutionising the way my team works.",
            author: {
                name: "Arthur Mills",
                title: "Senior Data Engineer",
                company: "EssenceMediacom",
            },
            logo: "EssenceMediacom.svg",
        },
        {
            text: "Kestra is the unifying layer for our data and workflows. You can start small, but then there is no limit to the possibilities and scalability of such an open architecture.",
            author: {
                name: "Julien Henrion",
                title: "Head of Data Engineering",
                company: "Leroy Merlin",
            },
            logo: "LeroyMerlin.svg",
        },
        {
            text: "Companies typically don't like to share their secret weapon but everyone in the data world needs to know about Kestra. It has been a pivotal part of giving us flexibility and scalability we need to pull off complex processes we do at Foundation Direct.",
            author: {
                name: "Michael Heidner",
                title: "SVP of Analytics and Business Intelligence",
                company: "Foundation Direct",
            },
            logo: "Foundation.svg",
        },
        {
            text: "The main advantage I see in Kestra is the use of YAML for creating flexible workflows. This allows us to chain pieces of metadata together dynamically, and the user-friendly UI helps our internal users create simple-to-understand inputs for the data pipelines we develop",
            author: {
                name: "Kyle Hanson",
                title: "Lead Software Engineer",
                company: "Axciom",
            },
            logo: "Acxiom.svg",
        },
        {
            text: "We're convinced we chose the right tool. The support and communication are great. Kestra adapts to any tool thanks to its plugins, and it's easy for anyone to understand.",
            author: {
                name: "Ruben Boniz Martinez",
                title: "Team Leader",
                company: "Quadis",
            },
            logo: "quadis.svg",
        },
        {
            text: "Kestra is like the Wizard of Oz Wizard, doing its magic behind the curtain",
            author: {
                name: "Amy King",
                title: "Cybersecurity & Technology Controls",
                company: "JPMorgan Chase & Co.",
            },
            logo: "JP-Morgan-Chase-Co.svg",
        },
        {
            text: "I'm very impressed with what your team has here in Kestra. I moved some of my automated jobs over from Apache NIFI to Kestra. Kestra is way easier to work with because of everything being in the UI.",
            author: {
                name: "Jake Kruse",
                title: "Associate System Consultant",
                company: "Union Pacific RailRoad",
            },
            logo: "Union-Pacific-RailRoad.svg",
        },
        {
            text: "I ported 80% of the prefect workflow in about a week to kestra, learing the syntax as i go […] yeah the yaml definitions make it super approachable.",
            author: {
                name: "Leon Jacobs",
                title: "Purple Team Cybersecurity",
                company: "Orange",
            },
            logo: "Orange.svg",
        },
        {
            text: "I enjoy the overall robustness of Kestra, which allows for processing data at scale in cloud environments and ensures the reproducibility of processes. Its strong observability, ease of development, and flexibility make it a versatile solution for managing data pipelines, including those in the field of genomics.",
            author: {
                name: "Yohann Nédélec",
                title: "Bioinformatician",
                company: "Sophia Genetics",
            },
            logo: "Sophia-Genetics.svg",
        },
        {
            text: "I've been using Kestra on data projects at Sopht, also a french company, and it's been amazing for data processes. The declarative approach really works well for easy scalable contexts.",
            author: {
                name: "Lirav Duvashni",
                title: "CEO",
                company: "DataFlooder",
            },
            logo: "DataFlooder.svg",
        },
        {
            text: "Kestra’s UI and speed of development is brilliant. Very quick to prototype a new pipeline, continuously iterate, and test things out. Love the replay feature. It has very clear separation of pipeline and processing code.",
            author: {
                name: "Ollie Steiner",
                title: "Senior Data Engineer",
                company: "Vyoma Space",
            },
            logo: "Vyoma-Space.svg",
        },
        {
            text: "I’ve been really enjoying Kestra! It’s been much simpler to use than building Airflow DAGs or using Prefect, the plugins are incredibly handy.",
            author: {
                name: "Sophia Alice",
                title: "Senior Data Engineer",
                company: "Political Data",
            },
            logo: "Political-Data.svg",
        },
        {
            text: "Kestra is becoming mission critical.",
            author: {
                name: "Ernesto Vargas",
                title: "CTO",
                company: "Mattilda",
            },
            logo: "Mattilda.svg",
        },
        {
            text: "The exceptional pre-sales support and commitment to providing a high-performance product have laid the foundation for a great partnership.",
            author: {
                name: "Pattrick Ferreira",
                title: "Product Manager",
                company: "Clever Connect",
            },
            logo: "CleverConnect.svg",
        },
        {
            text: "Kestra is the first exciting thing I’ve seen in a long time.I’ve spent a huge part of my career looking for a solution that handle huge data sets.",
            author: {
                name: "Michael Reynolds",
                title: "Lead Research Engineer",
                company: "TwoSix Labs",
            },
            logo: "TwoSix.svg",
        },
        {
            text: "Thank you for your hard work in creating this good software. It is beginner friendly and easy to customize.",
            author: {
                name: "Daniel Theodorus",
                title: "IT Project Manager",
                company: "Airpaz",
            },
            logo: "Airpaz.svg",
        },
        {
            text: "I'd like to say the product is fantastic! I love it so far! […] With Kestra we run git pull, build dbt models, and run Elementary reports and send a notification over Slack for the Elementary report, and it’s a breeze!",
            author: {
                name: "Ohad Srur",
                title: "Co-Founder",
                company: "EduBI Analytics",
            },
            logo: "EduBIAnalytics.svg",
        },
        {
            text: "Kestra is an easy-to-learn, feature-rich platform for a wide variety of use cases. Its web interface simplifies flows and logs monitoring. ",
            author: {
                name: "Mourad Bouloussa",
                title: "Principal Engineer",
                company: "SopraSteria",
            },
            logo: "SopraSteria.svg",
        },
        {
            text: "Kestra meets the needs perfectly, it’s very simple to use and manages the complexities behind it to offer a huge saving in time and costs.",
            author: {
                name: "Oussama Bakkali",
                title: "Data Engineer",
                company: "ADEO Services",
            },
            logo: "ADEOServices.svg",
        },
        {
            text: "Easy to use and very powerful, it does everything I need, and orchestrating flows has never been easier.",
            author: {
                name: "Fares Daoud",
                title: "Data Engineer",
                company: "Decathlon",
            },
            logo: "Decathlon.svg",
        },
        {
            text: "With Kestra, I got started in minutes, no complex deployment, no rate limits, no lock-in to Python. Triggers, logs, multi-language support, it all just works. Compared to Prefect, Kestra feels like everything is in the right place.",
            author: {
                name: "John Sturgeon",
                title: "Software Engineer",
                company: "Apple",
            },
            logo: "Apple.svg",
        },
        {
            text: "Kestra is really capable of supporting the growth of the company thanks to complete and controlled scalability!",
            author: {
                name: "Alexandre Millet-Bassez",
                title: "Senior Data Manager",
                company: "Ntico",
            },
            logo: "Ntico.svg",
        },
        {
            text: "Kestra has changed how we handle data orchestration. Instead of spending days fixing issues, we now have full visibility and control. As we scale, having a system that grows with us is invaluable",
            author: {
                name: "John Kim",
                title: "IT Lead",
                company: "Fila",
            },
            logo: "Fila.svg",
        },
        {
            text: "I don't want my teams to have to write Python. That's why I'm more interested in Kestra than Airflow",
            author: {
                name: "",
                title: "Cybersecurity & Technology Controls",
                company: "JPMorgan Chase & Co.",
            },
            logo: "JP-Morgan-Chase-Co.svg",
        },
    ]
    const sorted = ref<Array<any>>([])

    onMounted(() => {
        sorted.value = quotes.sort(() => Math.random() - 0.5)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .quote {
        width: 350px;
        min-width: 350px;
        display: flex;
        flex-direction: column;
        align-items: start;

        .quote-text {
            color: #3d3d3f;
            margin-bottom: 1rem;
            min-height: 150px;
        }

        .quote-author {
            display: flex;
            gap: 6px;
            font-size: 1rem;
            white-space: normal;

            span {
                color: #646465;
            }
        }

        > img {
            margin: 0;
            margin-top: 1rem;
        }
    }
</style>