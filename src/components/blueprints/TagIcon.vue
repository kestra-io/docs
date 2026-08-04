<template>
    <component :is="iconComponent" class="tag-icon-inner" />
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import RocketLaunchOutline from "vue-material-design-icons/RocketLaunchOutline.vue"
    import Brain from "vue-material-design-icons/Brain.vue"
    import BriefcaseOutline from "vue-material-design-icons/BriefcaseOutline.vue"
    import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
    import CogOutline from "vue-material-design-icons/CogOutline.vue"
    import DatabaseOutline from "vue-material-design-icons/DatabaseOutline.vue"
    import ServerOutline from "vue-material-design-icons/ServerOutline.vue"
    import BellAlertOutline from "vue-material-design-icons/BellAlertOutline.vue"
    import DatabaseArrowDownOutline from "vue-material-design-icons/DatabaseArrowDownOutline.vue"
    import CalendarClockOutline from "vue-material-design-icons/CalendarClockOutline.vue"
    import LightningBoltOutline from "vue-material-design-icons/LightningBoltOutline.vue"
    import ShieldCheckOutline from "vue-material-design-icons/ShieldCheckOutline.vue"
    import ServerNetworkOutline from "vue-material-design-icons/ServerNetworkOutline.vue"
    import TagOutline from "vue-material-design-icons/TagOutline.vue"

    const props = defineProps<{
        tag: string
    }>()

    const ICON_MAP: Record<string, unknown> = {
        "Getting Started": RocketLaunchOutline,
        AI: Brain,
        Business: BriefcaseOutline,
        Cloud: CloudOutline,
        Core: CogOutline,
        Data: DatabaseOutline,
        Infrastructure: ServerOutline,
        "Failure Alerting": BellAlertOutline,
        "ELT & Data Landing": DatabaseArrowDownOutline,
        Scheduling: CalendarClockOutline,
        "Realtime Events": LightningBoltOutline,
        "Approval Gates": ShieldCheckOutline,
        "Infrastructure Automation": ServerNetworkOutline,
    }

    const iconComponent = computed(() => ICON_MAP[props.tag] ?? TagOutline)
</script>

<style scoped lang="scss">
    .tag-icon-inner {
        font-size: 0.8125rem;
        width: 0.8125rem;
        height: 0.8125rem;
        flex-shrink: 0;
    }
</style>
