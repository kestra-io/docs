<template>
    <NuxtLink :href="`/plugins/${plugin.name}`">
        <div class="plugin d-flex align-items-center gap-2 bg-dark-2" ref="root" data-bs-toogle="tooltip"
             data-bs-html="true" :title="tooltipContent" data-bs-custom-class="plugin-tooltip" :data-bs-delay="{'hide': 500}">
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
        new $bootstrap.Tooltip(root.value, {
          trigger: 'manual',
          boundary: 'window'
        });

        root.value.addEventListener('mouseenter', () => {
          const tooltip = $bootstrap.Tooltip.getInstance(root.value);
          if (tooltip) {
            removeAllTooltips();
            tooltip.show();
            tooltip.tip.addEventListener('mouseleave', () => {
              tooltip.hide();
            });
          }
        });
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

    function removeAllTooltips() {
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tooltip => {
        tooltip.parentNode.removeChild(tooltip);
      });
    }

    function generateCategoryLink(item, categoryName) {
      const title = pluginTitle(props.plugin.title).toLowerCase();

      return `plugins/${title}/${categoryName.toLowerCase()}/${item}`
    }

    const generateCategoryList = (categoryItems, categoryName) => {
      let list = ``;
        categoryItems.forEach(item => {
            list += `
              <li>
                <a href="${generateCategoryLink(item, categoryName)}">${item}</a>
              </li>
            `
        });
        return list;
    };

    const creatingTooltipContainer = (categoryItems, categoryName) => {
        if (categoryItems && categoryItems.length > 0) {
            tooltipContent.value += `
            <p>${categoryName}</p>
            <ul>
              ${generateCategoryList(categoryItems, categoryName)}
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