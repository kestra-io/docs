<script>
import SidebarLinks from '@vuepress/theme-default/components/SidebarLinks.vue'

export default {
    extends: SidebarLinks,
}

</script>

<style lang="scss">
@import '.vuepress/theme/styles/variables';

ul.sidebar-links {
    padding-left: 0;

    li {
        list-style-type: none;


        .sidebar-heading, .sidebar-link {
            display: flex;
            width: 100%;
            vertical-align: middle;
            line-height: $line-height-sm;
            font-size: $font-size-sm;
            padding-top: 0.1rem;
            padding-bottom: 0.1rem;

            span {
                flex-grow: 1;
            }

            span.arrow {
                top: 5px;
                flex-grow: 0;
                order: 1;
            }

            &.active, &:hover {
                color: $link-color;
            }

            &.active {
                font-weight: bold;
                border-left-color: $link-color;
            }
        }

        .depth-0 {
            .sidebar-heading {
                //padding-left: $spacer / 3;
            }
        }

        .sidebar-group.is-sub-group > .sidebar-heading {
            //padding-left: $spacer / 2;
        }

        a {



        }

        a {
            //color: $link-color;
            //line-height: $line-height-sm;
            //font-size: $font-size-sm;
            //padding: 0;

            &.active, &:hover {
                //color: $primary;
            }
        }

        .sidebar-sub-header {
            display: none;
        }
    }
}
</style>
