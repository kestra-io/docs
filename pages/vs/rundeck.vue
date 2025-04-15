<template>
    <div>
        <Head>
            <Title>Kestra Alternative to Rundeck</Title>
            <Meta name="description" content="Kestra, An Alternative for Ansible Automation" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/rundeck/Header.vue';
    import Main from '~/components/vs/rundeck/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
