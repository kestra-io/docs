import type { App } from 'vue';
import {defineComponent, h} from 'vue';

export default (app: App) => {
  // Register global NuxtLink as the standard <a href> tag
  app.component('NuxtLink', defineComponent({
    setup: (props, { slots }) => () => h('a', { href: props.to ?? props.href }, slots.default?.()),
    props: ['to', 'href']
  }));
  app.component('NuxtImg', defineComponent(() => () => h('img')))
  app.component('ClientOnly', defineComponent((_, { slots }) => () => slots.default?.()))
};