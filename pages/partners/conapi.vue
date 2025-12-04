<template>
    <div class="main">
        <Head>
            <Title>Conapi & Kestra: Practical Integration Patterns for the Enterprise</Title>
            <Meta
                name="description"
                content="The Conapi team delivers the plumbing without the pain, enabling simple integration between Kestra workflows, JMS architectures, and Gravitee API management"
            />
        </Head>
        <PartnersConapiHeader/>


        <NuxtLazyHydrate when-visible>
            <div class="container">
                <div class="row justify-content-center conapi-info-content">
                    <div class="col-md-9">
                        <h3 class="text-center">Conapi: 20+ Years of Integration Expertise</h3>
                        <p class="text-center">
                            Conapi specializes in connecting legacy systems with modern tools. They ensure production-ready integration without a complete "rip-and-replace" of existing infrastructure, acting as the bridge between API management, messaging systems, and workflow automation.
                        </p>
                    </div>
                </div>
                <div class="business-container">
                    <div class="business-by-us">
                        <div class="info-content">
                            <div class="info-item w-75 ">
                                <h3>
                                    "Our clients need to connect legacy JMS systems to modern automation without throwing everything away. This integration protects existing infrastructure while enriching APIs with Kestra data. It's the practical bridge enterprises actually need."
                                </h3>
                            </div>
                            <div class="vertical-line"></div>
                            <div class="info-item">
                                <p>Stefan Fritz</p>
                                <span>CEO, Conapi</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="conapi-content">
                    <div class="row mb-5">
                        <div class="col-md-6 image-container" data-aos="fade-right">
                            <NuxtImg width="560" height="420" loading="lazy" format="webp" class="img-fluid"
                                     src="/partners/conapi/artworks_features-1.png"
                                     alt="Pragmatic Integration Approach"/>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <div>
                                <h3>Pragmatic Approach</h3>
                                <p class="mt-3">
                                    Conapi specializes in connecting existing enterprise landscapes with modern requirements without unnecessary complexity. Their focus is on making enterprise integration actually work in production, not just in theory. By prioritizing practical bridges over total system replacements, they help organizations connect what they have with what they need, ensuring a smooth transition to modern orchestration without discarding valuable legacy investments.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-5">
                        <div class="col-md-6 order-1 order-md-0 d-flex justify-content-center align-items-center"
                             data-aos="fade-right">
                            <div>
                                <h3>Native JMS Support for Kestra</h3>
                                <p class="mt-3">
                                    To support enterprise messaging requirements, Conapi has contributed the official JMS Integration Plugin to the Kestra open-source ecosystem. This contribution brings native support for the Java Message Service, allowing Kestra to integrate seamlessly with existing ESBs and event-driven architectures. The plugin provides robust components to trigger flows when messages arrive on a queue, produce messages to destinations, and consume messages during workflow execution.
                                </p>
                            </div>
                        </div>
                        <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                            <NuxtImg width="560" height="420" loading="lazy" format="webp" class="img-fluid"
                                     src="/partners/conapi/artworks_features-2.png"
                                     alt="Native JMS Support"/>
                        </div>
                    </div>
                    <div class="row mb-5">
                        <div class="col-md-6 image-container" data-aos="fade-right">
                            <NuxtImg width="560" height="420" loading="lazy" format="webp" class="img-fluid"
                                     src="/partners/conapi/artworks_features-3.png"
                                     alt="Unifying API Management"/>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <div>
                                <h3>Unifying API Management and Orchestration</h3>
                                <p class="mt-3">
                                    As a key partner of both Kestra and Gravitee, Conapi has developed a powerful bridge between API management and workflow orchestration. This integration enables direct synchronous data enrichment for real-time scenarios like dynamic pricing, as well as JMS-based integration for long-running processes. This dual approach prevents API timeouts by triggering workflows via queues with correlation IDs, maintaining system responsiveness.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-5">
                        <div
                            class="col-md-6 order-1 order-md-0 d-flex flex-column justify-content-center align-items-center"
                            data-aos="fade-right">
                            <div>
                                <h3>Bridging Legacy and Modern Architectures</h3>
                                <p class="mt-3">
                                    Conapi helps organizations navigate the transition from legacy monoliths to modern, event-driven architectures. They have demonstrated success in complex sectors like manufacturing and ERP management. By implementing Conapi’s patterns, teams can handle long-running workflows such as multi-step approvals or complex order processing without architectural compromises. This ensures that legacy investments in Enterprise Service Buses remain valuable while adding the agility of Kestra’s orchestration.
                                </p>
                            </div>
                        </div>
                        <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                            <NuxtImg width="560" height="420" loading="lazy" format="webp" class="img-fluid"
                                     src="/partners/conapi/artworks_features-4.png"
                                     alt="Bridging Legacy and Modern"/>
                        </div>
                    </div>
                    <div class="row mb-5">
                        <div class="col-md-6 image-container" data-aos="fade-right">
                            <NuxtImg width="560" height="420" loading="lazy" format="webp" class="img-fluid"
                                     src="/partners/conapi/artworks_features-5.png"
                                     alt="Tailored Migration Solutions"/>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <div>
                                <h3>Tailored Migration Solutions</h3>
                                <p class="mt-3">
                                    Conapi deliver tested patterns and a clear migration path from legacy systems. Whether you need to bridge synchronous API calls with asynchronous backend processes or require specific guidance on robust message queuing, Conapi provides the plumbing without the pain. Their expertise allows teams to implement these patterns today, ensuring a scalable and reliable integration strategy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Contact Conapi"
                subtitle="Ready to bridge your legacy systems with modern orchestration? Conapi's experts are here to assist you."
                purpleButtonText="Contact Conapi"
                purpleButtonHref="https://conapi.at/contact"
            />
        </NuxtLazyHydrate>
    </div>
</template>
<script setup>

</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .story-container {
        :deep(.bd-markdown) {
            p {
                font-size: $h6-font-size;
                line-height: calc($spacer * 1.6);
            }

            h3 {
                margin-top: calc($spacer * 4.12);
                margin-bottom: 3rem;
                padding-left: calc($spacer * 0.6) !important;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);
            }

            h2 {
                margin-top: auto;
                padding-top: 3rem;
                margin-bottom: 1rem;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);
            }


            ul > li::marker {
                color: #736BCD;
            }
        }


    }

    .conapi-info-content {
        margin-top: 5rem;
        @include media-breakpoint-down(lg) {
            margin-top: 16rem;
        }

        h3 {
            color: #FFFFFF;
            font-weight: 600;
        }

    }

    p, ul > li {
        line-height: 1.5rem;
    }

    :deep(h3 > a) {
        font-size: $h2-font-size;
        color: $white;
    }

    :deep(h3) {
        margin-top: $h1-font-size !important;
        padding: 0 !important;
        font-weight: 300;
    }

    :deep(p), :deep(li) {
        font-weight: 400;
        color: $white;
    }

    :deep(a) {
        color: $purple-35;
    }


    :deep(section div.main) {
        padding-top: 4rem;
    }

    .business-container {
        margin-top: calc($spacer * 4);
        margin-bottom: calc($spacer * 4);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc($spacer * 4);
        background-color: $black-2;
        border-radius: calc($spacer * 0.5);
        border: 1px solid #252526;
        overflow: hidden;
        position: relative;
        z-index: 10;

        @include media-breakpoint-down(lg) {
            margin-top: 3rem;
            padding: calc($spacer * 1);
        }

        &::after,
        &::before {
            content: "";
            position: absolute;
            width: 18rem;
            height: 18rem;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
            filter: blur(60px);
            z-index: 0;
        }

        &::after {
            left: 80%;
            top: -43%;
        }

        &::before {
            right: 77%;
            bottom: -15%;
        }

        .business-by-us {
            .info-content {
                position: relative;
                z-index: 10;
                display: flex;
                gap: 2rem;
                justify-content: center;
                align-items: center;

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                }

                .vertical-line {
                    background-color: #FFFFFF30;
                    min-height: calc($spacer * 6.875);
                    width: 1px;
                    @include media-breakpoint-down(lg) {
                        height: 1px;
                        min-height: 1px;
                        width: 100%;
                    }
                }

                .info-item {
                    display: flex;
                    flex-direction: column;

                    h3, p {
                        margin: 0;
                        font-weight: 600;
                        color: $white;
                    }

                    h3 {
                        font-family: $font-family-sans-serif;
                        font-size: $font-size-lg;
                        margin-top: 0 !important;
                    }

                    p {
                        font-size: $font-size-lg;
                        line-height: 30px;
                    }

                    span {
                        font-size: $font-size-sm;
                        line-height: 30px;
                        color: $purple;
                        font-weight: 400;
                    }
                }
            }
        }
    }

    .conapi-content {

        h3 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
            margin: 0;
        }

        p {
            color: $white;
            font-size: $font-size-md;
            font-weight: 300;
            max-width: calc($spacer * 28);

            b {
                color: $white;
                font-weight: 600;
            }
        }

        .image-container {
            position: relative;
            z-index: 10;

            @include media-breakpoint-down(lg) {
                &::after {
                    left: 13rem;
                }

                &::before {
                    left: -3rem;
                    top: 5rem;
                }
            }

            @include media-breakpoint-down(md) {
                &::after {
                    left: 23rem;
                }
            }
        }
    }
</style>