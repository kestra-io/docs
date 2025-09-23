import type { App } from 'vue';
import {h} from 'vue';

export default (app: App) => {
  // Register global NuxtLink as the standard <a href> tag
  app.component('NuxtLink', (props, { slots }) => h('a', { href: typeof props.to === 'string' ? props.to : props.href }, slots.default?.()))
  app.component('NuxtImg', () => h('img'))
};