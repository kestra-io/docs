<template>
    <div class="oss-bg">
        <div class="container">
            <h2 class="title-block">
                <span class="gradient">Open Source</span>
                Workflow Orchestration Platform
            </h2>

            <a class="btn btn-primary btn-lg" href="https://demo.kestra.io" target="_blank">Kestra Live Demo</a>

            <div class="features">
                <div v-for="feature in features" :key="feature.title" class="feature">
                    <component :is="feature.icon" class="icon"/>
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </div>
            </div>

            <div class="lead-indicators">
                <div v-for="{title, value} of leadIndicators" :key="title" class="lead-indicator">
                    <h3>{{ value }}</h3>
                    <p>{{ title }}</p>
                </div>
            </div>
        </div>
    </div>
    <pre style="background-color: hotpink;">{{ JSON.stringify(numberOfStargazers, null, 2) }}</pre>
    <pre style="background-color: red;" v-if="error">{{ JSON.stringify(error, null, 2) }}</pre>
</template>

<script lang="ts" setup>
    import {markRaw, computed} from "vue";
    import XmlIcon from "vue-material-design-icons/Xml.vue";
    import WebhookIcon from "vue-material-design-icons/Webhook.vue";
    import LockOpenAlertOutlineIcon from "vue-material-design-icons/LockOpenAlertOutline.vue";

    const features = [
        {
            title: "Declarative Orchestration",
            description: "Onboard new team members quickly, and maintain your workflows with minimal effort thanks to Kestra’s declarative syntax.",
            icon: markRaw(XmlIcon),
        },
        {
            title: "Event Based Triggers",
            description: "Configure your workflows to run on a schedule, via webhooks, APIs, event-based triggers, or in real-time with millisecond latency.",
            icon: markRaw(WebhookIcon),
        },
        {
            title: "No vendor Lock-in",
            description: "Define your flow in YAML from the embedded Code Editor, run them directly from the UI, scale to any infrastructure.",
            icon: markRaw(LockOpenAlertOutlineIcon),
        }
    ]

    // fetch the number of contributors from the GitHub API
    const {data:numberOfContributors} = await useAsyncData('githubContrib', () => {
        return fetch("https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1")
            .then(res => res.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1])

    });

    // fetch the number of stargazers from the GitHub API
    const {data:numberOfStargazers, error} = await useAsyncData('githubStargazers', () => {
        return fetch("https://api.github.com/repos/kestra-io/kestra")
            .then((res) => res.json())
            .then((data) => data.stargazers_count)
    });

    const numberOfStargazersFormatted = computed(() => new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(numberOfStargazers.value).toLowerCase());

    const leadIndicators = computed(() => [
        {title: "Contributors", value: numberOfContributors.value},
        {title: "GitHub Stars", value: numberOfStargazersFormatted.value},
        {title: "Kestra Deployments", value: "70k"},
        {title: "Workflows Executed", value: "300m+"},
    ])
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";
    .oss-bg{
        background-color: white;
        @include media-breakpoint-up(md) {
            padding: 2rem;
        }
    }
    .container{
        padding: 2rem;
        text-align: center;
        z-index: 1;
    }

    h2{
        font-size: 3rem;
        font-weight: 600;
        margin-bottom: 2rem;
        span.gradient{
            display: block;
            // font color gradient from #8C4BFF to #FF6A00
            background: linear-gradient(90deg, #8C4BFF 0%, #6fb0ff 100%) no-repeat center;
            background-size: cover;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .features{
        display: grid;
        @include media-breakpoint-up(xl) {
            grid-template-columns: repeat(3, minmax(350px, 1fr));
            padding: 2rem 0;
        }
        margin-top: 2rem;
        background-color: #f7f7f8;
        border-radius: 10px;
        border: 1px solid #e1e1e1;
    }

    .feature{
        padding: 2rem;
        border-bottom: 1px solid #e1e1e1;
        @include media-breakpoint-up(xl) {
            padding: 1rem 2rem 0;
            border: none;
            border-right: 1px solid #e1e1e1;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;
        .icon{
            margin-bottom: 1.2rem;
            font-size: 32px;
            color: #8250DF;
        }
        h3{
            white-space: nowrap;
        }
        &:last-child{
            border: none;
        }
    }

    .lead-indicators{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        @include media-breakpoint-up(xl) {
            grid-template-columns: repeat(4, 1fr);
        }
        margin-top: 2rem;
        row-gap: 2rem;
        padding: 2rem 0;
    }

    .lead-indicator{
        padding: 1rem;
        @include media-breakpoint-up(sm) {
            padding: 1rem 2rem;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;
        h3{
            font-size: 3rem!important;
            font-weight: 700;
            margin: 0;
            line-height: 3rem;
        }
        p{
            font-size: 1rem;
            line-height: 1rem;
            color: #9C9C9C
        }
        &:nth-child(odd){
            border-right: 1px solid #e1e1e1;
        }
        @include media-breakpoint-up(xl) {
            border-right: 1px solid #e1e1e1;
        }
        &:last-child{
            border-right: none;
        }
    }
</style>