<template>
    <div class="container" data-aos="fade-left">
        <div class="business-details-container">
            <ul class="nav nav-tabs w-100 d-md-flex d-none">
                <li class="nav-item w-25" v-for="(navLink, index) in navLinks" :key="navLink.id">
                    <button :class="`nav-link ${activeTabIndex === index ? 'active' : ''}`" @click="setTab(index)">
                        {{ navLink.tabText }}
                    </button>
                </li>
            </ul>
            <div class="dropdown d-md-none d-block w-100">
                <button class="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {{ navLinks[activeTabIndex].tabText }}
                </button>
                <ul class="dropdown-menu dropdown-menu-bar">
                    <li class="nav-item" v-for="(navLink, index) in navLinks" :key="navLink.id">
                        <button :class="`nav-link ${activeTabIndex === index ? 'active' : ''}`" @click="setTab(index)">
                            {{ navLink.tabText }}
                        </button>
                    </li>
                </ul>
            </div>
            <div class="tab-content">
                <div class="active-tab-content">
                    <img :src="navLinks[activeTabIndex].imgHref" :alt="navLinks[activeTabIndex].imgAlt">
                    <p>{{ navLinks[activeTabIndex].text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        activeTabIndex: 1,
        navLinks: [
          {
            id: 1,
            active: false,
            text: 'Secrets',
            tabText: 'Vault Integration & Secret Management',
            imgHref: '/landing/ee/company-stories/secrets.svg',
            imgAlt: 'Secrets',
          },
          {
            id: 2,
            active: false,
            text: 'SSO',
            tabText: 'SSO Support',
            imgHref: '/landing/ee/company-stories/sso-support.svg',
            imgAlt: 'SSO',
          },
          {
            id: 3,
            active: false,
            text: 'Audit Log',
            tabText: 'Detailed Audit Logs',
            imgHref: '/landing/ee/company-stories/audit-log.svg',
            imgAlt: 'Audit Log',
          },
          {
            id: 4,
            active: false,
            text: 'Tenants',
            tabText: 'Multi-Tenant Architecture',
            imgHref: '/landing/ee/company-stories/tenants.svg',
            imgAlt: 'Tenants',
          },
        ]
      }
    },
    methods: {
      setTab(index) {
        if (this.activeTabIndex !== index) {
            this.activeTabIndex = index
        }
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
        overflow: hidden;

        @include media-breakpoint-down(md) {
            border: none;
            overflow: unset;
        }

        ul {
            background-color: $black-2;
            overflow: hidden;
            flex-wrap: nowrap;
            justify-content: center;
            border: none;
            border-bottom: $block-border;

            li {
                border-right: $block-border;
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
                        padding: 1rem;
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

            li:last-child {
                border: none;
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

            .dropdown-menu-bar {
                width: 100%;
                color: $white;
                background-color: $black-4;
                border-radius: calc($spacer * 0.5);
                border: 1px solid $black-6;
            }
        }

    }
</style>