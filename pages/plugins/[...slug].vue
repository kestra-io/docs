<template>
    <div class="container bd-gutter bd-layout margin">
        <PluginsSideBar
            type="plugins"
            v-if="pageList && pageList.length > 0"
            :page-list="pageList"
        />

        <article class="bd-main order-1" v-if="page">
            <!-- TODO: Add PluginHeader, PluginCategories and PluginSearch -->
            <!-- <ContentRenderer :value="page">
                <div class="bd-content">
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page.body"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                </div>
            </ContentRenderer> -->
        </article>
    </div>
</template>

<script setup>
    import PluginsSideBar from "~/components/plugins/PluginsSideBar.vue";
    import {hash} from "ohash";
    import { usePlugins } from '~/composables/usePlugins'

    const PLUGINS_URL = 'https://api.kestra.io/v1/plugins';

    const route = useRoute();
    const slug = "/plugins/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);

    const plugins = ref([]);

    const pageList = ref([]);
    const page = ref();

    const { pluginsToPageList } = usePlugins();

    const fetchPluginsPageList = async () => {
        try {
            const { data: apiPluginsData } = await useAsyncData(`${hash(slug)}`, () =>
                {
                    return $fetch(`${PLUGINS_URL}`)
                },
                {
                    transform: plugins => pluginsToPageList(plugins)
                }
            );
            return apiPluginsData.value;
        } catch (error) {
            console.error('Error fetching plugins data: ', error);
        }
    }

    const fetchPluginPageContent = async (name) => {
        try {
            const { data: pageData } = await useAsyncData(
                `${hash(slug)}`, () => {
                    return $fetch(`${PLUGINS_URL}/${name}`)
                })
            page.value = pageData.value;
        } catch (error) {
            console.error('Error fetching plugin page: ', error);
        }
    }

    const fetchPluginsData = async () => {
        try {
            const { data: apiPluginsData } = await useAsyncData(`${hash(slug)}`, () => {
                return $fetch(`${PLUGINS_URL}`)
            });
            return apiPluginsData.value;
        } catch (error) {
            console.error('Error fetching plugins data: ', error);
        }
    }

    // await fetchPluginPageContent('core');
    pageList.value = await fetchPluginsPageList();
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        display: flex;
    }
</style>