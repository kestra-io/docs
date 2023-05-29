<template>
    <ul class="list-unstyled">
        <li class="list-inline-item">
            <a href="https://github.com/kestra-io" title="GitHub" target="_blank">
                <github title="" />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://twitter.com/kestra_io" title="Twitter" target="_blank">
                <twitter title="" />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://www.linkedin.com/company/kestra" title="LinkedIn" target="_blank">
                <linkedin />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://www.youtube.com/@kestra-io" title="YouTube" target="_blank">
                <youtube />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://kestra.io/slack" title="Slack" target="_blank">
                <slack title="" />
            </a>
        </li>
    </ul>
</template>

<script>
    import Linkedin from "vue-material-design-icons/Linkedin.vue";
    import Twitter from "vue-material-design-icons/Twitter.vue";
    import Slack from "vue-material-design-icons/Slack.vue";
    import Github from "vue-material-design-icons/Github.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";

    export default {
        components: {Github, Slack, Twitter, Linkedin, Youtube}
    }
</script>
