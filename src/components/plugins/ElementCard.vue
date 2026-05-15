<template>
    <a :href="hrefWithDefault" @click.prevent="emit('navigate', hrefWithDefault)">
        <div class="element-card">
            <div class="top-row">
                <h6 class="text-capitalize">
                    {{ text }}
                </h6>
                <ChevronRight />
            </div>
            <div v-if="title">
                <slot name="markdown" :content="title.replace(/ *:(?![ /])/g, ': ')" />
            </div>
            <div class="plugin-info">
                <code class="plugin-class">{{ pluginClass }}</code>
            </div>
        </div>
    </a>
</template>
<script setup lang="ts">
    import {slugify} from "../../utils/slugify";
    import {computed} from "vue";
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue";

    const props = defineProps<{
        text: string,
        routePath: string
        pluginClass: string
        href?: string | undefined
        title?: string
    }>();

    const emit = defineEmits<{
        (e: "navigate", url: string): void
    }>();

    const hrefWithDefault = computed(() => props.href === undefined
        ? `${props.routePath}/${slugify(props.text)}`
        : props.href);
</script>

<style scoped lang="scss">
    @use "/src/assets/styles/legacy/_variables.scss" as variables;

    a {
        display: block;
        height: 100%;
        text-decoration: none;
    }

    .element-card {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        border: 1px solid var(--kestra-io-token-color-border-secondary);
        padding: 1rem;
        background: var(--kestra-io-token-color-background-secondary);
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        // avoid unwanted background color transitions when switching themes
        transition: border-color 0.4s ease-out, box-shadow 0.4s ease-out, transform 0.4s ease-out;

        &:hover {
            border-color: var(--kestra-io-token-color-border-active);
            box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
            transform: scale(1.025);
        }

        .top-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            min-width: 0;
        }

        :deep(svg) {
            font-size: 1rem;
            color: variables.$purple-36 !important;
        }

        h6 {
            color: variables.$white;
            font-size: 1rem;
            font-weight: 700;
            margin: 0;
            line-height: 1.5rem;
            padding: 0.25rem 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1 1 auto;
            min-width: 0;
        }

        .plugin-info {
            margin-top: 1rem;
            min-width: 50px;
            max-width: fit-content;
            max-height: fit-content;
            background: variables.$black-2;
            border-radius: 4px;
            padding: 0.5rem;
            font-size: 0.75rem;
            color: var(--ks-content-secondary);
            border: 1px solid variables.$black-3;

            .plugin-class {
                color: variables.$purple-50 !important;
                font-size: 12px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: block;
            }
        }

        :deep(p) {
            color: var(--ks-content-secondary);
            font-size: 12px !important;
            line-height: 1rem;
            margin: 0;
            margin-top: 0.5rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
</style>
