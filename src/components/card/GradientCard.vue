<template>
    <div class="gradient-card" ref="box">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
    @property --x {
        syntax: "<length>";
        inherits: false;
        initial-value: -250px;
    }
    @property --y {
        syntax: "<length>";
        inherits: false;
        initial-value: -250px;
    }

    .gradient-card {
        border-radius: 1rem;
    }
</style>

