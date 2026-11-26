import { defineComponent, getCurrentInstance, h, provide } from "vue"
import { createI18n } from "vue-i18n"
import { TASK_ICON_INJECTION_KEY } from "@kestra-io/design-system"
import TaskIcon from "~/components/common/TaskIcon.vue"

/** The graph passes the whole task-icon contract (icons, loadIcon...); the docs icon only
 *  needs the class, so the rest is dropped instead of landing on the DOM. */
const GraphTaskIcon = defineComponent({
    inheritAttrs: false,
    props: {
        cls: { type: String, default: "" },
        onlyIcon: { type: Boolean, default: false },
    },
    setup: (iconProps) => () =>
        h(TaskIcon, { cls: iconProps.cls, onlyIcon: iconProps.onlyIcon }),
})

// The graph renders the site's task icons and translates its labels with vue-i18n.
export function useTopologyIsland() {
    provide(TASK_ICON_INJECTION_KEY, GraphTaskIcon)
    const app = getCurrentInstance()?.appContext.app
    if (app && !app.config.globalProperties.$i18n) {
        app.use(createI18n({ legacy: false, locale: "en", messages: {} }))
    }
}
