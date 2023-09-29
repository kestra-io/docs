<template>
    <div
        :class="classes"
        class="wrapper"
    >
            <div class="icon" :style="styles"></div>
    </div>
</template>
<script>
    import {Buffer} from "buffer";

    // Removed this because getting error that document is not defined

    // import Tooltip from "@kestra-io/ui-libs/src/components/misc/Tooltip.vue";
    // import {cssVariable} from "@kestra-io/ui-libs/src/utils/global.js";

    export default {
        name: "TaskIcon",
        // components: {Tooltip},
        props: {
            customIcon: {
                type: Object,
                default: undefined
            },
            cls: {
                type: Object,
                default: undefined
            },
            theme: {
                type: String,
                default: undefined,
                validator(value) {
                    return ["dark", "light"].includes(value)
                }
            }
        },
        computed: {
            backgroundImage() {
                return `data:image/svg+xml;base64,${this.imageBase64}`
            },
            classes() {
                return {
                    "flowable": this.icon ? this.icon.flowable : false,
                }
            },
            styles() {
                return {
                    backgroundImage: `url(data:image/svg+xml;base64,${this.imageBase64})`
                }
            },
            imageBase64() {
                let icon = this.icon && this.icon.icon ? Buffer.from(this.icon.icon, "base64").toString("utf8") : undefined;

                if (!icon) {
                    icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" " +
                        "xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" " +
                        "focusable=\"false\" width=\"0.75em\" height=\"1em\" style=\"-ms-transform: " +
                        "rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);\" " +
                        "preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 384 512\">" +
                        "<path d=\"M288 32H0v448h384V128l-96-96zm64 416H32V64h224l96 96v288z\" fill=\"currentColor\"/>" +
                        "</svg>";
                }

                // Removed this because getting error that document is not defined

                // const darkTheme = document.getElementsByTagName("html")[0].className.indexOf("dark") >= 0;
                // let color = darkTheme ? cssVariable("--bs-gray-900") : cssVariable("--bs-black");

                // if (this.theme) {
                //     color = this.theme === "dark" ? cssVariable("--bs-gray-900") : cssVariable("--bs-black");
                // }

                // icon = icon.replaceAll("currentColor", color);

                return Buffer.from(icon, "utf8").toString("base64");
            },
            icon() {
                return this.cls;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;

        :deep(span) {
            position: absolute;
            padding: 1px;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
        }

        :deep(.icon) {
            width: 100%;
            height: 100%;
            display: block;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
        }
    }
</style>