<template>
    <div v-if="isBannerOpen !== undefined">
        <b-alert :show="isBannerOpen" dismissible class="mb-0 top-banner" @dismissed="onBannerClose()">
            If you like Kestra, <a href="https://github.com/kestra-io/kestra" target="_blank">give us a star on GitHub !</a>
        </b-alert>
        <vsm-menu
            :menu="menu"
            :base-width="380"
            :base-height="400"
            :screen-offset="10"
            element="header"
            handler="hover"
            :class="{'banner-open':isBannerOpen}"
        >
            <template #default="{ item }">
                <div class="wrap-content">
                    <div class="dropdown-menu show">
                        <template v-for="(current, index) of item.items">
                            <router-link class="dropdown-item" :to="current.link">
                                <span :is="current.icon" title="" />
                                <span>{{ current.title }}</span>
                                <span class="desc">{{ current.desc }}</span>
                            </router-link>

                            <div v-if="index !== item.items.length - 1" class="dropdown-divider"></div>
                        </template>
                    </div>
                </div>
            </template>

            <template #title="data">
                <span :is="data.item.icon" />
                <a v-if="data.item.title === 'GitHub'" :href="data.item.href">{{ data.item.title }} <span v-if="stargazers" class="badge badge-dark">{{ stargazersText }} ⭐</span></a>
                <a v-else-if="data.item.href" :href="data.item.href">{{ data.item.title }}</a>
                <span v-else>{{ data.item.title }}</span>
            </template>

            <template #before-nav>
                <!--Image or svg of website logo-->
                <li class="vsm-section logo-section">
                    <router-link to="/">
                        <img src="../../public/logo-white.svg" alt="Kestra" />
                    </router-link>
                </li>
            </template>

            <template #after-nav>
                <li class="vsm-section search-section">
                    <SearchBox />
                </li>
                <vsm-mob>
                    <div class="dropdown-menu show">
                        <template v-for="(item) of menu">
                            <h6 v-if="item.element === 'a'" class="dropdown-header">
                                <span :is="item.icon" title="" />
                                <span>{{ item.title }}</span>
                            </h6>
                            <template v-else>
                                <h6 class="dropdown-header">
                                    <a v-if="item.title === 'GitHub'" :href="item.href">{{ item.title }}
                                        <span v-if="stargazers" data-aos="zoom-out" class="badge badge-dark">
                                        {{ stargazersText }} ⭐
                                    </span>
                                    </a>
                                    <router-link v-else-if="item.attributes.href" :to="item.attributes.href">
                                        <span :is="item.icon" title="" />
                                        <span>{{ item.title }}</span>
                                    </router-link>
                                    <a v-else :href="item.href">
                                        <span :is="item.icon" title="" />
                                        <span>{{ item.title }}</span>
                                    </a>
                                </h6>
                            </template>
                            <template v-for="(current) of item.items">
                                <router-link class="dropdown-item" :to="current.link">
                                    <span :is="current.icon" title="" />
                                    <span>{{ current.title }}</span>
                                </router-link>
                            </template>
                        </template>
                    </div>
                </vsm-mob>
            </template>
        </vsm-menu>
    </div>
</template>

<script>
import axios from 'axios';
import VsmMenu from 'vue-stripe-menu/src/components/Menu'
import VsmMob from 'vue-stripe-menu/src/components/Mob'
import SearchBox from 'vuepress-plugin-fulltext-search/components/SearchBox'
import {BAlert, VBAlert} from 'bootstrap-vue'
import Domain from 'vue-material-design-icons/Domain'
import AccountGroupOutline from 'vue-material-design-icons/AccountGroupOutline'
import BookOutline from 'vue-material-design-icons/BookOutline'
import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import Terraform from "vue-material-design-icons/Terraform";
import Server from "vue-material-design-icons/Server";
import Email from "vue-material-design-icons/Email";
import ApplicationOutline from "vue-material-design-icons/ApplicationOutline"
import FeatureSearch from "vue-material-design-icons/FeatureSearch"
import AccountNetworkOutline from "vue-material-design-icons/AccountNetworkOutline"
import Security from "vue-material-design-icons/Security"
import PostOutline from "vue-material-design-icons/PostOutline"
import {GithubIcon} from 'vue-feather-icons';

export default {
    components: {
        VsmMenu,
        VsmMob,
        SearchBox,
        BAlert,
        Domain,
        GoogleCirclesExtended,
        Terraform,
        Server,
        FileDocumentOutline,
        Email,
        ApplicationOutline,
        FeatureSearch,
        AccountNetworkOutline,
        PostOutline,
        GithubIcon,
    },
    data() {
        return {
            stargazers: undefined,
            isBannerOpen: undefined,
            menu: [
                {
                    title: 'Product',
                    icon: ApplicationOutline,
                    element: 'a',
                    dropdown: 'product',
                    items: [
                        {
                            title: 'Features',
                            link: '/features/features.html',
                            icon: FeatureSearch,
                            desc: 'Discover all the features of Kestra'
                        },
                        {
                            title: 'Usages',
                            link: '/features/usages.html',
                            icon: AccountNetworkOutline,
                            desc: 'How Kestra can help on your daily workflow'
                        },
                        {
                            title: 'Enterprise Edition',
                            link: '/features/enterprise.html',
                            icon: Security,
                            desc: 'Security and Productivity for enterprise'
                        }
                    ]
                },
                {
                    title: 'Learn',
                    icon: BookOutline,
                    element: 'a',
                    dropdown: 'docs',
                    items: [
                        {
                            title: 'Blogs',
                            link: '/blogs/',
                            icon: PostOutline,
                            desc: 'Product updates, user stories, and more'
                        },
                        {
                            title: 'Documentation',
                            link: '/docs/',
                            icon: FileDocumentOutline,
                            desc: 'Get started with Kestra'
                        },
                        {
                            title: 'Plugins documentation',
                            link: '/plugins/',
                            icon: GoogleCirclesExtended,
                            desc: 'Extends Kestra with many plugins'
                        },
                        {
                            title: 'Terraform provider',
                            link: '/docs/terraform/',
                            icon: Terraform,
                            desc: 'Deploy Kestra resources with Terraform'
                        },
                        {
                            title: 'Administrator guide',
                            link: '/docs/administrator-guide/',
                            icon: FileDocumentOutline,
                            desc: 'Learn how to deploy Kestra'
                        },
                    ]
                },
                {
                    title: 'Community',
                    attributes: {href: '/community.html'},
                    icon: AccountGroupOutline,
                },
                {
                    title: 'Company',
                    icon: Domain,
                    element: 'a',
                    dropdown: 'company',
                    items: [
                        {
                            title: 'About us',
                            link: '/company/about-us',
                            icon: Domain,
                            desc: 'Discover our story and our team'
                        },
                        {
                            title: 'Contact us',
                            link: '/company/contact',
                            icon: Email,
                            desc: 'How can we help?'
                        }
                    ]
                },
                {
                    title: 'GitHub',
                    icon: GithubIcon,
                    element: 'span',
                    href: 'https://github.com/kestra-io/kestra',
                    target: '_blank'
                },
            ]
        }
    },
    mounted() {
        if (!window.sessionStorage.getItem("github_stargazers_count")) {
            axios.get("https://api.github.com/repos/kestra-io/kestra")
                .then(response => {
                    window.sessionStorage.setItem("github_stargazers_count", response.data.stargazers_count)
                    this.stargazers = response.data.stargazers_count;
                })
        } else {
            this.stargazers = window.sessionStorage.getItem("github_stargazers_count");
        }

        this.isBannerOpen = this.bannerIsOpen()
    },

    methods: {
        onBannerClose() {
            window.localStorage.setItem("header", "false");
            this.isBannerOpen = false;
        },
        bannerIsOpen() {
            return window.localStorage.getItem("header") !== "false"
        }
    },
    computed: {
        stargazersText() {
            return this.stargazers === undefined ? "" : Intl.NumberFormat('en-US').format(this.stargazers);
        },
    }
}
</script>

<style lang="scss">
@import '.vuepress/theme/styles/variables';
@import '~vue-stripe-menu/src/scss/index';

.vsm-menu {
    position: fixed;
    background-color: $theme-dark-dark;
    z-index: 999;
    width: 100%;
    border-bottom: 1px solid $theme-dark-border;

    &.banner-open {
        margin-top: 35px;
    }

    span.vsm-link, a.vsm-link, .vsm-dropdown-section a, .vsm-section_mob a {
        color: $tertiary;
        font-weight: bold;

        &:hover, &.vsm-active, a:hover  {
            background-color: darken($secondary, 5%);
            color: $white;
        }

        a {
            color: $tertiary;
        }
    }

    ul {
        margin: 0;
    }

    .vsm-section {
        flex-grow: 1;
        padding-left: $navbar-padding-x;
    }

    .vsm-root {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logo-section {
        padding: 0.5rem 1rem;
        a:hover {
            background-color: transparent;
        }
        img {
            height: 51px;
        }
    }

    .search-section {
        flex-grow: 0;
    }

    .vsm-link {
        font-size: $font-size-base;
        line-height: normal;
        border-right: 1px solid #292e40;

        > * {
            display: inline-block;
        }
    }

    span.vsm-link {
        border-right: 0;
    }

    .vsm-section_menu {
        > * {
            padding: $nav-link-padding-x $nav-link-padding-y * 4;
        }
    }

    .vsm-background, .vsm-arrow, .vsm-dropdown-container, .vsm-background-alt {
        background: $theme-dark-accent;
    }

    .dropdown-menu {
        position: relative;
        display: block;
        border: 0;
        width: 100%;
        background-color: $theme-dark-accent;
        margin: 0;

        .dropdown-header {
            font-weight: bolder;
            font-size: $font-size-base;
            border-bottom: 1px solid $theme-dark-border;
            border-top: 1px solid $theme-dark-border;
            padding: $dropdown-item-padding-y $dropdown-item-padding-x;
            line-height: 40px;
            &:first-child {
                border-top: 0;
            }
            &:last-child {
                border-bottom: 0;
            }
        }

        .material-design-icon, .feather {
            font-size: 30px;
            position: absolute;
            margin-top: 5px;
            margin-left: -13px;
        }

        span:not(.material-design-icon):not(.badge) {
            display: block;
            padding-left: 1.5rem;
        }


        span.desc {
            font-size: $font-size-sm;
            font-weight: 300;
        }

        .dropdown-divider {
            border-top: 1px solid $theme-dark-border;
        }
    }

    input {
        background-color: $theme-dark;
        border-color: $theme-dark-border;
        border-radius: $border-radius;
    }

    .vsm-section_mob {
        flex-grow: 0;

        .vsm-mob-line {
            background-color: $secondary;
        }
    }

    .vsm-mob-content {
        .vsm-mob-close {
            z-index: 1001;
        }

        .vsm-mob-content__wrap {
            background-color: transparent;
        }

        .vsm-mob-content {
            border-radius: $border-radius;
        }

        .vsm-mob-close:before, .vsm-mob-close:after {
            background-color: $secondary;
        }

        .dropdown-menu {
            top: 0;

            .material-design-icon {
                margin-top: 0;
            }

            span.desc {
                display: none;
            }
        }
    }
}

.top-banner.alert {
    z-index: 999;
    width: 100%;
    position: fixed;
    text-align: center;
    background: $secondary;
    border-radius: 0;
    color: $white;
    border: 0;
    a {
        color: $dark;
        &:after {
            content: ' ⭐️';
        }
        &:hover {
            &:after {
                content: ' 💗';
            }
        }
    }
}
</style>