<template>
    <div class="container">
        <h2><span>Simplicity Scales,</span> Complexity Fails</h2>
        <p>
            Mix the flexibility of code-based orchestration<br/>
            with a no-code interface that anyone can learn in minutes.
        </p>
        <div class="cta-buttons">
            <a class="btn btn-primary" href="#">See All Features</a>
            <button class="btn btn-secondary" @click="">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 7.5V16.5L16.5 12L9.5 7.5Z" fill="black"/>
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18.01H4V5.99H20V18.01Z" fill="black"/>
                </svg>
                Overview Video
            </button>
        </div>
        <HomeFeaturesBlock/>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        text-align: center;
        color: white;
        padding-top: 4rem;

        h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: .5rem;
            span {
                color: $primary;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: 350px;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p{
            text-align: center;
            margin: 0 auto;
            text-wrap: pretty;
            margin-bottom: 2rem;
        }
        .cta-buttons{
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            .btn{
                display: flex;
                align-items: center;
                gap: .5rem;
            }
        }
    }
</style>
