import type { Component } from "vue"

import Car from "vue-material-design-icons/Car.vue"
import DNA from "vue-material-design-icons/Dna.vue"
import Looks from "vue-material-design-icons/Looks.vue"
import ChartLine from "vue-material-design-icons/ChartLine.vue"
import CartMinus from "vue-material-design-icons/CartMinus.vue"
import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
import SourceBranch from "vue-material-design-icons/SourceBranch.vue"
import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
import CogSyncOutline from "vue-material-design-icons/CogSyncOutline.vue"
import TextBoxOutline from "vue-material-design-icons/TextBoxOutline.vue"
import FileCodeOutline from "vue-material-design-icons/FileCodeOutline.vue"
import ShapePlusOutline from "vue-material-design-icons/ShapePlusOutline.vue"
import ShieldLockOutline from "vue-material-design-icons/ShieldLockOutline.vue"
import OpenSourceInitiative from "vue-material-design-icons/OpenSourceInitiative.vue"
import ServerNetworkOutline from "vue-material-design-icons/ServerNetworkOutline.vue"
import FormatQuoteCloseOutline from "vue-material-design-icons/FormatQuoteCloseOutline.vue"
import ChartTimelineVariantShimmer from "vue-material-design-icons/ChartTimelineVariantShimmer.vue"

interface MenuItem {
    icon: Component
    title: string
    description?: string
    link: string
    tag?: string
}

interface MenuItems {
    product: { items: MenuItem[] }
    solutions: {
        useCases: MenuItem[]
        user: MenuItem[]
        industry: MenuItem[]
    }
    resources: { items: MenuItem[] }
}

export const menuItems: MenuItems = {
    product: {
        items: [
            {
                icon: OpenSourceInitiative,
                title: "Core Features",
                link: "/features"
            },
            {
                icon: ShieldLockOutline,
                title: "Enterprise Edition",
                link: "/enterprise"
            },
            {
                icon: CloudOutline,
                title: "Cloud Edition",
                link: "/cloud",
                tag: "Request Access"
            },
            {
                icon: Looks,
                title: "Platform Overview",
                link: "/overview"
            },
        ],
    },
    solutions: {
        useCases: [
            {
                icon: SourceBranch,
                title: "Data Workflow",
                // TODO: Add link
                link: ""
            },
            {
                icon: CogSyncOutline,
                title: "Infrastructure Automation",
                link: "/infra-automation"
            },
            {
                icon: ChartTimelineVariantShimmer,
                title: "AI Workflows",
                // TODO: Add link
                link: ""
            },
        ],
        user: [
            {
                icon: ChartLine,
                title: "Data Engineers",
                link: "/use-cases/data-engineers"
            },
            {
                icon: RefreshAuto,
                title: "Software Engineers",
                link: "/use-cases/software-engineers"
            },
            {
                icon: ServerNetworkOutline,
                title: "Platform Engineers",
                link: "/use-cases/platform-engineers"
            },
        ],
        industry: [
            {
                icon: Car,
                title: "Automotive",
                link: "/use-cases/automotive"
            },
            {
                icon: CartMinus,
                title: "Retail",
                link: "/use-cases/retail"
            },
            {
                icon: DNA,
                title: "Healthcare",
                link: "/use-cases/healthcare"
            },
        ],
    },
    resources: {
        items: [
            {
                icon: FileCodeOutline,
                title: "Docs",
                link: "/docs"
            },
            {
                icon: ShapePlusOutline,
                title: "Blueprints",
                link: "/blueprints"
            },
            {
                icon: TextBoxOutline,
                title: "Blog",
                link: "/blogs"
            },
            {
                icon: FormatQuoteCloseOutline,
                title: "Customer Stories",
                link: "/use-cases/stories"
            },
        ],
    },
}