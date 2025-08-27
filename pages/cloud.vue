<template>
    <div class="cloud">
        <Head>
            <Title>Kestra Cloud Early Adopter Program</Title>
            <Meta
                name="description"
                content="Be among the first to experience Kestra Cloud with exclusive access <br>before general availability."
            />
        </Head>

        <CloudHeader />
        <CloudFeatures />
    </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/variable";

.cloud {
    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 80%;
        height: 100%;
        background-image: url("../components/cloud/images/gradient_top.png");
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.3s ease;
        z-index: -1;
    }

    @media (max-width: 575.98px) {
        &::after {
            right: auto;
            left: 0;
            transform: scaleX(-1);
        }
    }

    @media (max-width: 767.98px) {
        &::after {
            right: auto;
            left: 0;
            transform: scaleX(-1);
        }
    }

    @media (max-width: 991.98px) {
        &::after {
            right: auto;
            left: 0;
            transform: scaleX(-1);
        }
    }

    & :deep(.highlight) {
        background: linear-gradient(90deg, #51cff7 57.35%, #4782f5 95.94%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }

    & :deep(h1),
    & :deep(h2),
    & :deep(h3),
    & :deep(h4),
    & :deep(h5),
    & :deep(h6) {
        color: $white;
        font-weight: 600;
    }

    & :deep(h1) {
        font-size: $font-size-3xl;
    }

    & :deep(h2) {
        font-size: $font-size-2xl;
    }

    & :deep(h3) {
        font-size: $font-size-2xl;
    }

    & :deep(h4) {
        font-size: $font-size-xl;
    }

    & :deep(h5) {
        font-size: $font-size-lg;
    }

    & :deep(h6) {
        font-size: $font-size-md;
        font-weight: 600;
    }

    & :deep(p) {
        font-size: 14px;
        color: $white-1
    }

    & :deep(div) {
        color: $white;
    }

    & :deep(.form) {
        & h4,
        & p,
        & div {
            color: black;
        }

        & div {
            &.success {
                padding-top: 100px;
            }

            font-size: $font-size-sm;
        }
    }
}
</style>
