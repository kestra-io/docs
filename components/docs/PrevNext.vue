<script setup lang="ts">
    import {upperFirst} from 'scule'

    const {prev, next, navigation} = useContent()
    const {navDirFromPath} = useContentHelpers()

    const directory = (link: any) => {
        const nav = navDirFromPath(link._path, navigation.value || [])

        if (nav && nav[0]) {
            return nav[0]._path
        } else {
            const dirs = link.split('/')
            const directory = dirs.length > 1 ? dirs[dirs.length - 2] : ''
            return directory.split('-').map(upperFirst).join(' ')
        }
    }
</script>

<template>
    <div v-if="prev || next" class="docs-prev-next">
        <NuxtLink
            v-if="prev"
            :to="prev._path"
            class="prev"
        >
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
        </NuxtLink>
    </div>
</template>


<style lang="scss">
    @import "~/assets/styles/variable";

    .docs-prev-next {
        display: flex;
        width: 100%;

        a {
            border: 1px solid var(--bs-border-color);
            padding: calc($spacer/2) calc($spacer/2);
            &:first-child {
                margin-right: $spacer;
            }

            .directory {
                color: var(--bs-gray-500);
                font-weight: bold;
                font-size: $font-size-sm;
            }
        }
    }
</style>