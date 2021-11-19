<template>
    <div>
        <LandingHeader />
        <LandingFeature />
        <LandingTech />
        <LandingVideo />
        <LandingPlugins />
    </div>
</template>

<script>
import LandingHeader from "./Home/LandingHeader"
import LandingFeature from "./Home/LandingFeature"
import LandingTech from "./Home/LandingTech"
import LandingVideo from "./Home/LandingVideo"
import LandingPlugins from "./Home/LandingPlugins"

export default {
    components: {
        LandingHeader,
        LandingFeature,
        LandingTech,
        LandingVideo,
        LandingPlugins,
    },
    created() {
    }
}
</script>
