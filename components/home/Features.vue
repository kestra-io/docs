<template>
    <div class="container">
        <h2><span>Simplicity scales</span>, complexity fails</h2>
        <p>Mix the flexibility of code-based orchestration
            with a no-code interface that anyone can learn in minutes.</p>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        text-align: center;
        color: white;
        h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            span {
                color: $primary;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 350px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
</style>
