<template>
    <div>
         <Head>
            <Title>Register to Get Access to Kestra Cloud</Title>
            <Meta name="description"
                  content="Sign up to get notified as soon as Kestra Cloud launches"/>
        </Head>

        <CloudHeader />
        <CloudFeatures />
    </div>
</template>

<script setup>
    useHead({
        script: [
          { src: 'https://js-eu1.hsforms.net/forms/embed/v2.js' },
        ],
    })
</script>


