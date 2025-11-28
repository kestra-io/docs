<template>
    <div class="fw-bold d-flex gap-2 flex-wrap mb-3">
        <p class="mb-0">Available on:</p>
        <span v-if="version" class="badge d-flex align-items-center bg-body-tertiary">{{version}}</span>
        <span
            v-for="edition in editions.split(',').filter(edition => edition.trim())"
            :key="edition"
            class="badge d-flex align-items-center"
            :class="`bg-${editionInfo(edition).color}`"
        >
            {{ editionInfo(edition).label }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { editionLabelAndColorByPrefix } from '../../utils/badgeMaps.mjs';

defineProps({ version: { type: String, default: '' }, editions: { type: String, default: '' } })

const editionInfo = (edition: string): { label: string; color: string } => {
  return editionLabelAndColorByPrefix?.[edition] ?? {
    label: edition,
    color: "dark-3"
  }
}
</script>
