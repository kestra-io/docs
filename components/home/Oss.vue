<template>
    <div class="container">
        <h2 class="title-block">
            <span class="gradient">Open Source</span>
            Workflow Orchestration Platform
        </h2>

        <a class="btn btn-primary" href="#">Kestra Live Demo</a>

        <div class="features">
            <div v-for="feature in features" :key="feature.title" class="feature">
                <component :is="feature.icon" class="icon"/>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {markRaw} from "vue";
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
</script>

<style lang="scss" scoped>
    .container{
        padding: 2rem;
        text-align: center;
    }

    .title-block{
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 2rem;
        span{
            display: block;
            // font color gradient from #8C4BFF to #FF6A00
            background: linear-gradient(90deg, #8C4BFF 0%, #6fb0ff 100%) no-repeat center;
            background-size: 500px;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .features{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        margin-top: 2rem;
        background-color: #f7f7f8;
        padding: 2rem 0;
        border-radius: 10px;
        border: 1px solid #e1e1e1;
    }

    .feature{
        padding: 1rem 2rem 0;
        border-right: 1px solid #e1e1e1;
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
            border-right: none;
        }
    }
</style>