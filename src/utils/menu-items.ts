import type { Component } from "vue"
import OpenSourceInitiative from "vue-material-design-icons/OpenSourceInitiative.vue"
import Security from "vue-material-design-icons/Security.vue"
import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
import Xml from "vue-material-design-icons/Xml.vue"
import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
import WebBox from "vue-material-design-icons/WebBox.vue"
import Terraform from "vue-material-design-icons/Terraform.vue"
import ArrowCollapseAll from "vue-material-design-icons/ArrowCollapseAll.vue"
import Binoculars from "vue-material-design-icons/Binoculars.vue"
import ChartBarStacked from "vue-material-design-icons/ChartBarStacked.vue"
import ServerNetworkOutline from "vue-material-design-icons/ServerNetworkOutline.vue"
import BasketOutline from "vue-material-design-icons/BasketOutline.vue"
import MedicalBag from "vue-material-design-icons/MedicalBag.vue"
import CarBack from "vue-material-design-icons/CarBack.vue"
import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
import Domain from "vue-material-design-icons/Domain.vue"
import HandshakeOutline from "vue-material-design-icons/HandshakeOutline.vue"
import ProgressQuestion from "vue-material-design-icons/ProgressQuestion.vue"
import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue"
import PostOutline from "vue-material-design-icons/PostOutline.vue"
import BookOpenPageVariant from "vue-material-design-icons/BookOpenPageVariant.vue"
import Tools from "vue-material-design-icons/Tools.vue"
import ViewList from "vue-material-design-icons/ViewList.vue"
import VideoCheckOutline from "vue-material-design-icons/VideoCheckOutline.vue"
import LightbulbOn40 from "vue-material-design-icons/LightbulbOn40.vue"
import HeadQuestion from "vue-material-design-icons/HeadQuestion.vue"
import Flare from "vue-material-design-icons/Flare.vue"
import ListBox from "vue-material-design-icons/ListBox.vue"

interface MenuItem {
    icon: Component
    title: string
    description?: string
    link: string
    tag?: string
}

interface MenuItems {
    product: {
        items: MenuItem[]
    }
    solutions: {
        capabilities: MenuItem[]
        roles: MenuItem[]
        industries: MenuItem[]
        resources: MenuItem[]
    }
    resources: {
        mainItems: MenuItem[]
        additionalItems: MenuItem[]
    }
}

export const menuItems: MenuItems = {
    product: {
        items: [
            {
                icon: OpenSourceInitiative,
                title: "Core Features",
                description: "Explore Kestra's Core Capabilities",
                link: "/features",
            },
            {
                icon: Security,
                title: "Enterprise Edition",
                description: "Security and Governance for Enterprise Needs",
                link: "/enterprise",
            },
            {
                icon: CloudOutline,
                title: "Cloud Edition",
                description: "the Cloud edition managed by Kestra",
                link: "/cloud",
                tag: "Request Access",
            },
        ],
    },
    solutions: {
        capabilities: [
            {
                icon: Xml,
                title: "Declarative Orchestration",
                description: "Infrastructure as Code of All Your Workflows",
                link: "/features/declarative-data-orchestration",
            },
            {
                icon: RefreshAuto,
                title: "Automation Platform",
                description: "Scheduling and Automation Made Easy",
                link: "/features/scheduling-and-automation",
            },
            {
                icon: WebBox,
                title: "Language Agnostic",
                description: "Orchestrate business logic in any language",
                link: "/features/code-in-any-language",
            },
            {
                icon: Terraform,
                title: "Kestra's Terraform Provider",
                description: "Deploy & manage all resources with Terraform",
                link: "/use-cases/terraform-provider",
            },
            {
                icon: ArrowCollapseAll,
                title: "API-First",
                description: "Learn more about Kestra's API features",
                link: "/features/api-first",
            },
            {
                icon: Binoculars,
                title: "Platform Overview",
                description: "Powerful Capabilities from the UI",
                link: "/overview",
            },
        ],
        roles: [
            {
                icon: ChartBarStacked,
                title: "Data Engineers",
                link: "/use-cases/data-engineers",
            },
            {
                icon: RefreshAuto,
                title: "Software Engineers",
                link: "/use-cases/software-engineers",
            },
            {
                icon: ServerNetworkOutline,
                title: "Platform Engineers",
                link: "/use-cases/platform-engineers",
            },
        ],
        industries: [
            {
                icon: BasketOutline,
                title: "Retail & Supply Chain",
                link: "/use-cases/retail",
            },
            {
                icon: MedicalBag,
                title: "Healthcare & Pharmaceuticals",
                link: "/use-cases/healthcare",
            },
            {
                icon: CarBack,
                title: "Automotive & Heavy Equipment",
                link: "/use-cases/automotive",
            },
            {
                icon: ArrowRight,
                title: "All use-cases",
                link: "/docs/use-cases",
            },
        ],
        resources: [
            {
                icon: Domain,
                title: "About Us",
                link: "/about-us",
            },
            {
                icon: HandshakeOutline,
                title: "Partner",
                link: "/partners",
            },
            {
                icon: ProgressQuestion,
                title: "FAQ",
                link: "/faq",
            },
            {
                icon: AccountGroupOutline,
                title: "Community Overview",
                link: "/community",
            },
            {
                icon: PostOutline,
                title: "Community Contents",
                link: "/blogs/community",
            },
            {
                icon: BookOpenPageVariant,
                title: "Customer Stories",
                link: "/use-cases/stories",
            },
            {
                icon: ListBox,
                title: "Changelog",
                link: "/docs/changelog",
            },
        ],
    },
    resources: {
        mainItems: [
            {
                icon: Tools,
                title: "Docs",
                description: "Everything Kestra",
                link: "/docs",
            },
            {
                icon: PostOutline,
                title: "Blog",
                description: "Tutorials, Guides, Market Trends and More",
                link: "/blogs",
            },
            {
                icon: ViewList,
                title: "Blueprints",
                description: "A Library of ready to use Workflows",
                link: "/blueprints",
            },
            {
                icon: VideoCheckOutline,
                title: "Video Tutorials",
                description: "your favourite tutorials in video",
                link: "/tutorial-videos",
            },
        ],
        additionalItems: [
            {
                icon: LightbulbOn40,
                title: "How to guides",
                description: "Learn step by step how to address use-cases",
                link: "/docs/how-to-guides",
            },
            {
                icon: HeadQuestion,
                title: "Why kestra",
                description: "Trust kestra as your unified orchestration tool",
                link: "/docs/why-kestra",
            },
            {
                icon: Flare,
                title: "Quickstart installation guide",
                description: "Trust kestra as your unified orchestration tool",
                link: "/docs/installation",
            },
        ],
    },
}