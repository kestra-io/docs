<template>
    <div class="fw-bold d-flex gap-2 flex-wrap mb-3">
        <p class="mb-0">Available on:</p>
        <span v-if="version" class="badge d-flex align-items-center bg-body-tertiary">{{version}}</span>
    <component
        :is="editionInfo(edition).link ? 'a' : 'span'"
        v-for="edition in editions.split(',').filter(edition => edition.trim())"
        :key="edition"
        :href="editionInfo(edition).link"
        class="badge d-flex align-items-center text-decoration-none"
        :class="`bg-${editionInfo(edition).color}`"
    >
        {{ editionInfo(edition).label }}
    </component>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type EditionInfo = Record<string, { label: string; color: string; link?: string }>;

defineProps({ version: { type: String, default: '' }, editions: { type: String, default: '' } })

const color = ref('secondary')

const editionLabelAndColorByPrefix: EditionInfo = {
  OSS: {label: "Open Source Edition", color: "primary", link: "https://kestra.io/features"},
  EE: {label: "Enterprise Edition", color: "secondary", link: "https://kestra.io/enterprise"},
  Cloud: {label: "Cloud", color: "dark-3", link: "https://kestra.io/cloud"},
  CLOUD_TEAM: {label: "Cloud Team plan", color: "success"},
  CLOUD_PRO: {label: "Cloud Pro plan", color: "info"},
}

const editionInfo = (edition: string): { label: string; color: string; link?: string } => {
  return editionLabelAndColorByPrefix?.[edition] ?? {
    label: edition,
    color: "dark-3"
  }
}
</script>
