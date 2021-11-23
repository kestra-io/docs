<template>
    <ul>
        <li
            v-for="(item, index) in listData"
            :key="index"
            @click="itemClick(index, item.slug)"
            :class="[
      index === activeIndex ? 'active' : '',
      item.level > 2 ? 'sub' : '',
      `level-${item.level}`,
    ]"
        >{{ item.title }}
        </li>
    </ul>
</template>

<script>
import throttle from "lodash.throttle";

export default {
    name: "right-anchor",
    props: {
        global: Boolean
    },
    data() {
        return {
            listData: [],
            activeIndex: null,
            opened: false
        };
    },
    watch: {
        "$page.regularPath"() {
            this.filterDataByLevel();
        }
    },
    computed: {},
    methods: {

        itemClick(index, slug) {
            this.activeIndex = index;

            window.scrollTo({
                top: document.getElementById(slug)?.offsetTop || 0,
                behavior: "smooth"
            });
        },
        filterDataByLevel() {
            this.listData = [];

            const {headers} = this.$page;

            this.listData = headers ? [...headers] : [];
        },
        getScrollTop() {
            return (
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0
            );
        }
    },
    mounted() {
        this.filterDataByLevel();

        if (this.expandOptions?.trigger === "click") {
            this.opened = this.expandOptions?.clickModeDefaultOpen;
        }

        window.addEventListener(
            "scroll",
            throttle(() => {
                const scrollTop = this.getScrollTop();

                this.listData.forEach((item, index) => {
                    const elOffsetTop = document.getElementById(item.slug)?.offsetTop;
                    if (elOffsetTop) {
                        if (index === 0 && scrollTop < elOffsetTop) this.activeIndex = 0;
                        else if (scrollTop >= elOffsetTop) this.activeIndex = index;
                    }
                });
            }, 100)
        );
    }
};
</script>

<style lang="scss" scoped>
@import ".vuepress/theme/styles/variables";

ul {
    padding-left: 0;

    li {
        list-style: none;
        cursor: pointer;

        &.active {
            color: $link-color;
        }
        @for $i from 1 through 6 {
            &.level-#{$i} {
                padding-left: ($spacer * $i) - ($spacer * 2);
            }
        }
    }
}
</style>
