<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top"
        :class="{open: isOpen, scrolled: props.scrolled }">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick" @contextmenu.prevent="showDownloadLogosModal">
                <img :src="isOpen ? '/logo-black.svg' : '/logo-white.svg'"
                    alt="Kestra, Open source declarative data orchestration" />
            </NuxtLink>

            <div class="download-logos-container" v-if="showDownloadLogos" @click="closeDownloadLogosModal">
                <div class="download-logos" @click.stop>
                    <NuxtImg width="24px" height="24px" loading="lazy" format="webp" class="close-icon"
                        src="/landing/header-menu/window-close.svg" alt="close" @click="closeDownloadLogosModal" />
                    <p class="title">Looking for our logo?</p>
                    <NuxtImg width="236px" height="123px" loading="lazy" format="webp" class="img-fluid"
                        src="/landing/header-menu/download-logo.svg" alt="Looking for our logo" />
                    <a download class="btn btn-animated btn-purple-animated mt-2" href="/kestra-logo-kit.zip">
                        Download Logo Pack
                    </a>
                </div>
            </div>

            <div class="nav-items d-flex align-items-center">
                <a @click="globalClick(true)" href="#" class="btn btn-sm  icon-button p-0 d-lg-none"
                    data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
                    <Magnify />
                </a>
                <button class="navbar-toggler d-flex d-lg-none align-items-center gap-2" @click="globalClick(isOpen)"
                    type="button" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="menu-text">Menu</span>
                    <Segment v-if="!isOpen" />
                    <Close v-if="isOpen" />
                </button>
            </div>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-5">
                    <li class="nav-item dropdown" @mouseover="mouseOver('product')" @mouseleave="mouseOut('product')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Product
                            <ChevronDown v-if="!showMenuId || showMenuId !== 'product'"
                                class="d-inline-block dropdown-chevron" />
                            <ChevronUp v-else class="d-inline-block dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.product.items" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                            <strong v-if="item.tag" class="tag">{{ item.tag }}</strong>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('solutions')"
                        @mouseleave="mouseOut('solutions')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Solutions
                            <ChevronDown v-if="!showMenuId || showMenuId !== 'solutions'"
                                class="d-inline-block dropdown-chevron" />
                            <ChevronUp v-else class="d-inline-block dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">Capabilities</p>
                                <li v-for="item in menuItems.solutions.capabilities" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Roles</p>
                                <li v-for="item in menuItems.solutions.roles" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Industries</p>
                                <li v-for="item in menuItems.solutions.industries" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">Resources</p>
                                <li v-for="item in menuItems.solutions.resources" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('resources')"
                        @mouseleave="mouseOut('resources')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Learn
                            <ChevronDown v-if="!showMenuId || showMenuId !== 'resources'"
                                class="d-inline-block dropdown-chevron" />
                            <ChevronUp v-else class="d-inline-block dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.resources.mainItems" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.resources.additionalItems" :key="item.link">
                                    <NuxtLink class="dropdown-item" :href="item.link" @click="globalClick(true)">
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/plugins" role="button" @click="globalClick(true)">
                            <span>Plugins</span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link dropdown-toggle" href="/pricing" role="button"
                            @click="globalClick(true)">
                            <span>Pricing</span>
                        </NuxtLink>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button nav-footer">
                    <li class="nav-item">
                        <GithubButton :small="true"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-dark btn-sm" />
                        <NuxtLink @click="globalClick(true)"
                            class="d-none mb-1 mn-sm-0 btn btn-sm btn-secondary btn-sm me-0 me-sm-2 d-lg-inline-block"
                            href="/demo">
                            <span>
                                Talk to us
                            </span>
                        </NuxtLink>
                        <NuxtLink @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-primary btn-sm get-started"
                            href="/docs/getting-started/quickstart#start-kestra">
                            <span>
                                Get Started!
                            </span>
                        </NuxtLink>
                        <NuxtLink @click="globalClick(true)"
                            class="d-lg-none d-sm-inline-block d-xs-block mb-1 mn-sm-0 btn btn-secondary btn-md"
                            href="/demo">
                            <span>
                                Talk to Us
                            </span>
                        </NuxtLink>
                        <a @click="globalClick(true)" href="#" id="header-search-button"
                            class="btn btn-sm d-none d-lg-inline-block icon-button" data-bs-toggle="modal"
                            data-bs-target="#search-modal" title="Search">
                            <Magnify />
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="d-lg-block d-none menu-container" :style="{ opacity: showMenu || mouseoverMenu ? 100 : 0 }">
            <div class="header-arrow"
                :style="{ transform: `translateY(12px) translateX(${headerArrowTranslateX}px) rotate(45deg)` }"></div>
            <div class="menu-shadow-container">
                <div class="header-menu" @mouseover="mouseOverMenu()" @mouseleave="mouseLeaveMenu()" :style="headerMenuStyles">
                    <div class="header-menu-card">
                        <div @mouseleave="mouseLeaveMenu()" id="product" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100 gap-2 py-lg-0">
                                        <li v-for="item in menuItems.product.items" :key="item.link">
                                            <NuxtLink class="dropdown-item" :href="item.link"
                                                @click="globalClick(true)">
                                                <div>
                                                    <div class="same-row">
                                                        <component :is="item.icon" />
                                                        <span>{{ item.title }}</span>
                                                        <strong v-if="item.tag" class="tag">{{ item.tag }}</strong>
                                                    </div>
                                                    <p>{{ item.description }}</p>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLeaveMenu()" id="solutions" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="row m-0 w-100 pt-2 flex-nowrap">
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Capabilities</p>
                                        </div>
                                        <ul>
                                            <li v-for="item in menuItems.solutions.capabilities" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>{{ item.description }}</p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>By Roles</p>
                                        </div>
                                        <ul>
                                            <li v-for="item in menuItems.solutions.roles" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                        <div class="menu-title">
                                            <p>By Industries</p>
                                        </div>
                                        <ul>
                                            <li v-for="item in menuItems.solutions.industries" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Resources</p>
                                        </div>
                                        <ul class="d-flex flex-column w-100 list-unstyled">
                                            <li v-for="item in menuItems.solutions.resources" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLeaveMenu()" id="resources" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-6">
                                        <ul>
                                            <li v-for="item in menuItems.resources.mainItems" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>{{ item.description }}</p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6">
                                        <ul>
                                            <li v-for="item in menuItems.resources.additionalItems" :key="item.link">
                                                <NuxtLink class="dropdown-item" :href="item.link"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>{{ item.description }}</p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useNuxtApp } from '#app';
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import GithubButton from "../layout/GithubButton.vue";
import Magnify from "vue-material-design-icons/Magnify.vue";
import Close from "vue-material-design-icons/Close.vue";
import Segment from "vue-material-design-icons/Segment.vue";
import { menuSize } from "~/utils/menu-sizes";
import { menuItems } from '~/utils/menu-items';

interface Props {
    scrolled: boolean;
}

const props = defineProps<Props>();

const transparentHeader = ref(false);
const transparentClass = ref(false);
const isOpen = ref(false);
const showDownloadLogos = ref(false);
const showMenu = ref(false);
const showMenuId = ref<string | null>(null);
const headerArrowTranslateX = ref(0);
const headerMenuTranslateX = ref('50vw');
const mouseoverMenu = ref(false);
const headerMenuSize = ref({
    width: '0px',
    height: '0px',
});
const headerMenuPointerEvents = ref('none');
const navbar = ref<HTMLElement | null>(null);

interface Collapse {
    hide: () => void;
    show: () => void;
    toggle: () => void;
}

let collapse: Collapse | undefined = undefined;

const route = useRoute();
const nuxtApp = useNuxtApp();
transparentHeader.value = route.meta.transparentHeader === true;
transparentClass.value = route.meta.transparentHeader === true;

if (process.client) {
    window.addEventListener('scroll', handleScroll);
}

onMounted(() => {
    if (process.client) {
        // Wait for bootstrap to be available
        nextTick(() => {
            const bootstrap = nuxtApp.$bootstrap as any;
            collapse = bootstrap?.Collapse 
                ? new bootstrap.Collapse('#main-header', { toggle: false })
                : undefined;
        });

        document.documentElement.style.setProperty("--top-bar-height", navbar.value?.offsetHeight + "px");
    }
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('scroll', handleScroll);
        document.documentElement.style.removeProperty("--top-bar-height");
    }
});

interface MenuStyles {
    transform: string;
    width: string;
    height: string;
    pointerEvents: string;
}

const headerMenuStyles = computed<MenuStyles>(() => {
    return {
        transform: `translateX(${headerMenuTranslateX.value}) rotateX(-15deg)`,
        width: headerMenuSize.value.width,
        height: headerMenuSize.value.height,
        pointerEvents: headerMenuPointerEvents.value
    };
});

watch(() => route, (to) => {
    transparentHeader.value = to.meta.transparentHeader === true;
    transparentClass.value = to.meta.transparentHeader === true;
    globalClick(true);
}, { deep: true });

function mouseOverMenu() {
    mouseoverMenu.value = true;
    headerMenuPointerEvents.value = 'auto';
}

function mouseLeaveMenu() {
    showMenu.value = false;
    mouseoverMenu.value = false;
    showMenuId.value = null;
    headerMenuPointerEvents.value = 'none';
}

function mouseElement(element: HTMLElement) {
    if (element.classList.contains("nav-link")) {
        return element;
    } else {
        return element.closest(".nav-item")?.firstElementChild as HTMLElement;
    }
}

function mouseOver(id: string) {
    if (window.innerWidth > 991) {
        document.querySelectorAll('.header-menu-card-section').forEach(obj => {
            obj.classList.remove("opacity-100");
            obj.classList.remove("z-1");
        });
        let menu = document.getElementById(id);
        if (menu) {
            mouseoverMenu.value = false;
            showMenu.value = true;
            showMenuId.value = id;
            headerMenuSize.value = menuSize(id, window.innerWidth).size;
            headerMenuTranslateX.value = menuSize(id, window.innerWidth).headerMenuTranslateX;
            headerArrowTranslateX.value = menuSize(id, window.innerWidth).headerArrowTranslateX;
            menu.classList.add('z-1');
            menu.classList.add('opacity-100');
            headerMenuPointerEvents.value = 'auto';
        }
    }
}

function mouseOut(id: string) {
    if (window.innerWidth > 991) {
        let menu = document.getElementById(id);
        if (menu) {
            headerMenuPointerEvents.value = 'none';
            showMenu.value = false;
        }
    }
}

function handleScroll() {
    if (transparentHeader.value) {
        if (window.scrollY > 30) {
            transparentClass.value = false;
        } else {
            transparentClass.value = true;
        }
    }
}

function globalClick(close?: boolean) {
    if (window.innerWidth < 992) {
        if (close === true) {
            collapse?.hide();
            isOpen.value = false;
        } else if (close === false) {
            collapse?.show();
            isOpen.value = true;
        } else {
            collapse?.toggle();
            isOpen.value = !isOpen.value;
        }
        return;
    }
    if (close) {
        showMenu.value = false;
        mouseoverMenu.value = false;
        showMenuId.value = null;
        headerMenuPointerEvents.value = 'none';
        if (navbar.value?.classList.contains("open")) {
            isOpen.value = false;
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        }
        const element = document.querySelector('.nav-link.show');
        if (element) {
            element.classList.remove('show');
            (element.nextElementSibling as HTMLElement)?.classList.remove('show');
        }
    } else {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        isOpen.value = !isOpen.value;
    }
}

function logoClick() {
    if (route.path === "/") {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    globalClick(true);
}

function showDownloadLogosModal(event: Event) {
    event.preventDefault();
    showDownloadLogos.value = true;
}

function closeDownloadLogosModal() {
    showDownloadLogos.value = false;
}
</script>

<style lang="scss" src="../../assets/styles/components/header.scss" scoped />