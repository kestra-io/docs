<template>
    <section id="see-it-in-action" class="see-action">
        <h4 class="see-action__title">See it in action</h4>

        <div class="video-embed">
            <iframe
                src="https://www.youtube.com/embed/xnGYiWFM2uk"
                title="Kestra — Product Overview (2025)"
                loading="lazy"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
        </div>
    </section>

</template>


<style scoped lang="scss">
    @import "../../assets/styles/variable";
    
    .see-action {
        .see-action__title {
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--ks-content-primary);
        }
    
        display: block;
        padding: 2rem 0;
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);
        
        @include media-breakpoint-up(lg) {
            margin: 0 -2rem;
            padding: 2rem;
        }
    
        .video-embed {
            width: 100%;
            max-width: 430px;
            border-radius: 8px;
            overflow: hidden;
            background: $black-1;
            aspect-ratio: 430 / 245;
            position: relative;
        
            &::before {
                content: "";
                display: block;
                padding-top: 56.97674418604651%;
            }
        
            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
                display: block;
            }
        }
    }
</style>
