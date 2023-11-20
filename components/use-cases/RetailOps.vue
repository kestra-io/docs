<template>
    <div>
        <h1>{{ header }}</h1>
        <p>{{ description }}</p>
        <div v-for='item in items'>
            <div>
                <img :src='item.icon'/>
                <div>
                    <h1>{{ item.title }}</h1>
                    <p>{{ item.text }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'UseCaseRetailOps',
    props: {
        header: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    }
}

</script>

<style scoped lang='scss'>

</style>