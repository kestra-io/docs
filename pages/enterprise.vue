<template>
    <div>
        <Head>
          <Title>Get More Out of Your Data With the Enterprise Edition</Title>
          <Meta name="description" content="Get full access of all the Open source features and unlock the full potential with Enterprise only features" />
        </Head>

        <EnterpriseHeader />
        <EnterpriseCustomers />
        <EnterpriseFeatures />
        <EnterpriseScale />
        <EnterpriseEditions />
        <EnterpriseSecurity />
        <EnterpriseContact />
        <LayoutIntegrations />
    </div>
</template>

<script setup>
    useHead({
        meta:[
            {name:'twitter:card',content:'summary-large-image'},
            {name : 'twitter:site',content:'@kaestra_io'},
            {name : 'twitter:title',content:"Get More Out of Your Data With the Enterprise Edition"},
            {name:'twitter:description',content:"Get full access of all the Open source features and unlock the full potential with Enterprise only features"},
            {name : 'twitter:image' ,content:"/landing/ee/background.svg"},
            {name : 'twitter:image:alt',content : "Illustration of Kestra's logo with a dark background"}
        ]
    })
</script>
