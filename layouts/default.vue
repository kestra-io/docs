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
