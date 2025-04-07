<template>
    <div class="livedemo">
        <Head>
            <Title>Kestra Preview Mode</Title>
            <Meta
                name="description"
                content="Instantly access a read-only version of Kestra to explore its interface and workflows, no setup required."
            />
        </Head>

        <PreviewAccessHeader />
        <PreviewAccessFeatures />
        <PreviewAccessDiscoverCloud />

    </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/variable";

.livedemo {

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url("../components/preview-access/images/Bg.svg?no-inline");
    background-size: contain;
    background-repeat: no-repeat;
    z-index: -3;
  }
  &::before {
    content: "";
    position: absolute;
    top: -15%;
    right: 0;
    width: 40%;
    height: 100%;
    background-image: url("../components/preview-access/images/gradients_right.png");
    background-size: contain;
    background-repeat: no-repeat;
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
        background: linear-gradient(90deg, #7C2EEA 57.35%, #658AF9 95.94%);
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
        & div
        {
            color: #000;
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
