<template>
    <div>
        <Head>
            <Title>Join a Thrilling Community of Data Enthusiasts</Title>
            <Meta name="description" content="Connect with a vibrant community of data enthusiasts to learn, collaborate, and contribute to the evolution of data orchestration." />
        </Head>

        <CommunityHeader />
        <CommunitySlack />
        <Community />
        <CommunityContributors />
        <LayoutBottomCallToAction />
    </div>
</template>

<script setup>
    useHead({
        meta:[
            {name:'twitter:card',content:'summary-large-image'},
            {name : 'twitter:site',content:'@kaestra_io'},
            {name : 'twitter:title',content:"Join a Thrilling Community of Data Enthusiasts"},
            {name:'twitter:description',content:"Connect with a vibrant community of data enthusiasts to learn, collaborate, and contribute to the evolution of data orchestration."},
            {name : 'twitter:image' ,content:"/landing/community/header.svg"},
            {name : 'twitter:image:alt',content : "Illustration of diverse people around Kestra's logo, symbolizing Kestra's thriving community"}
        ]
    })
</script>
