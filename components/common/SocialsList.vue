<template>
    <div>
        <strong class="h6 my-2 title text-white">Contribute</strong>
        <nav class="social mt-1">
            <ul>
                <li v-if="page.editLink !== false && editLink">
                    <a class="text-white" :href="editLink" target="_blank">
                        <Github />
                        Edit this page
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://kestra.io/slack" target="_blank">
                        <Slack />
                        Join us on Slack
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://www.youtube.com/@kestra-io" target="_blank">
                        <Youtube />
                        YouTube
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://github.com/kestra-io/kestra" target="_blank">
                        <Github />
                        GitHub
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://twitter.com/kestra_io" target="_blank">
                        <twitter />
                        Twitter
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://web-cdn.bsky.app/profile/kestra.io" target="_blank">
                        <BlueSky />
                        BlueSky
                    </a>
                </li>
                <li>
                    <a class="text-white" href="https://www.linkedin.com/company/kestra" target="_blank">
                        <linkedin />
                        LinkedIn
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup>
    import Slack from "vue-material-design-icons/Slack.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";
    import Github from "vue-material-design-icons/Github.vue";
    import Linkedin from "vue-material-design-icons/Linkedin.vue";
    import Twitter from "../components/icons/TwitterXIcon.vue";
    import BlueSky from "../components/icons/BlueSkyIcon.vue";

    const props = defineProps({
        page: {
            type: Object,
            default: {},
        },
    });

    const editLink = computed(() => {
        if (!props.page.stem || !props.page.extension) {
            return false;
        }
        return `https://github.com/kestra-io/kestra.io/edit/main/content/${props.page.stem}.${props.page.extension}`;
    });
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    strong {
        margin-left: calc($spacer * 2);
    }
    nav {
        @include font-size($font-size-xs);
        line-height: 1.188rem;

        ul {
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;

            li {
                a {
                    padding-left: 2rem;

                    &:hover,
                    &.active {
                        color: var(--bs-primary);
                        font-weight: 500;
                        border-left: 1px solid $purple-35;
                    }
                }
            }
        }
    }

    .h6 {
        color: var(--bs-gray-700);
        font-size: $font-size-sm;
        line-height: 1.875rem;
        font-weight: 600;
    }

    .social ul li a {
        line-height: 1.5rem;
        font-size: $font-size-sm;
    }

    a {
        display: block;
        padding: 0.125rem 0.75rem;
        color: inherit;
        text-decoration: none;
        color: var(--bs-gray-700);
    }
</style>
