<template>
  <div>
    <strong class="h6 my-2 ms-3 title">Contribute</strong>
    <nav class="social">
      <ul>
        <li v-if="page.editLink !== false">
          <a :href="editLink" target="_blank"><Github /> Edit this page</a>
        </li>
        <li>
          <a href="https://kestra.io/slack" target="_blank"
            ><Slack /> Join us on Slack</a
          >
        </li>
        <li>
          <a href="https://github.com/kestra-io/kestra" target="_blank"
            ><Github /> GitHub</a
          >
        </li>
        <li>
          <a href="https://twitter.com/kestra_io" target="_blank"
            ><twitter /> Twitter</a
          >
        </li>
        <li>
          <a href="https://www.linkedin.com/company/kestra" target="_blank"
            ><linkedin /> LinkedIn</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup>
import Slack from "vue-material-design-icons/Slack.vue";
import Github from "vue-material-design-icons/Github.vue";
import Linkedin from "vue-material-design-icons/Linkedin.vue";
import Twitter from "vue-material-design-icons/Twitter.vue";

const props = defineProps({
  page: {
    type: Object,
    default: {},
  },
});

const editLink = computed(() => {
  return `https://github.com/kestra-io/kestra.io/edit/main/content/${props.page._file}`;
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/variable";

nav {
  @include font-size($font-size-xs);
  line-height: 1.188rem;
  ul {
    padding-left: 0.75rem;
    margin-bottom: 0;
    list-style: none;
    li {
      a {
        padding-left: 0.75rem;

        @for $i from 2 through 6 {
          &.depth-#{$i} {
            padding-left: calc(0.75rem * ($i - 2) + 0.75rem);
          }
        }

        &:hover,
        &.active {
          color: var(--bs-primary);
          font-weight: 500;
          border-left: 1px solid $purple-35;
        }
      }
    }
  }
}
.h6 {
  color: var(--bs-gray-700);
  font-size: $font-size-sm;
  line-height: 1.875rem;
  font-weight: 600;
}
.social ul li a {
  line-height: 1.5rem;
  font-weight: 300;
  font-size: $font-size-sm;
}

a {
  display: block;
  padding: 0.125rem 0.75rem;
  color: inherit;
  text-decoration: none;
  color: var(--bs-gray-700);
}
</style>