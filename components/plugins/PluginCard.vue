<template>
    <NuxtLink :href="`/plugins/${plugin.name}#${pluginTagName(plugin.name, plugin.title)}`">
        <div class="plugin d-flex align-items-center gap-2 bg-dark-2" ref="root" data-bs-toogle="tooltip"
             data-bs-html="true" data-bs-custom-class="plugin-tooltip" :data-bs-original-title="plugin.tooltipContent">
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

    const pluginTagName = (pluginName, title) => pluginName.toLowerCase() !== title.toLowerCase() ? title.toLowerCase() : '';

    const root = ref(null);

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