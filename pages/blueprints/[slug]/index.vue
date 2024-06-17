<template>
    <div class="container">
        <Head>
            <Title>{{metaTitle}}</Title>
            <Meta
                name="description"
                :content="metaDescription"
            />
        </Head>

        <BlueprintsLists :tags="tags"/>
        <LayoutFooterContact
            title="New to Kestra?"
            subtitle="Use blueprints to kickstart your first workflows."
            purpleButtonText="Get started with Kestra"
            purpleButtonHref="/docs/getting-started"
        />
    </div>
</template>

<script setup>
  const config = useRuntimeConfig();
  const route = useRoute();
  const metaTitle = ref('Kestra Blueprints Library');
  const metaDescription = ref('Get started with our library of workflows ready to use');
  const {data: tags} = await useAsyncData('blueprints-tags', () => {
    return $fetch(`${config.public.apiUrl}/blueprints/tags`)
  })

  const slug = route?.params?.slug;

  if (slug && slug !== 'all tags') {
    const filterName = tags.value.find(f => f.name.toLowerCase() == slug.toLowerCase())?.name;
    metaTitle.value = `${filterName} template for your workflows - Kestra`;
    metaDescription.value = `Get started with our ${filterName} blueprints to create your workflows with confidence.`;
  }
</script>