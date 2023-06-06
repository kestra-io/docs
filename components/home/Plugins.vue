<template>
    <div class="container-fluid">
        <Section
            class="dark"
            title="Over 300 plugins"
            subtitle="Expand Your Workflow Capabilities"
            baseline="Plugins are at the core of Kestra's extensibility. Many plugins are available from the Kestra core team, and creating your own is easy. With plugins, you can add new functionality to Kestra."
        >
            <ul class="nav nav-pills" v-if="false">
                <li class="nav-item" v-for="category of categories">
                    <a class="nav-link" :class="{'active': selected === category}" @click="selected = category">{{ capitalize(category) }}</a>
                </li>
            </ul>

            <div class="plugins mt-3">
                <div class="p1">
                    <template v-for="plugin in pluginSplit(true)">
                        <NuxtLink :href="link(plugin)" class="me-2 mb-2" :title="plugin.title">
                            <img width="50" height="50" :src="img(plugin)" :alt="plugin.title" />
                        </NuxtLink>
                    </template>
                </div>
                <div class="p2">
                    <template v-for="plugin in pluginSplit(false)">
                        <NuxtLink :href="'/plugins/' + plugin.plugin + '/'" class="me-2 mb-2" :title="plugin.title">
                            <img width="50" height="50" :src="img(plugin)" :alt="plugin.title" />
                        </NuxtLink>
                    </template>
                </div>
            </div>

            <div class="text-center mt-5">
                <NuxtLink class="btn btn-primary " href="/plugins" data-aos="zoom-in">See all plugins</NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import axios from "axios";

    export default {
        components: {Section},
        data() {
            return {
                plugins: undefined,
                categories: undefined,
                selected: undefined
            };
        },
        mounted() {
            axios.get("https://api.kestra.io/v1/plugins/categories")
                .then(response => {
                    this.categories = response.data.sort();
                })

            axios.get("https://api.kestra.io/v1/plugins/subgroups")
                .then(response => {
                    this.plugins = response.data
                        .filter(e => e.icon !== undefined && e.plugin !== "core")
                        .sort(() => .5 - Math.random())
                })
        },
        methods: {
            capitalize(name) {
                return name[0].toUpperCase() + name.slice(1).toLowerCase();
            },
            link(plugin) {
                return '/plugins/' + plugin.plugin + (plugin.subgroup ? "#" + plugin.subgroup : "");
            },
            img(plugin) {
                return 'https://api.kestra.io/v1/plugins/icons/' + plugin.icon;
            },
            pluginSplit(first) {
                if (!this.plugins) {
                    return [];
                }

                let plugins = [...this.plugins];

                // if (this.selected) {
                //     plugins = plugins.filter(e => e.categories && e.categories.includes(this.selected));
                // }

                const middleIndex = Math.ceil(this.plugins.length / 2);

                return first ? plugins.splice(0, middleIndex) : plugins.splice(-middleIndex);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-4;
        color: var(--bs-white);
        padding: 0;

        :deep(p.baseline) {
            color: var(--bs-white);
        }

        .nav {
            width: 100%;
            justify-content: center;
            font-size: $font-size-sm;

            .nav-link {
                margin-right: calc($spacer * 1);
                border: 1px solid transparent;
                cursor: pointer;
            }

            .nav-link:not(.active) {
                border: 1px solid $purple-3;
                color: var(--bs-white);
            }
        }

        .plugins {
            overflow: hidden;

            > div {
                position: relative;
                display: flex;
                animation: auto-scroll 30s infinite linear;

                &:last-child {
                    left: -55px;
                    animation: auto-scroll-reverse 30s infinite linear;
                }
            }

            a {
                background: $purple-5;
                border-radius: var(--bs-border-radius-lg);
                border: 1px solid $purple-6;
                width: 110px;
                height: 90px;
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;

            }
        }
    }

    @keyframes auto-scroll {
        0% {
            margin-left: 0;
        }
        50% {
            margin-left: -25%;
        }
        100% {
            margin-left: 0;
        }
    }


    @keyframes auto-scroll-reverse {
        0% {
            margin-left: -25%;
        }
        50% {
            margin-left: 0;
        }
        100% {
            margin-left: -25%;
        }
    }
</style>