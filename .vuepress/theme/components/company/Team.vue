<script>
import {
    TwitterIcon,
    GithubIcon,
    LinkedinIcon,
} from "vue-feather-icons";

export default {
    props: {
        teamData: {
            type: Array,
            default: [],
        },
    },
    components: {
        GithubIcon,
        TwitterIcon,
        LinkedinIcon,
    },
    data() {
        return {};
    },
};
</script>

<template>
    <div class="row">
        <div
            class="col-lg-3 col-md-6 mt-4 pt-2"
            v-for="(item, index) in teamData"
            :key="index"
        >
            <div class="card team text-center border-0 pt-4 pb-4" data-aos="fade-right">
                <div class="position-relative">
                    <img
                        :src="`${item.image}`"
                        class="img-fluid avatar avatar-ex-large rounded-circle shadow"
                        alt=""
                    />
                    <ul class="list-unstyled social-icon team-icon mb-0 mt-4">
                        <li class="list-inline-item mr-1" v-for="(url, social) in item.socials">
                            <a :href="url" class="rounded">
                                <templace :is="social + '-icon'" class="fea icon-sm fea-social"></templace>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card-body py-3 px-0 content">
                    <h5 class="mb-0">
                        <a href="javascript:void(0)" class="name text-dark">{{
                                item.name
                            }}</a>
                    </h5>
                    <small class="designation text-muted">{{ item.designation }}</small>
                </div>
            </div>
        </div>
        <!--end col-->
    </div>
</template>