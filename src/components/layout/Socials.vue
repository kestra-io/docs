<template>
    <ul class="socials-wrapper list-inline">
        <li>
            <a href="https://github.com/kestra-io" title="GitHub" target="_blank">
                <Github title="" />
            </a>
        </li>
        <li>
            <a href="https://twitter.com/kestra_io" title="Twitter" target="_blank">
                <Twitter />
            </a>
        </li>
        <li>
            <a href="https://web-cdn.bsky.app/profile/kestra.io" title="BlueSky" target="_blank">
                <BlueSky />
            </a>
        </li>
        <li>
            <a href="https://www.linkedin.com/company/kestra" title="LinkedIn" target="_blank">
                <LinkedIn />
            </a>
        </li>
        <li>
            <a href="https://www.youtube.com/@kestra-io" title="YouTube" target="_blank">
                <Youtube />
            </a>
        </li>
        <li>
            <a v-if="mounted" href="https://kestra.io/slack" title="Slack" target="_blank">
                <Slack title="" />
            </a>
        </li>
    </ul>
</template>

<script setup>
    import { ref, onMounted } from "vue"
    import LinkedIn from "vue-material-design-icons/Linkedin.vue"
    import Slack from "vue-material-design-icons/Slack.vue"
    import Github from "vue-material-design-icons/Github.vue"
    import Youtube from "vue-material-design-icons/Youtube.vue"
    import Twitter from "~/components/icons/TwitterXIcon.vue"
    import BlueSky from "~/components/icons/BlueSkyIcon.vue"

    const mounted = ref(false)

    onMounted(() => {
        mounted.value = true
    })
</script>

<style lang="scss" scoped>
    .socials-wrapper {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 1rem;
        list-style: none;

        a {
            font-size: 1.4rem;
        }
    }
</style>