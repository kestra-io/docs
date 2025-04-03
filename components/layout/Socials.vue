<template>
    <ul class="list-unstyled">
        <li class="list-inline-item">
            <a href="https://github.com/kestra-io" title="GitHub" target="_blank">
                <Github title="" />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://twitter.com/kestra_io" title="Twitter" target="_blank">
                <Twitter />
            </a>
        </li>
        <li>
            <a href="https://web-cdn.bsky.app/profile/kestra.io" title="BlueSky" target="_blank">
                <BlueSky />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://www.linkedin.com/company/kestra" title="LinkedIn" target="_blank">
                <LinkedIn />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://www.youtube.com/@kestra-io" title="YouTube" target="_blank">
                <Youtube />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://kestra.io/slack" title="Slack" target="_blank">
                <Slack title="" />
            </a>
        </li>
    </ul>
</template>

<script setup>
    import LinkedIn from "vue-material-design-icons/Linkedin.vue";
    import Slack from "vue-material-design-icons/Slack.vue";
    import Github from "vue-material-design-icons/Github.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";
    import Twitter from "../icons/TwitterXIcon.vue";
    import BlueSky from "../icons/BlueSkyIcon.vue";
</script>
