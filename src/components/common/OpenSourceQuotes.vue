<template>
    <QuotesCarousel :quotes="quotes">
        <template #default="{ quote }">
            <div v-if="quote" class="quote">
                <q class="quote-text" :title="quote.text">{{ quote.text }}</q>
                <div class="quote-author">
                    <b>{{ quote.author.name }}</b>
                    <span>{{ quote.author.title }}</span>
                </div>
            </div>
        </template>
    </QuotesCarousel>
</template>

<script setup lang="ts">
    import QuotesCarousel from "~/components/layout/QuotesCarousel.vue"

    const quotes = [
        {
            text: "I want to congratulate everyone involved in this project - it's amazing! I've been running some proof-of-concept tests to evaluate Kestra for my company's needs, and it seems to be a perfect fit. I work for a biotech software development company where flexibility in executing workflows is key.",
            author: { name: "Diego O.", title: "Software Engineer" },
        },
        {
            text: "Compared to Airflow Kestra seems to be a more appropriate tool to use. I would really like to see it listed more often in the tech stack requirements for data engineering roles",
            author: { name: "Karina K.", title: "Data Engineer" },
        },
        {
            text: "What I really like about Kestra is that I can quickly put stuff together with YAML instead of having to write out and improve again and again on Python code.",
            author: { name: "Martha S.", title: "Data Scientist" },
        },
        {
            text: "Kestra is amazing and checks all the boxes for a single platform to do everything I want to do!",
            author: { name: "Jake K.", title: "Software Developer" },
        },
        {
            text: "Kestra has been a keystone to design complex executions flows while enhancing our Infrastructure as Code best practices.",
            author: { name: "Antoine B.", title: "Data & Analytics Engineer" },
        },
        {
            text: "'m transitioning because I like Kestra platform. I'm loving it!",
            author: { name: "Christian P.", title: "Data Leader" },
        },
        {
            text: "It's funny, you don't notice pain points when something is SO MUCH BETTER than what you are currently using.",
            author: { name: "Jason M.", title: "Software Engineer" },
        },
        {
            text: "Very simple, great user experience, I had a terrible experience with Airflow.",
            author: { name: "Remi S.", title: "Data Engineer" },
        },
        {
            text: "it's great product with a fantastic web UI: it's extremely approachable and clear, and I love the yaml declarative approach!",
            author: { name: "Noelle C.", title: "Intervention Specialist" },
        },
        {
            text: "After looking around and playing with some other tools I like Kestra because of the ability to maintain it using Terraform.",
            author: { name: "Robert D.", title: "Senior Software Engineer" },
        },
        {
            text: "We are implementing Kestra as a better alternative to Apache AirFlow and cron.",
            author: { name: "Kristjan K.", title: "Data Warehouse Manager" },
        },
        {
            text: "I love Kestra, easy to use, easy to introduce to the team.",
            author: { name: "Marco V.", title: "Tech Lead" },
        },
        {
            text: "Thanks to Kestra I've been able to orchestrate Cloudquery imports in a multi-tenant scenario. That has been incredibly useful actually.",
            author: { name: "Matthew D.", title: "Chief System Architect" },
        },
        {
            text: "We migrated our backend for data transformation to Kestra. Mostly for better monitoring and execution tracking.",
            author: { name: "Eren B.", title: "Machine Learning Engineer" },
        },
        {
            text: "Our data capability has grown to the point of needing some solid orchestration and Kestra is a perfect fit.",
            author: { name: "Alex B.", title: "Data Analyst" },
        },
        {
            text: "We tested it with colleagues and we love Kestra! Our stack will be based on dlt/dbt/clickhouse and Kestra.",
            author: { name: "Andy M.", title: "Data Architect" },
        },
        {
            text: "I'm machine learning engineer and I use Kestra to build my AI workflows. My hope is to give it more structure and also to build more stable products with it.",
            author: { name: "Markus O.", title: "Machine Learning Engineer" },
        },
        {
            text: "We use Kestra to orchestrate account provisioning and data tasks, so easy to get started! We already have some data scraping stuff in Kestra too that runs on schedules.",
            author: { name: "Gideon S.", title: "DevOps Engineer" },
        },
        {
            text: "We had some experiments done on Kestra and we are impressed. We will implement it in production in coming months.",
            author: { name: "Surya K.", title: "Senior Software Engineer" },
        },
        {
            text: "I was thinking about Rundeck. But your solution provides more flexibility.",
            author: { name: "Denis K.", title: "MLops Engineer" },
        },
        {
            text: "We have an existing automated trading system running in Prefect version 2 that needs upgrading to 3, and Kestra seems way more simple.",
            author: { name: "Simon R.", title: "Director" },
        },
        {
            text: "I Love Kestra! It allows me to focus on the hard problems and the interesting part of my work without having to spend time on boring and repetitive tasks.",
            author: { name: "Samuel B.", title: "Data Engineer" },
        },
        {
            text: "Orchestrating and monitoring complex systems has never been easier thanks to the beautiful web interface",
            author: { name: "Jack K.", title: "Software Developer" },
        },
        {
            text: "Kestra takes the best of Airflow and Google Workflows in one simple and elegant solution. It scales and integrates itself easily in any ecosystem thanks to the plugins library",
            author: { name: "Eddy A.", title: "Lead DevOps" },
        },
        {
            text: "I came across Kestra while searching for a low-code orchestration solution and I'm enjoying it!",
            author: { name: "Rodolfo R.", title: "Lead Salesforce Manager" },
        },
    ].toSorted(() => Math.random() - 0.5)
</script>

<style lang="scss" scoped>
    .quote {
        min-width: 260px;
        .quote-text {
            display: -webkit-box;
            -webkit-line-clamp: 6;
            line-clamp: 6;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 150px;
        }
        .quote-author {
            text-align: right;
            white-space: nowrap;
            b {
                display: block;
            }
        }
    }
</style>