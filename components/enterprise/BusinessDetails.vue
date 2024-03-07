<template>
    <div class="container" data-aos="fade-left">
        <div class="business-details-container">
            <ul class="nav nav-tabs w-100 d-md-flex d-none" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="vault-tab" data-bs-toggle="tab" data-bs-target="#vault" type="button" role="tab" aria-controls="vault" aria-selected="false">
                        Vault Integration & Secret Management
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="sso-tab" data-bs-toggle="tab" data-bs-target="#sso" type="button" role="tab" aria-controls="sso" aria-selected="true">
                        SSO Support
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="audit-tab" data-bs-toggle="tab" data-bs-target="#audit" type="button" role="tab" aria-controls="audit" aria-selected="false">
                        Detailed Audit Logs
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="tenant-tab" data-bs-toggle="tab" data-bs-target="#tenant" type="button" role="tab" aria-controls="tenant" aria-selected="false">
                        Multi-Tenant Architecture
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="enterprise-tab" data-bs-toggle="tab" data-bs-target="#enterprise" type="button" role="tab" aria-controls="enterprise" aria-selected="false">
                        Enterprise Blueprints
                    </button>
                </li>
            </ul>
            <div class="dropdown d-md-none d-block w-100">
                <button class="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {{activeTab}}
                </button>
                <ul class="dropdown-menu bropdown-menu-bar" id="myTab" role="tablist"s>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="vault-tab" data-bs-toggle="tab" data-bs-target="#vault" type="button" role="tab" aria-controls="vault" aria-selected="false" @click="setTab('Vault Integration & Secret Management')">
                            Vault Integration & Secret Management
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="sso-tab" data-bs-toggle="tab" data-bs-target="#sso" type="button" role="tab" aria-controls="sso" aria-selected="true" @click="setTab('SSO Support')">
                            SSO Support
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="audit-tab" data-bs-toggle="tab" data-bs-target="#audit" type="button" role="tab" aria-controls="audit" aria-selected="false" @click="setTab('Detailed Audit Logs')">
                            Detailed Audit Logs
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="tenant-tab" data-bs-toggle="tab" data-bs-target="#tenant" type="button" role="tab" aria-controls="tenant" aria-selected="false" @click="setTab('Multi-Tenant Architecture')">
                            Multi-Tenant Architecture
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="enterprise-tab" data-bs-toggle="tab" data-bs-target="#enterprise" type="button" role="tab" aria-controls="enterprise" aria-selected="false" @click="setTab('Enterprise Blueprints')">
                            Enterprise Blueprints
                        </button>
                    </li>
                </ul>
            </div>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade" id="vault" role="tabpanel" aria-labelledby="vault-tab">
                    <div class="active-tab-content">
                        <img src="/landing/ee/copmany-stories/sso-support.svg" alt="">
                        <p>Vault Integration & Secret Management</p>
                    </div>
                </div>
                <div class="tab-pane fade show active" id="sso" role="tabpanel" aria-labelledby="sso-tab">
                    <div class="active-tab-content">
                        <img src="/landing/ee/copmany-stories/sso-support.svg" alt="">
                        <p>List all your workflow definitions in one place</p>
                    </div>
                </div>
                <div class="tab-pane fade" id="audit" role="tabpanel" aria-labelledby="audit-tab">
                    <div class="active-tab-content">
                        <img src="/landing/ee/copmany-stories/sso-support.svg" alt="">
                        <p>Detailed Audit Logs</p>
                    </div>
                </div>
                <div class="tab-pane fade" id="tenant" role="tabpanel" aria-labelledby="tenant-tab">
                    <div class="active-tab-content">
                        <img src="/landing/ee/copmany-stories/sso-support.svg" alt="">
                        <p>Multi-Tenant Architecture</p>
                    </div>
                </div>
                <div class="tab-pane fade" id="enterprise" role="tabpanel" aria-labelledby="enterprise-tab">
                    <div class="active-tab-content">
                        <img src="/landing/ee/copmany-stories/sso-support.svg" alt="">
                        <p>Enterprise Blueprints</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        activeTab: 'SSO Support'
      }
    },
    methods: {
      setTab(tabName) {
        this.activeTab = tabName
      },
    }
  }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .business-details-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: $black-2;
        border-radius: calc($spacer * 0.5);
        border: $block-border;
        background: url("landing/home/container-bg.svg") no-repeat 213% 47%;
        background-size: 102% 267%;
        margin-bottom: calc($spacer * 2.875);

        @include media-breakpoint-down(md) {
            border: none;
        }

        ul {
            flex-wrap: nowrap;
            justify-content: center;
            border: none;
            li {
                padding: 0;
                .active {
                    color: $white;
                    background: #4B0AAA;
                    border: none;
                    border-radius: 0;
                }
                button {
                    width: 100%;
                    height: 100%;
                    color: $white;
                    padding: 2rem;
                    border: none;
                    &:hover, &:focus {
                        border: none;
                    }

                    @include media-breakpoint-down(lg) {
                        padding: 1;
                    }

                    @include media-breakpoint-down(md) {
                        padding: calc($spacer * 0.5);
                        font-size: calc($font-size-base * 0.8);
                    }

                    @include media-breakpoint-down(sm) {
                        padding: calc($spacer * 0.1);
                        font-size: calc($font-size-base * 0.8);
                    }
                }
            }
        }

        .tab-content {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: calc($spacer * 1.813);
            position: relative;
            z-index: 10;
            overflow: hidden;

            &::before,
            &::after
            {
                content: "";
                position: absolute;
                width: calc($spacer * 12.5);
                height: calc($spacer * 12.5);
                background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
                filter: blur(100px);
                z-index: -5;
            }

            &::before {
                left: 41rem;
                top: 20rem;
            }

            &::after {
                right: 40rem;
                bottom: 22rem;
            }

            @include media-breakpoint-down(md) {
                padding: $spacer 0;
                overflow: unset;
                &::before {
                    left: 18rem;
                    top: 9rem;
                }

                &::after {
                    right: 18rem;
                    bottom: 9rem;
                }
            }

            .active-tab-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: calc($spacer * 1.813);

                p {
                    font-size: $h6-font-size;
                    font-weight: 300;
                    color: $white;
                    margin: 0;
                }

                img {
                    max-width: 100%;
                }
            }
        }

        .dropdown {
            .dropdown-toggle {
                position: relative;
                background-color: $black-4;
                z-index: 14;
                color: $white;
                font-style: $font-size-base;
                line-height: calc($spacer * 1.625);
                border-radius: calc($spacer * 0.5);
                border: 1px solid $black-6;

                &::after {
                    width: calc($spacer * 12.5);
                    height: calc($spacer * 12.5);
                    right: calc($spacer * -10.313);
                    top: calc($spacer * 0.688);
                    position: absolute;
                    content: "";
                    border: none;
                    background: url("/landing/ee/business-details/keyboard_arrow_down.svg");
                    background-repeat: no-repeat;
                }
            }

            .bropdown-menu-bar {
                width: 100%;
                color: $white;
                background-color: $black-4;
                border-radius: calc($spacer * 0.5);
                border: 1px solid $black-6;
            }
        }

    }
</style>