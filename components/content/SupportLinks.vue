<template>
    <h2 class="support-title">{{ title }}</h2>
    <div class="support-links-row">
        <a v-for="(button, index) in buttons" :key="button.label" :href="button.href" class="support-link">
            <component :is="button.icon" />
            <h3>{{ button.label }}</h3>
            <p>{{ button.description }}</p>
        </a>
    </div>
</template>

<script setup lang="ts">
import GithubIcon from 'vue-material-design-icons/Github.vue';
import SlackIcon from 'vue-material-design-icons/Slack.vue';
import LifebuoyIcon from 'vue-material-design-icons/Lifebuoy.vue';

defineProps<{
    title: string
}>()

const buttons = [{
    label: "Community Slack",
    description: "Discuss topics with other users and kestra Team",
    href: "https://kestra.io/slack",
    icon: SlackIcon,
},
{
    label: "GitHub",
    description: "Give our open-source project a star",
    href: "https://github.com/kestra-io/kestra",
    icon: GithubIcon,
},
{
    label: "Help Center",
    description: "Contact support for help with your Enterprise account",
    href: "https://kestra.io/demo",
    icon: LifebuoyIcon,
}]
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";

h2.support-title{
    border: none;
    font-size: $font-size-xl;
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding: 0;
    font-weight: 600;
}
.support-links-row{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 3rem;
}
.support-link{
    padding: 1rem;
    border-radius: .5rem;
    border: 1px solid $black-3;
    span{
        font-size: 24px;
        color: $white;
        margin-bottom: 1rem;
    }
    h3{
        font-size: $font-size-lg;
        padding: 0;
        margin: 0
    }
    p{
        margin-top: .5rem;
        font-size: $font-size-sm;
        color: $white-1;
        line-height: 1.6em;
    }
    &:hover{
        border-color: $primary-1;
    }
}
</style>