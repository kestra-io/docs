import type { App } from 'vue';
import {defineComponent, h} from 'vue';

export default (app: App) => {
  // Register global NuxtLink as the standard <a href> tag
  app.component('NuxtLink', defineComponent((props, { slots }) => () => h('a', { href: typeof props.to === 'string' ? props.to : props.href }, slots.default?.())))
  app.component('NuxtImg', defineComponent(() => () => h('img')))
};