<template>
    <aside class="bd-sidebar scroller">
        <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="bdSidebar" aria-labelledby="bdSidebarOffcanvasLabel">
            <div class="offcanvas-header border-bottom">
                <h5 class="offcanvas-title" id="bdSidebarOffcanvasLabel">Browse docs</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#bdSidebar"></button>
            </div>

            <div class="offcanvas-body">
                <nav class="bd-links w-100" id="bd-docs-nav" aria-label="Docs navigation">
                    <ContentNavigation v-slot="{ navigation }" v-if="contents" :query="contents">
                    </ContentNavigation>
                </nav>
            </div>
        </div>
    </aside>
</template>

<script>

    export default {
        props: {
            // link: {
            //     type: Object,
            //     required: true
            // },
        },
        computed: {
            contents() {
                return queryContent('/docs/')
            },
        }
    }
</script>

<style lang="scss">

</style>