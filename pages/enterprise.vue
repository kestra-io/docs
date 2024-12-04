<template>
    <div class="main-container">
        <Head>
            <Title>Get More Out of Your Data With the Enterprise Edition</Title>
            <Meta name="description"
                  content="Get full access of all the Open source features and unlock the full potential with Enterprise only features"/>
        </Head>
        <EnterpriseHeader/>
        <div ref="securityBlock">
            <NuxtLazyHydrate when-visible>
                <EnterpriseSecurity/>
            </NuxtLazyHydrate>
            <NuxtLazyHydrate when-visible>
                <EnterpriseSuccessProgram/>
            </NuxtLazyHydrate>
            <NuxtLazyHydrate when-visible>
                <EnterpriseProjectDetails/>
            </NuxtLazyHydrate>
        </div>
        <NuxtLazyHydrate when-visible>
            <EnterpriseOrchestraCore ref="orchestraCore"/>
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
  import {ref, onMounted, onBeforeUnmount} from 'vue'

  const {origin} = useRequestURL();
  const isInView = ref(false);

  useHead({
    meta: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@kestra_io'},
      {name: 'twitter:title', content: "Get More Out of Your Data With the Enterprise Edition"},
      {
        name: 'twitter:description',
        content: "Get full access of all the Open source features and unlock the full potential with Enterprise only features"
      },
      {name: 'twitter:image:alt', content: "Get More Out of Your Data With the Enterprise Edition"},
      {name: 'twitter:image', content: `${origin}/og-image.png`},
      {property: 'og:title', content: "Get More Out of Your Data With the Enterprise Edition"},
      {
        property: 'og:description',
        content: "Get full access of all the Open source features and unlock the full potential with Enterprise only features"
      },
      {property: 'og:image', content: `${origin}/og-image.png`},
      {property: 'og:image:type', content: "image/svg+xml"},
      {property: 'og:image:alt', content: "Get More Out of Your Data With the Enterprise Edition"},
    ]
  });

  const securityBlock = ref(null);
  const orchestraCore = ref(null);

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  });

  const handleScroll = () => {
    const rect = securityBlock.value?.getBoundingClientRect();
    const orchestraCoreElement = orchestraCore.value.$refs.orchestraCoreDOMElement?.getBoundingClientRect();
    if (rect.top <= 60 && orchestraCoreElement.top >= 60) {
      if (!isInView.value) {
        isInView.value = true;
        changeTopBarBackground(true)
      }
    } else {
      if (isInView.value) {
        isInView.value = false;
        changeTopBarBackground(false)
      }
    }
  };
  const changeTopBarBackground = (isInView) => {
    const topBar = document.getElementById('top-bar');
    if (topBar) {
      topBar.style.backgroundColor = isInView ? "black" : ""
    }
  }

</script>
<style scoped lang="scss">
    .main-container {
        overflow: clip;
    }
</style>
