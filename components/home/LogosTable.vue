<template>
    <div class="logos-bg">
        <div class="logo-wrapper">
            <div class="center-text">
                Trusted by Industry Leaders
            </div>
            <div
                v-for="(img, index) in shuffledCompanies?.slice(0, 20)"
                :key="img.name"
                class="logo-box"
                :class="{'hide-small': index > 17}"
            >
                <img :src="img.url" :alt="img.name" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const companies = import.meta.glob('~/public/landing/home/companies/*.svg', {
    import: "default",
    query: 'url',
})

const {data: shuffledCompanies} = await useAsyncData(() => {
    // get all svg/png files in the /public/landing/companies folder
    return Promise.all(Object.entries(companies).map(([filePath, mod]) => {
        return mod().then((img: any) => {
            return {
                name: filePath.split('/').pop()?.split('.').shift(),
                url: img,
            }
        })
    })).then((imgs) => imgs.toSorted(() => 0.5 - Math.random()))
})

//
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";
.logos-bg {
    background-color: #FCFCFD;
    @include media-breakpoint-up(md) {
        padding: 2rem;
    }
}

.logo-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    @include media-breakpoint-up(xl) {
        grid-template-columns: repeat(6, 1fr);
        width: 1146px;
    }
    gap: 1px;
    background: radial-gradient(#E1E1E1 0%, #E1E1E1 30%, #E1E1E101 80%, #E1E1E100 100%) no-repeat center;
    margin: 0 auto;
}

.logo-box{
    background-color: #FCFCFD;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    &.hide-small{
        display: none;
        @include media-breakpoint-up(xl) {
            display: flex;
        }
    }
    img{
        max-width: 70%;
        max-height: 50%;
    }
}

.center-text{
    grid-column: 1 / 4;
    grid-row: 4 / 6;
    @include media-breakpoint-up(xl) {
        grid-column: 3 / 5;
        grid-row: 2 / 4;
    }
    text-align: center;
    padding: 1rem;
    background-color: #FCFCFD;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2.5rem;
    padding: 2rem 3rem;
}
</style>