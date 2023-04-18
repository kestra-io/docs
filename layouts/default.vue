<template>
    <div>
        <NuxtLoadingIndicator />
        <LayoutHeader />
        <main>
            <slot />
        </main>
        <LayoutFooter />
        <LayoutFixed />
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    @import '../assets/styles/vendor.scss';
    @import '../assets/styles/app.scss';
</style>
