<template>
    <ul class="list-unstyled">
        <li class="list-inline-item">
            <a href="https://github.com/kestra-io" target="_blank">
                <github title="" />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://twitter.com/kestra_io" target="_blank">
                <twitter title="" />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://www.linkedin.com/company/kestra" target="_blank">
                <linkedin />
            </a>
        </li>
        <li class="list-inline-item ml-1">
            <a href="https://kestra.io/slack" target="_blank">
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

    export default {
        components: {Github, Slack, Twitter, Linkedin}
    }
</script>
