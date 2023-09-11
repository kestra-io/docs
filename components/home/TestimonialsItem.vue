<template>
    <div class="card mb-3">
        <div class="enterprise-logo position-absolute" v-if="item.enterpriseLogo">
            <img :src="item.enterpriseLogo" :alt="item.enterpriseLogo.replace('/landing/enterprises/', '').replace('.svg', '-logo')">
        </div>
        <div class="card-body">
            <p>
                {{ item.message }}
            </p>
            <div class="footer">
                <img :src="item.profile" width="50" :alt="item.alt" />
                <span>
                    <a :href="item.link" target="_blank">{{ item.name }}</a><br />
                    {{ item.designation }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object
            }
        }
    }
</script>

<style lang="scss" scoped>
.card {
    .enterprise-logo {
        right: 12px;
        top: 12px;
    }
}
</style>
