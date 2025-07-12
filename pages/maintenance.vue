<template>
  <Error
    :error="{
      statusCode: 503,
      message: 'Maintenance mode'
    }"
    title="Maintenance Mode"
    description="The site is currently undergoing maintenance. Please check back later."
  />
</template>
