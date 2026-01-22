<template>
    <div class="container-fluid">
        <div class="container">
            <p class="title">TRUSTED BY</p>
            <div class="companies">
                <NuxtImg
                    v-for="(img, index) in shuffledCompanies"
                    :key="index"
                    :data-usal="`fade-u delay-${index * 50}`"
                    :class="{ inverted: inverted }"
                    v-bind="logos[img]"
                    :alt="img"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    const companiesLogos = import.meta.glob<{ src: string }>("~/assets/companies/*.svg", {
        eager: true,
        import: "default",
    })

    defineProps<{
        inverted?: boolean
    }>()

    const logos = Object.entries(companiesLogos).reduce(
        (acc, [key, value]) => {
            const logoName = key.split("/").pop()?.replace(".svg", "") || ""
            acc[logoName] = value
            return acc
        },
        {} as Record<string, { src: string }>,
    )

    const companies = [
        "acxiom",
        "bouygues-immobilier",
        "leroymerlin",
        "experian",
        "sophia-genetics",
        "cleverconnect",
        "tencent",
        "gorgias",
        "jcdecaux",
        "aimtec",
        "hcl",
        "clever-cloud",
        "quadis",
        "huawei",
        "ca",
        "accredible",
        "merkle",
        "renault",
        "dentsu",
        "fila",
        "intersport",
    ]

    const shuffledCompanies = computed(() => {
        return companies.toSorted(() => 0.5 - Math.random())
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .title {
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 600;
        line-height: 28px;
        color: $white-1;
        text-align: center;
    }

    .companies {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
</style>