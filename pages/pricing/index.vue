<template>
    <div class="cont">
        <Head>
            <Title>Compare all Versions of Kestra</Title>
            <Meta name="description"
                  content="Choose the right plan for your needs. Start with the Open Source version and scale with the Enterprise Edition of Kestra."/>
        </Head>
        <Heading/>
        <Table ref="tableRef"/>
        <Slider ref="orchestraCoreRef"/>
        <Faq/>
    </div>
</template>

<script setup>
  import Heading from "../../components/price/Heading.vue"
  import Table from "../../components/price/Table.vue"
  import Faq from "../../components/price/Faq.vue"
  import Slider from "../../components/price/Slider.vue"
  const isInView = ref(false);
  const tableRef = ref(null);
  const orchestraCoreRef = ref(null);
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  });

  const handleScroll = () => {
    const rect = tableRef.value?.$refs.tableContentRef?.getBoundingClientRect();
    const orchestraCoreElement = orchestraCoreRef.value.$refs.orchestraCoreDOMElement?.getBoundingClientRect();
    console.log('rect.top', rect.top)
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

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .cont {
        background: #121217;

        @include media-breakpoint-down(md) {
            background-image: url(/public/landing/pricing/visual-bg.png);
            background-repeat: no-repeat;
            background-position: top;
        }
    }

    :deep(.companies-container) {
        border-top: $container-border;
        border-bottom: $container-border;
        padding-bottom: 3rem;
    }
</style>