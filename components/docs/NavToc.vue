<template>
    <div id="nav-toc-global" class="bd-toc d-lg-flex justify-content-end">
        <div>
            <template v-if="links.length > 0" class="bd-contents-list">
                <button
                    class="btn d-lg-none"
                    :class="!tableOfContentsExpanded ? '' : 'collapsed'"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#tocContents"
                    :aria-expanded="tableOfContentsExpanded"
                    aria-controls="tocContents"
                    @click="tableOfContentsExpanded = !tableOfContentsExpanded"
                >
                    Table of Contents
                    <ChevronUp v-if="tableOfContentsExpanded"/>
                    <ChevronDown v-else/>
                </button>

                <div class="collapse bd-toc-collapse" id="tocContents">
                    <slot name="header"></slot>
                    <strong class="d-none d-lg-block h6 mb-2">Table of Contents</strong>
                    <nav id="nav-toc">
                        <ul class="ps-0 pt-2 pt-lg-0 mb-2" v-for="tableOfContent in links">
                            <li v-if="tableOfContent.depth > 1 && tableOfContent.depth < 6 && tableOfContent.text"
                                @click="closeToc" class="table-content">
                                <a @click="menuNavigate" :href="`#${tableOfContent.id}`" :class="`depth-${tableOfContent.depth}`">{{ tableOfContent.text }}</a>
                            </li>
                            <ul class="ps-0 pt-2 pt-lg-0"
                                v-if="tableOfContent.children && tableOfContent.children.length">
                                <template v-for="item in tableOfContent.children">
                                    <li v-if="item.depth > 1 && item.depth < 6" @click="closeToc"
                                        :class="{'mt-3': item.depth === 2}">
                                        <a @click="menuNavigate" :href="`#${item.id}`"
                                           :class="`depth-${item.depth}`">{{ item.text }}</a>
                                    </li>
                                </template>
                            </ul>
                        </ul>
                    </nav>
                </div>
            </template>

            <div class="d-none d-lg-block pt-4 bd-social-list">
                <SocialsList :editLink :stem :extension/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import SocialsList from "../common/SocialsList.vue";

interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

const props = withDefaults(defineProps<{
  links?: TocLink[];
  editLink?: boolean;
  extension?: string;
  stem?: string;
  capitalize?: boolean;
}>(), {
  links: () => [],
  capitalize: false
});

const tableOfContentsExpanded = ref(false);
const showThankYou = ref(false);

const route = useRoute();

function closeToc() {
  tableOfContentsExpanded.value = false;
  const toc = document.getElementById('tocContents');
  if (toc) toc.classList.remove("show");
}

function removeActiveTab() {
  document.querySelectorAll('.depth-2').forEach((item) => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.depth-3').forEach((item) => {
    item.classList.remove('active');
  });
}

function activateMenuItem(
  item: TocLink,
  index: number,
  linkArray: TocLink[],
  removeActiveTab: () => void
) {
  if (item?.id) {
    const childrenLinkPosition = document.querySelector(`#${item.id}`)?.getBoundingClientRect();
    const prevChildrenLinkPosition = index > 0 ? document.querySelector(`#${linkArray[index - 1].id}`)?.getBoundingClientRect()?.top : undefined;
    if (childrenLinkPosition?.top !== undefined && childrenLinkPosition.top <= 160) {
      const activeTapItem = document.querySelector(`.right-menu a[href='#${item.id}']`);
      if (activeTapItem && !activeTapItem.classList.contains('active')) {
        if ((prevChildrenLinkPosition === undefined || prevChildrenLinkPosition <= 0)) {
          removeActiveTab();
          activeTapItem.classList.add('active');
        }
      }
    }
  }
}

function handleScroll() {
  if (window.scrollY === 0) {
    removeActiveTab();
  } else {
    props.links.forEach((link, i) => {
      activateMenuItem(link, i, props.links, removeActiveTab);
      if (link.children) {
        link.children.forEach((childrenLink, index) => {
          activateMenuItem(childrenLink, index, link.children!, removeActiveTab);
        });
      }
    });
  }
}

function scrollIntoView(id: string) {
  const element = document.getElementById(id);
  nextTick(() => {
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ block: "nearest", inline: "nearest" });
      }, 100);
    } else {
      setTimeout(() => {
        nextTick(() => {
          const updatedElement = document.getElementById(id);
          if (updatedElement) {
            updatedElement.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        });
      }, 1000);
    }
  });
}

function menuNavigate(e: Event) {
  const target = e.target as HTMLElement;
  const id = target.getAttribute('name') || target.getAttribute('href')?.replace(/^#/, '');
  if (id) {
    scrollIntoView(id);
    window.location.hash = id;
    setTimeout(() => {
      removeActiveTab();
      target.classList.add('active');
    }, 1000);
  }
}

function scrollToHash() {
  const hash = route.hash;
  if (hash) {
    const targetId = hash.substring(1);
    scrollIntoView(targetId);
  }
}

onMounted(() => {
  scrollToHash();
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(
  () => route.params,
  () => {
    showThankYou.value = false;
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .bd-toc {
        transition: all ease 0.2s;
        transform: translateX(0);
        @include media-breakpoint-down(lg) {
            margin: $rem-1 0;
        }

        &::-webkit-scrollbar {
            display: none;
        }

        > div {

            @include media-breakpoint-up(lg) {
                position: sticky;
                top: 7rem;
                max-width: 308px;
                width: 100%;
                height: fit-content;
                overflow-x: hidden;
                overflow-y: auto;
            }
        }

        @include media-breakpoint-up(lg) {
            margin-top: 4rem;
            max-height: 100%;
            border: 0;
            border-left-width: 1px;
            border-style: solid;
            border-image: linear-gradient(to bottom, #181818, #5c5c5c, #181818) 1 100%;
            background-color: rgba($black-4, .7);
            padding-bottom: 1rem;
        }

        nav {
            padding-bottom: 1.5rem;
            border-bottom: 1px solid $black-6;
            overflow-y: auto;
            max-height: 60vh;
            overflow-x: hidden;
            position: relative;

            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: $primary-1;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #370883;
            }

            @include font-size(.875rem);

            ul {
                margin-bottom: 0;
                list-style: none;

                &:has(a.active) {
                    .table-content {
                        a {
                            color: $purple;
                            font-weight: 500;
                            border-left-color: $purple;
                            border-left: 1px solid $purple !important;
                        }
                    }
                }

                li {
                    a {
                        border-left: 1px solid transparent;
                        padding-left: 0.75rem;
                        color: $white-1;
                        font-weight: 500;
                        cursor: pointer;

                        @for $i from 2 through 6 {
                            &.depth-#{$i} {
                                padding-left: calc(0.5rem * ($i - 2) + 2rem);
                            }
                        }

                        &:hover,
                        &.active {
                            color: $purple;
                            border-left: 1px solid $purple-36 !important;
                        }
                    }
                }
            }

            a {
                display: block;
                padding: .125rem .75rem;
                color: inherit;
                text-decoration: none;
                color: var(--bs-gray-700);
                border-left: 1px solid transparent;

                code {
                    font: inherit;
                }
            }
        }

        .h6 {
            color: $white-1;
            font-size: $font-size-sm;
            line-height: 1.875rem;
            font-weight: 600;
            padding: .5rem;
        }

        hr {
            border-color: var(--bs-gray-600);
        }
    }

    .btn {
        border: 1px solid $black-6;
        border-radius: 8px;
        text-align: center;
        width: 100%;
        display: inline-block;
        background: $black-4;
        color: var(--bs-gray-500);
        font-size: $font-size-sm;

        &.collapsed {
            border-radius: 8px 8px 0 0;
        }

        &:hover,
        &:focus,
        &:active,
        &[aria-expanded="true"] {
            background: $black-4;
            color: $white;
            font-size: 16px;
        }
    }

    .bd-toc-collapse {
        strong {
            margin-left: calc($spacer * 2);
        }

        @include media-breakpoint-down(lg) {
            nav {
                padding-bottom: $spacer;
                @include border-radius(var(--bs-border-radius));
            }
        }

        @include media-breakpoint-up(lg) {
            display: block !important; // stylelint-disable-line declaration-no-important
        }
    }

    .bd-social-list, .bd-toc-collapse {
        @include media-breakpoint-down(lg) {
            border-top-width: 0 !important;
            border: 1px solid $black-6;
            border-radius: 0 0 8px 8px;
        }

        button:hover {
            color: $purple-36 !important;
        }

        ul, :deep(ul) {
            li {
                a {
                    font-weight: 500;

                    &:hover {
                        color: $purple-36 !important;
                        border-left: 1px solid $purple-36 !important;
                    }
                }
            }
        }
    }
</style>