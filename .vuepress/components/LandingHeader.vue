<template>
    <div class="home-header">
        <!-- Hero Start -->
        <section class="bg-half-260 d-table w-100">
            <div id="particles"></div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="title-heading">
                            <h1 class="heading text-dark mb-4">The modern, scalable<br />orchestrator & scheduler <br />open source platform.</h1>
                            <p class="para-desc mx-auto text-dark">
                                Kestra is an <strong>infinite scalable</strong> orchestrator platform, in order to create, run, schedule and monitor <strong>millions of complex</strong> pipelines.
                            </p>
                            <div class="mt-4 pt-2">
                                <a href="/docs/getting-started/" class="btn btn-light"><i class="mdi mdi-play-circle"></i> Get Started <i class="mdi mdi-arrow-right"></i></a>
                                <a href="/docs/" class="btn btn-light ml-4"><i class="mdi mdi-file-document"></i> Read the docs <i class="mdi mdi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </section>
        <!--end section-->
        <div class="position-relative">
            <div class="shape overflow-hidden text-white">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
        <!-- Hero End -->
    </div>
</template>

<script>
    import { tsParticles } from "tsparticles";

    export default {
        data() {
            return {

            }
        },
        mounted() {
            tsParticles
                .load(
                    "particles",
                    {
                        "autoPlay": true,
                        "detectRetina": true,
                        "fpsLimit": 30,
                        "particles": {
                            "color": {
                                "value": "#ffffff",
                                "animation": {
                                    "enable": false,
                                    "speed": 1,
                                    "sync": true
                                }
                            },
                            "life": {
                                "count": 0,
                                "delay": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0
                                    },
                                    "value": 0,
                                    "sync": false
                                },
                                "duration": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0.0001
                                    },
                                    "value": 0,
                                    "sync": false
                                }
                            },
                            "links": {
                                "blink": false,
                                "color": {
                                    "value": "#ffffff"
                                },
                                "consent": false,
                                "distance": 150,
                                "enable": true,
                                "frequency": 1,
                                "opacity": 0.7,
                                "triangles": {
                                    "enable": false,
                                    "frequency": 1
                                },
                                "width": 1,
                                "warp": true
                            },
                            "move": {
                                "angle": {
                                    "offset": 45,
                                    "value": 90
                                },
                                "attract": {
                                    "enable": false,
                                    "rotate": {
                                        "x": 600,
                                        "y": 1200
                                    }
                                },
                                "direction": "none",
                                "distance": 0,
                                "enable": true,
                                "gravity": {
                                    "acceleration": 9.81,
                                    "enable": false,
                                    "maxSpeed": 50
                                },
                                "noise": {
                                    "delay": {
                                        "random": {
                                            "enable": false,
                                            "minimumValue": 0
                                        },
                                        "value": 0
                                    },
                                    "enable": false
                                },
                                "outModes": {
                                    "default": "out",
                                    "bottom": "out",
                                    "left": "out",
                                    "right": "out",
                                    "top": "out"
                                },
                                "random": false,
                                "size": false,
                                "speed": 6,
                                "straight": false,
                                "trail": {
                                    "enable": false,
                                    "length": 10,
                                    "fillColor": {
                                        "value": "#000000"
                                    }
                                },
                                "vibrate": false,
                                "warp": true
                            },
                            "number": {
                                "density": {
                                    "enable": true,
                                    "area": 800,
                                    "factor": 1000
                                },
                                "limit": 0,
                                "value": 80
                            },
                            "opacity": {
                                "random": {
                                    "enable": false,
                                    "minimumValue": 0.1
                                },
                                "value": 0.5,
                                "animation": {
                                    "enable": false,
                                    "minimumValue": 0.1,
                                    "speed": 3,
                                    "sync": false
                                }
                            },
                            "reduceDuplicates": false,
                            "shadow": {
                                "blur": 5,
                                "color": {
                                    "value": "#000000"
                                },
                                "enable": false,
                                "offset": {
                                    "x": 0,
                                    "y": 0
                                }
                            },
                            "shape": {
                                "type": "circle"
                            },
                            "size": {
                                "random": {
                                    "enable": true,
                                    "minimumValue": 1
                                },
                                "value": 3,
                                "animation": {
                                    "destroy": "none",
                                    "enable": false,
                                    "minimumValue": 0.1,
                                    "speed": 20,
                                    "startValue": "max",
                                    "sync": false
                                }
                            },
                            "stroke": {
                                "width": 0,
                                "color": {
                                    "value": "#000000",
                                    "animation": {
                                        "enable": false,
                                        "speed": 1,
                                        "sync": true
                                    }
                                }
                            },
                            "twinkle": {
                                "lines": {
                                    "enable": false,
                                    "frequency": 0.05,
                                    "opacity": 1
                                },
                                "particles": {
                                    "enable": false,
                                    "frequency": 0.05,
                                    "opacity": 1
                                }
                            }
                        },
                        "pauseOnBlur": true,
                        "pauseOnOutsideViewport": true,
                    }
                )
                .catch((error) => {
                    console.error(error);
                });

        },
        components: {}
    }
</script>

<style lang="scss">
    @import "../styles/landing/variables";

    .home-header {
        @mixin home-common {
            background-size: cover;
            align-self: center;
            position: relative;
            background-position: center center;
        }

        #particles {
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 1;
            height: 100%;
        }

        .shape {
            z-index: 3;
        }

        .bg-half-260 {
            background: $primary;
            .container {
                position: relative;
                z-index: 2;
            }

            padding: 260px 0;
            @include home-common();
            position: relative;

            &:before{
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                opacity: 1;
                content: "";
                box-shadow: inset 0 0 150px 150px rgba(0, 0, 0, 0.75);
                background: radial-gradient(ellipse at top, rgba(29, 186, 175, 1), transparent),
                            radial-gradient(ellipse at center, rgba(0, 212, 255, 1), transparent),
                            radial-gradient(ellipse at bottom, rgba(251, 209, 11, 1), transparent);
            }
        }
    }

</style>
