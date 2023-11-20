<template>
    <div>
        <h1>{{ title }}</h1>
        <div>
            <img v-for='plugin in plugins' :src='plugin.icon' :alt='plugin.name'/>
        </div>
        <div v-if='cta.text'>
            <NuxtLink :href='cta.href'>
                {{ cta.text }}
            </NuxtLink>
        </div>
    </div>

</template>

<script>
export default {
    name: "UseCasesPlugins",
    props: {
        plugins: {
            type: Array,
            default: () => [],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        cta: {
            type: Object,
            required: false,
            default: () => ({})
        }
    }
}

</script>
<style scoped lang='scss'>

</style>