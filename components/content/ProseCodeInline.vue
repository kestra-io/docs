<template>
    <code>
        <slot />
    </code>
</template>


<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    code {
        color: $purple-21;
        background: $purple-22;
        border: 1px solid $purple-23;
        border-radius: var(--bs-border-radius);
        padding: 0 0.25rem;
    }

</style>