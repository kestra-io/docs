<template>
    <div class="text-center">
        <div class="btn-group mt-5 mb-5">
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
