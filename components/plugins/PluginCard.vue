<template>
    <NuxtLink :href="`/plugins/${plugin.name}`">
        <div class="plugin d-flex align-items-center gap-2 bg-dark-2" ref="root" data-bs-toogle="tooltip" data-bs-html="true" :title="tooltipContent">
            <div class="icon-content">
                <img :src="`/icons/${plugin.group}.svg`" :alt="plugin.title">
            </div>
            <h6>
                {{ pluginTitle(plugin.title) }}
            </h6>
        </div>
    </NuxtLink>
</template>
<script setup>
    const {$bootstrap} = useNuxtApp()
    const props = defineProps({
        plugin: {
            type: Object,
            required: true
        },
        icons: {
            type: Object,
            default: undefined
        },
    });

    const pluginTitle = (title) => {
        const titleCase = title[0].toUpperCase() + title.slice(1);
        return titleCase.length > 150 ? titleCase.substring(0, 150) + '...' : titleCase;
    }

    const root = ref(null)
    const tooltipContent = ref("");

    onMounted(() => {
        if (process.client) {
            new $bootstrap.Tooltip(root.value);
        }
    });

    onBeforeUnmount(() => {
        if (process.client) {
            const tooltip = $bootstrap.Tooltip.getInstance(root.value);
            if (tooltip) {
                tooltip.dispose();
            }
        }
    });

    const generateCategoryList = (categoryItems) => {
        let list = ``;
        categoryItems.forEach(item => {
            list += `<li>${item}</li>`
        });
        return list;
    };

    const creatingTooltipContainer = (categoryItems, categoryName) => {
      if (categoryItems && categoryItems.length > 0) {
        tooltipContent.value += `
            <p>${categoryName}</p>
            <ul>
              ${generateCategoryList(categoryItems)}
            </ul>
        `
      }
    };

    if (props.plugin) {
        const plugin = props.plugin;
        creatingTooltipContainer(plugin.tasks, 'Tasks');
        creatingTooltipContainer(plugin.triggers, 'Triggers');
        creatingTooltipContainer(plugin.conditions, 'Conditions');
        creatingTooltipContainer(plugin.taskRunners, 'TaskRunners');
    }
</script>


<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .plugin {
        border-radius: 4px;
        border: $block-border;
        padding: calc($rem-1 / 2) $rem-2;

        .icon-content img {
            width: 32px;
            height: 32px;
        }

        h6 {
            color: $white;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: $font-size-md;
            font-weight: 400;
            margin-bottom: 0;
        }
    }
</style>