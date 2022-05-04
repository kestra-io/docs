<template>
    <div id="wrapper"
         :class="pageClasses"
    >
        <Chat />
        <Header />
        <div id="container">
            <div class="container-fluid">
                <div class="row flex-xl-nowrap">
                    <div class="col-md-3 col-xl-2 nav-sidebar">
                        <SidebarLinks
                            :depth="0"
                            :items="sidebarItems"
                            :sidebar-depth="0"
                        />
                    </div>

                    <nav v-if="rightBar()" class="d-none d-xl-block col-xl-2 right">
                        <RightAnchor />
                    </nav>

                    <main :class="mainClass()" class=" docs" role="main">
                        <div class="d-block d-md-none sidebar-mobile-btn">
                            <button class="navbar-toggler shadow-lg" type="button" @click="toggleSidebar">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        <Content />

                        <PageEdit />
                        <PageNav v-bind="{ sidebarItems }" />
                        <Share />
                    </main>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import isNil from 'lodash/isNil'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import RightAnchor from '../components/layout/RightAnchor.vue'
import PageEdit from '@vuepress/theme-default/components/PageEdit.vue'
import PageNav from '@vuepress/theme-default/components/PageNav.vue'
import SidebarLinks from '../components/SidebarLinks.vue'
import {resolveSidebarItems} from '@vuepress/theme-default/util'
import Share from "../components/layout/Share";
import Chat from "../components/layout/Chat";

export default {
    name: 'GlobalLayout',

    components: {
        Header,
        Footer,
        RightAnchor,

        SidebarLinks,
        PageEdit,
        PageNav,
        Share,
        Chat,
    },

    data() {
        return {
            isSidebarOpen: false
        }
    },

    computed: {
        sidebarItems() {
            return resolveSidebarItems(
                this.$page,
                this.$page.regularPath,
                this.$site,
                this.$localePath
            )
        },

        pageClasses() {
            const userPageClass = this.$page.frontmatter.pageClass
            return [
                {
                    'sidebar-open': this.isSidebarOpen,
                },
                userPageClass
            ]
        }
    },

    mounted() {
        this.$router.afterEach(() => {
            this.isSidebarOpen = false
        })
    },

    methods: {
        toggleSidebar(to) {
            this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
            this.$emit('toggle-sidebar', this.isSidebarOpen)
        },
        rightBar() {
            return isNil(this.$page.frontmatter.rightBar)
                ? (this.$site.themeConfig.rightBar ? this.$site.themeConfig.rightBar : true)
                : this.$page.frontmatter.rightBar
        },
        mainClass() {
            return this.rightBar() ? {
                "col-md-9": true,
                "col-xl-8": true,
                "py-md-3": true,
                "pl-md-5": true,
            } : {};
        }
    }
}
</script>

<style lang="scss">
@import '.vuepress/theme/styles/index';
</style>
