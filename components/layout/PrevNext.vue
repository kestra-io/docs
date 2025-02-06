<template>
    <div v-if="prev || next" class="docs-prev-next mt-5">
        <NuxtLink
            v-if="prev"
            :to="prev._path"
            class="prev"
        >
            <ArrowLeft />
            <div class="wrapper">
                <span v-if="directory(prev._path)" class="directory">
                  {{ directory(prev._path) }}
                </span>
                <span class="title">{{ prev.title }}</span>
            </div>
        </NuxtLink>

        <span v-else />

        <NuxtLink
            v-if="next"
            :to="next._path"
            class="next"
        >
            <div class="wrapper">
                <span v-if="directory(next._path)" class="directory">
                  {{ directory(next._path) }}
                </span>
                <span class="title">{{ next.title }}</span>
            </div>
            <ArrowRight />
        </NuxtLink>
    </div>
</template>

<script>
import {upperFirst} from 'scule'
import {hash} from "ohash";
import ArrowLeft from "vue-material-design-icons/ArrowLeft.vue"
import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
import {prevNext} from "~/utils/navigation.js";

// const {navDirFromPath} = useContentHelpers()
const navDirFromPath = () => []

    export default defineComponent({
        components: {ArrowLeft, ArrowRight},
        async setup(props) {
            const route = useRoute();

            const {prev, next} = prevNext(props.navigation, route.path);

            return {prev, next};
        },
        props: {
            navigation: {type: Object, required: true}
        },
        methods: {
            directory(link) {
                const nav = navDirFromPath(link._path, this.navigation || [])

                if (nav && nav[0]) {
                    return nav[0]._path
                } else {
                    const dirs = link.split('/')
                    const directory = dirs[Math.max(1, dirs.length - 2)]
                    return directory.split('-').map(upperFirst).join(' ')
                }
            },
        }
    });
</script>


<style lang="scss">
    @import "../../assets/styles/variable";

    .docs-prev-next {
        display: flex;
        width: 100%;

        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .title {
            font-size: $font-size-sm;
        }

        a {
            border: $block-border;
            background-color: $black-2;
            padding: calc($spacer/2) calc($spacer);
            display: flex;
            gap: $spacer;
            border-radius: var(--bs-border-radius);
            width: 50%;

            &.prev {
                margin-right: calc($spacer / 2);
                .material-design-icon {
                    color: $purple-36;
                }
            }

            &.next {
                margin-left: calc($spacer / 2);
                .material-design-icon {
                    color: $purple-36;
                }
            }

            div {
                flex-grow: 2;
                span {
                    display: block;

                    &.title {
                        font-weight: bold;
                        color: $purple-36;
                    }

                    &.directory {
                        color: $white-1;
                        font-size: $font-size-sm;
                    }
                }
            }
        }
    }
</style>