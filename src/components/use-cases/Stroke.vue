<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="842"
    viewBox="0 0 100 842"
    fill="none"
  >
    <path d="M50.5 0V91" :stroke="strokeColor" stroke-dasharray="2 2" />
    <g filter="url(#filter0_stroke)">
      <path
        d="M50 111C52.7614 111 55 108.761 55 106C55 103.239 52.7614 101 50 101C47.2386 101 45 103.239 45 106C45 108.761 47.2386 111 50 111Z"
        fill="currentColor"
        class="connection-circle connection-circle-1"
      />
    </g>
    <path d="M50.5 121V212" :stroke="strokeColor" stroke-dasharray="2 2" />
    <line x1="50.5" y1="212" x2="50.5" y2="286" :stroke="strokeColor" stroke-dasharray="2 2" />
    <g filter="url(#filter1_stroke)">
      <circle cx="50" cy="301" r="5" fill="currentColor" class="connection-circle connection-circle-2" />
    </g>
    <line x1="50.5" y1="316" x2="50.5" y2="390" :stroke="strokeColor" stroke-dasharray="2 2" />
    <line x1="50.5" y1="390" x2="50.5" y2="481" :stroke="strokeColor" stroke-dasharray="2 2" />
    <g filter="url(#filter2_stroke)">
      <circle cx="50" cy="496" r="5" fill="currentColor" class="connection-circle connection-circle-3" />
    </g>
    <line x1="50.5" y1="511" x2="50.5" y2="602" :stroke="strokeColor" stroke-dasharray="2 2" />
    <line x1="50.5" y1="602" x2="50.5" y2="707" :stroke="strokeColor" stroke-dasharray="2 2" />
    <g filter="url(#filter3_stroke)">
      <circle cx="50" cy="722" r="5" fill="currentColor" class="connection-circle connection-circle-4" />
    </g>
    <defs>
      <filter
        id="filter0_stroke"
        x="32"
        y="88"
        width="36"
        height="36"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
        v-if="showFilterCircle1"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter1_stroke"
        x="32"
        y="283"
        width="36"
        height="36"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
        v-if="showFilterCircle2"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter2_stroke"
        x="32"
        y="478"
        width="36"
        height="36"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
        v-if="showFilterCircle3"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter3_stroke"
        x="32"
        y="704"
        width="36"
        height="36"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
        v-if="showFilterCircle4"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';

    defineProps<{
    strokeColor?: string;
    }>();

    const showFilterCircle1 = ref(false);
    const showFilterCircle2 = ref(false);
    const showFilterCircle3 = ref(false);
    const showFilterCircle4 = ref(false);

    const getConnectionCircleOffset = (circleN: number) => {
    const connectionCircle = document.querySelector(`.connection-circle-${circleN}`);
    if (!connectionCircle) return null;
    const bodyRect = document.body.getBoundingClientRect();
    const connectionCircleOffsetTop = connectionCircle.getBoundingClientRect().top - bodyRect.top - 380;
    const connectionCircleOffsetBottom = connectionCircleOffsetTop + 150;
    return {
        top: connectionCircleOffsetTop,
        bottom: connectionCircleOffsetBottom,
        circleN,
    };
    };

    const connectionCircleAnimation = (offset: { top: number; bottom: number; circleN: number } | null) => {
    if (!offset) return;
    const isVisible = window.scrollY >= offset.top && window.scrollY <= offset.bottom;
    if (offset.circleN === 1) showFilterCircle1.value = isVisible;
    if (offset.circleN === 2) showFilterCircle2.value = isVisible;
    if (offset.circleN === 3) showFilterCircle3.value = isVisible;
    if (offset.circleN === 4) showFilterCircle4.value = isVisible;
    };

    let scrollHandler: (() => void) | null = null;

    onMounted(() => {
    const connectionCircle1 = getConnectionCircleOffset(1);
    const connectionCircle2 = getConnectionCircleOffset(2);
    const connectionCircle3 = getConnectionCircleOffset(3);
    const connectionCircle4 = getConnectionCircleOffset(4);

    scrollHandler = () => {
        connectionCircleAnimation(connectionCircle1);
        connectionCircleAnimation(connectionCircle2);
        connectionCircleAnimation(connectionCircle3);
        connectionCircleAnimation(connectionCircle4);
    };

    window.addEventListener('scroll', scrollHandler);
    });

    onUnmounted(() => {
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
    }
    });
</script>

<style lang="scss" scoped>
    .connection-circle {
        color: var(--ks-content-color-highlight-inverse);
        box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
    }
</style>