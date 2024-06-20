<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="842" viewBox="0 0 100 842" fill="none">
        <path d="M50.5 0V91" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <g filter="url(#filter0_d_116_24)">
            <path d="M50 111C52.7614 111 55 108.761 55 106C55 103.239 52.7614 101 50 101C47.2386 101 45 103.239 45 106C45 108.761 47.2386 111 50 111Z" fill="white" class="connection-circle-1"/>
        </g>
        <path d="M50.5 121V212" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <line x1="50.5" y1="212" x2="50.5" y2="286" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <g filter="url(#filter1_d_116_24)">
            <circle cx="50" cy="301" r="5" fill="white" class="connection-circle-2"/>
        </g>
        <line x1="50.5" y1="316" x2="50.5" y2="390" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <line x1="50.5" y1="390" x2="50.5" y2="481" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <g filter="url(#filter2_d_116_24)">
            <circle cx="50" cy="496" r="5" fill="white" class="connection-circle-3"/>
        </g>
        <line x1="50.5" y1="511" x2="50.5" y2="602" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <line x1="50.5" y1="602" x2="50.5" y2="707" :stroke="strokeColor" stroke-dasharray="2 2"/>
        <g filter="url(#filter3_d_116_24)">
            <circle cx="50" cy="722" r="5" fill="white" class="connection-circle-4"/>
        </g>
        <defs>
            <filter id="filter0_d_116_24" x="32" y="88" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" v-if="showFilterCircle1">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="6.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_24"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_24" result="shape"/>
            </filter>
            <filter id="filter1_d_116_24" x="32" y="283" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" v-if="showFilterCircle2">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="6.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_24"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_24" result="shape"/>
            </filter>
            <filter id="filter2_d_116_24" x="32" y="478" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" v-if="showFilterCircle3">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="6.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_24"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_24" result="shape"/>
            </filter>
            <filter id="filter3_d_116_24" x="32" y="704" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" v-if="showFilterCircle4">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="6.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.209505 0 0 0 0 0.331673 0 0 0 0 1 0 0 0 0.7 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_24"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_24" result="shape"/>
            </filter>
        </defs>
    </svg>
</template>

<script>
  export default {
    props: {
      strokeColor: {
        type: String,
      }
    },
    data() {
      return {
        showFilterCircle1: false,
        showFilterCircle2: false,
        showFilterCircle3: false,
        showFilterCircle4: false,
      };
    },
    methods: {
      getConnectionCircleOffset (circleN) {
        const connectionCircle  = document.querySelector(`.connection-circle-${circleN}`);
        const bodyRect = document.body.getBoundingClientRect();
        const connectionCircleOffsetTop =  connectionCircle.getBoundingClientRect().top - bodyRect.top - 380;
        const connectionCircleOffsetBottom = connectionCircleOffsetTop + 150;
        return { top: connectionCircleOffsetTop, bottom: connectionCircleOffsetBottom, circleN };
      },
      connectionCircleAnimation ({ top, bottom, circleN }) {
        console.log('top', top);
        console.log('bottom', bottom);
        console.log('window.scrollY', window.scrollY);
        if (window.scrollY >= top && window.scrollY <= bottom) {
          this[`showFilterCircle${circleN}`] = true;
        }else {
          this[`showFilterCircle${circleN}`] = false;
        }
      },
    },
    mounted() {
      const connectionCircle1 =  this.getConnectionCircleOffset(1);
      const connectionCircle2 =  this.getConnectionCircleOffset(2);
      const connectionCircle3 =  this.getConnectionCircleOffset(3);
      const connectionCircle4 =  this.getConnectionCircleOffset(4);
      window.onscroll = () => {
        this.connectionCircleAnimation(connectionCircle1);
        this.connectionCircleAnimation(connectionCircle2);
        this.connectionCircleAnimation(connectionCircle3);
        this.connectionCircleAnimation(connectionCircle4);
      }
    }
  }
</script>

