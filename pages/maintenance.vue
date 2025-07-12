<template>
  <Error
    :error="{
      statusCode: 503,
      message: 'Maintenance mode',
      stack: ''
    }"
    title="Maintenance Mode"
    description="The site is currently undergoing maintenance. Please check back later."
  />
</template>

<script lang="ts" setup>
</script>