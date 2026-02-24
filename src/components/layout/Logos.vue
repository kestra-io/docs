<template>
    <section class="container-fluid">
        <div class="container">
            <h5 v-if="title" class="title">{{ title }}</h5>
            <div class="companies">
                <div
                    v-for="(logo, index) in Logos"
                    :key="index"
                    :title="logo.alt"
                    :aria-label="logo.alt"
                    role="img"
                    class="logo"
                    v-html="logo.svg"
                    :data-usal="`fade-u delay-${index * 50}`"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { computed } from "vue"

    const props = withDefaults(defineProps<{
        title?: string
        customLogos?: { svg: string; alt: string }[]
        limit?: number
    }>(), {
        title: "Trusted by Teams From:"
    })

    const CompaniesLogos = import.meta.glob("~/assets/companies/*.svg", {
        eager: true,
        query: "?raw",
        import: "default",
    }) as Record<string, string>

    const LogosMap = Object.entries(CompaniesLogos).reduce((acc, [key, value]) => {
        const logoName = key.split("/").pop()?.replace(".svg", "") ?? ""
        acc[logoName] = {
            svg: value,
            alt: logoName
        }
        return acc
    }, {} as Record<string, { svg: string, alt: string }>)

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
        "quadis",
        "huawei",
        "ca",
        "accredible",
        "merkle",
        "renault",
        "dentsu",
        "fila",
        "ntico",
        "battelle",
        "t-system",
        "dataport",
    ]

    const Logos = computed(() => {
        if (props.customLogos) {
            return props.limit ? props.customLogos.slice(0, props.limit) : props.customLogos
        }

        const shuffled = companies.toSorted(() => 0.5 - Math.random())
        const logos = shuffled.map(name => LogosMap[name]).filter(Boolean)
        return props.limit ? logos.slice(0, props.limit) : logos
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        background-color: transparent;
        padding: $rem-3 0;
        padding-bottom: 0 !important;
    }

    .title {
        text-transform: uppercase;
        color: var(--ks-content-secondary);
        text-align: center;
        margin-bottom: $rem-2;
    }

    .companies {
        display: flex;
        gap: $rem-2;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin: $rem-2 0;
    }

    .logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
</style>

