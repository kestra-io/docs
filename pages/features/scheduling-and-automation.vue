<template>
    <Head>
        <Title>Automate all your workflows with Kestra</Title>
    </Head>
    <div class="main">
        <Header/>
        <Feature/>
        <Workflows/>
        <Plugin/>
        <Automation/>
        <Footer/>
    </div>
</template>
<script setup> 
import Workflows from '../../components/features/scheduling/Workflows.vue';
import Header from '../../components/features/scheduling/Header.vue';
import Automation from '~/components/features/scheduling/Automation.vue';
import Footer from '~/components/features/scheduling/Footer.vue';
import Feature from '../../components/features/scheduling/Feature.vue';
import Plugin from '../../components/features/scheduling/Plugin.vue';
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
.main{
    background-color: $black-4;
    color: $white;
}
</style>