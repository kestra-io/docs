<template>
  <span v-bind="$attrs"
        :aria-hidden="title ? null : true"
        :aria-label="title"
        class="material-design-icon slack-icon"
        role="img"
        @click="$emit('click', $event)">
      <svg
          class="material-design-icon__svg"
          :fill="fillColor"
          :height="size"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.4135 0.453613H0.741211L7.4665 9.33692L1.17144 16.7889H4.07995L8.84116 11.1527L13.0689 16.737H18.7412L11.8205 7.59555L11.8327 7.61132L17.7916 0.557348H14.8831L10.4579 5.79576L6.4135 0.453613ZM3.87222 2.00936H5.63809L15.6102 15.1813H13.8443L3.87222 2.00936Z" fill="white"/>
    </svg>
  </span>
</template>
<script>
  export default {
    name: "SlackIcon",
    emits: ['click'],
    props: {
      title: {
        type: String,
      },
      fillColor: {
        type: String,
        default: "currentColor"
      },
      size: {
        type: Number,
        default: 20
      }
    }
  }
</script>