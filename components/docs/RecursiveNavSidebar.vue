<template>
    <div :id="parentSlug" :data-bs-parent="'#'+parentSlug" class="accordion-collapse"
         :class="activeSlug.includes(parentSlug) ? 'collapse show' : 'collapse'">
        <div v-for="item in items">
            <ul class="bd-links-nav list-unstyled mb-0">
                <li :style="{marginLeft: depthLevel+'rem'}" class="bd-links-group">
                    <a
                        :class="item._path === activeSlug ? 'active' : ''"
                        class="bd-links-link d-inline-block"
                        :href="item._path">
                        {{ item.title || "TODO" }}
                    </a>
                    <chevron-down
                        v-if="showMenu.includes(item._path) && item.children && item.children.length > 0"
                        @click="toggle(item._path)"
                        class="accordion-button" data-bs-toggle="collapse"
                        :data-bs-target="'#'+item._path"
                        role="button"
                    />
                    <chevron-up
                        v-else-if="item.children && item.children.length > 0"
                        @click="toggle(item._path)"
                        class="accordion-button" data-bs-toggle="collapse"
                        :data-bs-target="'#'+item._path"
                        role="button"
                    />
                </li>
                <RecursiveNavSidebar v-if="item.children" :items="item.children" :depth-level="depthLevel+1"
                                     :active-slug="activeSlug" :open="showMenu.includes(item._path)"
                                     :parent-slug="item._path"/>
            </ul>
        </div>
    </div>
</template>

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"

    export default {
        name: "RecursiveNavSidebar",
        components: {
            ChevronDown,
            ChevronUp
        },
        props: {
            items: {
                type: Array,
                required: true
            },
            depthLevel: {
                type: Number,
                required: true
            },
            activeSlug: {
                type: String,
                required: true
            },
            open: {
                type: Boolean,
                required: true
            },
            parentSlug: {
                type: String,
                required: true
            }
        },
        created() {
            this.showMenu = [this.activeSlug]
        },
        data: () => ({
            showMenu: [],
        }),
        methods: {
            haveArrow(item) {
                return this.items.filter(i => i._path.startsWith(item._path)).length > 1
            },
            toggle(item) {
                if (this.showMenu.includes(item)) {
                    this.showMenu = this.showMenu.filter(i => i !== item)
                } else {
                    this.showMenu.push(item)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .bd-links-group {
        display: flex;
        align-items: center;

        &:hover,
        &:focus,
        &.active {
            text-decoration: if($link-hover-decoration == underline, none, null);
        }
    }

    .bd-links-link {
        padding: 0.4rem 0.2rem;
        margin-left: 1.125rem;
        color: var(--bs-body-color);
        text-decoration: if($link-decoration == none, null, none);
        font-size: .8rem;
        border-left: 2px solid var(--bs-gray-200);

        &.active {
            font-weight: 600;
        }

        &:hover {
            border-left: 2px solid var(--bs-primary);
            color: var(--bs-primary);
        }
    }

    .active {
        color: var(--bs-primary);
        border-left: 2px solid var(--bs-primary);
    }

    .accordion-button {
        width: 16px;
    }
</style>