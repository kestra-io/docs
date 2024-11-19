<template>
    <div class="fw-bold d-flex gap-2 flex-wrap mb-3">
        <p class="mb-0">Available on:</p>
        <span class="badge d-flex align-items-center bg-body-tertiary">{{version}}</span>
        <span v-bind:v-if="edition" v-for="edition in editions" class="badge d-flex align-items-center" :class="`bg-${editionInfo(edition).color}`">{{ editionInfo(edition).label }}</span>
    </div>

</template>

<script>
  export default {
    components: {},
    props: {
      version: {
        type: String,
        default: ''
      },
      editions: {
        type: Object,
        default: []
      }
    },
    data() {
      return {
        color: 'secondary',
        editionLabelAndColorByPrefix: {
          OSS: {label: "Open Source Edition", color: "primary"},
          EE: {label: "Enterprise Edition", color: "secondary"},
          CLOUD_TEAM: {label: "Cloud Team plan", color: "success"},
          CLOUD_PRO: {label: "Cloud Pro plan", color: "info"},
        }
      }
    },
    mounted() {
      console.log('All props:', this.$props);
      console.log('All props:', this.$props.text);
    },
    methods: {
      editionInfo(edition) {
        return this.editionLabelAndColorByPrefix?.[edition] ?? {
          label: edition,
          color: "dark-3"
        }
      }
    },
    computed: {
      title() {
        if (this.type === 'editions') {
          return this.editionLabelAndColorByPrefix.EE.label
        }
        return this.$props.type
      }
    },
  }
</script>
