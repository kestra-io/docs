<template>
    <div class="logo-wrapper">
        <div class="center-text">
            Trusted by Industry Leaders
        </div>
        <div class="logo-box" v-for="(img, index) in shuffledCompanies?.slice(0, 20)" :key="index">
            <img :src="img.url" :alt="img.name" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const companies = import.meta.glob('~/public/landing/companies/*.{svg,png}', {
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
.logo-wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1px;
    background: radial-gradient(#E1E1E1 0%, #E1E1E1 30%, #E1E1E101 80%, #E1E1E100 100%) no-repeat center;
    width: 1146px;
    margin: 0 auto;
}

.logo-box{
    background-color: #FCFCFD;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    img{
        max-width: 70%;
        max-height: 50%;
    }
}

.center-text{
    grid-column: 3 / 5;
    grid-row: 2 / 4;
    text-align: center;
    padding: 1rem;
    background-color: #FCFCFD;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2.5rem;
    padding: 0 3rem;
}
</style>