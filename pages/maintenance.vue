<template>
  <div class="maintenance-page">
    <div class="container">
      <div class="maintenance-content">
        <div class="maintenance-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 6.9 20.1 6 19 6H16L14 4H10L8 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="#6c757d"/>
          </svg>
        </div>

        <h1 class="maintenance-title">
          Site Under Maintenance
        </h1>

        <p class="maintenance-description">
          We're currently updating our systems to serve you better.
          The site will be back online shortly.
        </p>

        <div class="maintenance-details">
          <p>We apologize for any inconvenience. Please check back in a few minutes.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Site Under Maintenance | Kestra',
  description: 'Kestra is currently under maintenance. We\'ll be back shortly.',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.maintenance-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.maintenance-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.maintenance-icon svg {
  width: 80px;
  height: 80px;
  opacity: 0.8;
}

.maintenance-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.maintenance-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.maintenance-details {
  margin-bottom: 2rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .maintenance-title {
    font-size: 2rem;
  }

  .maintenance-description {
    font-size: 1.1rem;
  }

  .container {
    padding: 1rem;
  }

  .maintenance-content {
    padding: 2rem 1.5rem;
  }
}
</style>
