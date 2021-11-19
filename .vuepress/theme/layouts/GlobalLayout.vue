<template>
    <div
        class="theme-container"
        :class="pageClasses"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
    >
        <Navbar
            v-if="shouldShowNavbar"
            @toggle-sidebar="toggleSidebar"
        />

        <div
            class="sidebar-mask"
            @click="toggleSidebar(false)"
        />



        <div v-if="$page.frontmatter.layout">
            <main class="page">
                <div :is="$page.frontmatter.layout">
                    <Content  />
                </div>
            </main>


            <Footer />
        </div>

        <div v-else>
            <Sidebar
                :items="sidebarItems"
                @toggle-sidebar="toggleSidebar"
            >
                <template #top>
                    <slot name="sidebar-top" />
                </template>
                <template #bottom>
                    <slot name="sidebar-bottom" />
                </template>
            </Sidebar>

            <div class="theme-default-content">
                <Content />
                <PageEdit />

                <PageNav v-bind="{ sidebarItems }" />
            </div>
        </div>

<!--        <Page-->
<!--            v-else-->
<!--            :sidebar-items="sidebarItems"-->
<!--        >-->
<!--            <template #top>-->
<!--                <slot name="page-top" />-->
<!--            </template>-->
<!--            <template #bottom>-->
<!--                <slot name="page-bottom" />-->
<!--            </template>-->
<!--        </Page>-->


    </div>
</template>

<script>
import Navbar from '@theme/components/Navbar.vue'
// import Page from '@theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import {resolveSidebarItems} from '@vuepress/theme-default/util'

export default {
    name: 'GlobalLayout',

    components: {
        // Page,
        Sidebar,
        Navbar,
        PageEdit,
        PageNav
    },

    data() {
        return {
            isSidebarOpen: false
        }
    },

    computed: {
        shouldShowNavbar() {
            const {themeConfig} = this.$site
            const {frontmatter} = this.$page


            if (
                frontmatter.navbar === false
                || themeConfig.navbar === false) {
                return false
            }
            return (
                this.$title
                || themeConfig.logo
                || themeConfig.repo
                || themeConfig.nav
                || this.$themeLocaleConfig.nav
            )
        },

        shouldShowSidebar() {
            const {frontmatter} = this.$page
            return (
                !frontmatter.home
                && frontmatter.sidebar !== false
                && this.sidebarItems.length
            )
        },

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
                    'no-navbar': !this.shouldShowNavbar,
                    'sidebar-open': this.isSidebarOpen,
                    'no-sidebar': !this.shouldShowSidebar,
                    'landing': true
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

        // side swipe
        onTouchStart(e) {
            this.touchStart = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            }
        },

        onTouchEnd(e) {
            const dx = e.changedTouches[0].clientX - this.touchStart.x
            const dy = e.changedTouches[0].clientY - this.touchStart.y
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                if (dx > 0 && this.touchStart.x <= 80) {
                    this.toggleSidebar(true)
                } else {
                    this.toggleSidebar(false)
                }
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../styles/index.scss';
</style>
