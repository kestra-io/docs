<template>
    <div>
        <Head>
            <Title>Kestra Alternative to VmWare Cloud Foundation & Aria Automation</Title>
            <Meta name="description" content="What are the differences between Kestra and VmWare Cloud Foundation" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/vmware-cloud-foundation/Header.vue';
    import Main from '~/components/vs/vmware-cloud-foundation/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
