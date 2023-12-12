<template>
    <div class="plugin-card">
        <div class="plugin-header">
            <h3 class="plugin-title">
                {{ plugin.title }}
            </h3>
            <p class="plugin-group">
                {{ plugin.group }}
            </p>
        </div>
        <div class="plugin-card-body">
            <h4>Tasks:</h4>
            <ul class="plugin-card-list">
                <li
                    v-for="task in plugin.tasks"
                    :key="task"
                    class="plugin-card-item"
                >
                    {{ task }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        plugin: {
            type: Object,
            required: true,
            default: () => ({})
        }
    });
</script>

<style lang="scss" scoped>
    .plugin-card {
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &-header {
            margin-bottom: 1rem;
        }

        &-title {
            font-size: 1.25rem;
            color: #333;
            margin: 0;
        }

        &-group {
            font-size: 0.875rem;
            color: #666;
            margin-top: 0.25rem;
        }

        &-body {
            h4 {
                font-size: 1rem;
                color: #333;
                margin-bottom: 0.5rem;
            }
        }

        &-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
            max-height: 150px;
            overflow-y: auto;

            &-item {
                font-size: 0.875rem;
                color: #444;
                margin-bottom: 0.25rem;
                padding: 0.25rem 0;
                border-bottom: 1px solid #eee;

                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
</style>