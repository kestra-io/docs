<template>
    <div class="text-center" v-if="show">
        <div class="btn-group mt-5 mb-3">
            <a class="btn btn-twitter" :href="`https://twitter.com/intent/tweet?text=${title}&url=${url}`" target="_blank">
                <twitter-icon class="fea icon-sm fea-social"></twitter-icon>
                &nbsp;Tweet
            </a>

            <a class="btn btn-linkedin" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`" target="_blank">
                <linkedin-icon class="fea icon-sm fea-social"></linkedin-icon>
                &nbsp;Share
            </a>

            <a class="btn btn-facebook" :href="`http://www.facebook.com/sharer.php?u=${url}&title=${title}`" target="_blank">
                <facebook-icon class="fea icon-sm fea-social"></facebook-icon>
                &nbsp;Share
            </a>
        </div>
        <script src="https://giscus.app/client.js"
                data-repo="kestra-io/kestra"
                data-repo-id="MDEwOlJlcG9zaXRvcnkyMDQxNjQzNTM="
                data-category="General"
                data-category-id="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDEyMTEw"
                data-mapping="pathname"
                data-strict="1"
                data-reactions-enabled="1"
                data-emit-metadata="0"
                data-input-position="bottom"
                data-theme="light"
                data-lang="en"
                crossorigin="anonymous"
                async>
        </script>
        <div class="mb-5" />
    </div>
</template>

<script>
import {
    TwitterIcon,
    LinkedinIcon,
    FacebookIcon,
} from 'vue-feather-icons';

export default {
    components: {
        LinkedinIcon,
        TwitterIcon,
        FacebookIcon
    },
    computed: {
        url() {
            return encodeURIComponent('https://kestra.io/' + this.$page.regularPath);
        },
        title() {
            return encodeURIComponent(this.$page.title);
        },
        show() {
            return this.$page.regularPath.includes('/docs') ? false : true
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    color: white;
    &:hover {
        color: white;
    }
}

.btn-twitter {
    background-color: #3c94e4;
    &:hover {
        background-color: darken(#3c94e4, 10%);
    }
}

.btn-linkedin {
    background-color: #0077b5;
    &:hover {
        background-color: darken(#0077b5, 10%);
    }
}

.btn-facebook {
    background-color: #3b579c;
    &:hover {
        background-color: darken(#3b579c, 10%);
    }
}

</style>
