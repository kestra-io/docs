const href = "https://share-eu1.hsforms.com/1HWgyBQh8RP6pEZVFW51rOAg7f8j"

export default {
    header: {
        tag: '<span class="text-gradient">Write</span> for the Kestra <br /> Community',
        title: "Write for the Kestra Community",
        description:
            "If you are a software engineer, or tech enthusiast passionate about orchestration, scheduling, " +
            "and workflow automation, we at Kestra are inviting you to share your knowledge and insights by " +
            "writing for us.",
        cta: [
            {
                text: "Submit a Draft",
                href,
                style: "btn-animated btn-purple-animated btn",
                target: "_blank"
            },
        ],
        image: {
            href: "/write-for-us/hero.svg",
            alt: "Header",
            style: "image-community"
        },
    },
    drafts: {
        tag: "Why Submit a <span class='text-gradient'>Draft</span> ?",
        title: "Why Submit a Draft",
        cardGroup: "text-start",
        items: [
            {
                title: "Showcasing your expertise",
                text:
                    "Writing sharpens your ability to convey complex technical ideas clearly and effectively. If " +
                    "your draft shows promise, our team will guide you to refine it, making your message more impactful.",
                icon: "/shared/head-dots-horizontal-outline.svg",
            },
            {
                title: "Gain Recognition",
                text:
                    "We value our contributors and promote their articles across our social media channels and " +
                    "newsletter, offering you a platform to reach a broad audience in the tech community.",
                icon: "/shared/face-recognition.svg",
            },
            {
                title: "Get Compensated",
                text:
                    "Your expertise is precious, and we believe in rewarding our contributors. We offer competitive " +
                    "compensation for original articles, videos and tutorials.",
                icon: "/shared/currency-usd.svg",
            },
        ],
    },
    write: {
        tag: "What is the Write for <span class='text-gradient'>Kestra Program ?</span>",
        title: "What is the Write for the Kestra Program ?",
        titleClass: "title-sm",
        description:
            "Kestra, at its core, is a platform that empowers tech professionals with advanced orchestration " +
            "and scheduling solutions. We're seeking writers who can share practical insights, showcase new trends, and " +
            "provide step-by-step tutorials relevant to our community. ",
        interests: {
            title: "We're interested in:",
            items: [
                {
                    title: "Technical Insights",
                    description:
                        "Articles that delve into orchestration, automation, and workflow optimization.",
                },
                {
                    title: "Tech Trends",
                    description:
                        "Updates on new technologies, plugins or features in the field of software development.",
                },
                {
                    title: "Tutorials",
                    description:
                        "Practical guides on using Kestra, from basic setup to advanced workflow configurations.",
                },
                {
                    title: "External Content",
                    description:
                        "Do you want to share more about your usage of Kestra on your blog, on Medium, or any of " +
                        "your current content platforms? We empower you to share your content across all your favorite " +
                        "platforms!",
                },
            ],
        },
        cta: {
            title: "Participation Requirements",
            description:
                "We welcome submissions to anyone with a background in software engineering, data engineering, " +
                "or related fields. Familiarity with Kestra and experience in creating engaging, technical content are a " +
                "plus.",
            action: {
                text: "Apply",
                href,
                style: "btn-animated btn-purple-animated btn",
                target: "_blank"
            },
        },
    },
    process: {
        icon: "/shared/dotted-arrow-down.svg",
        title: "The Process: ",
        items: [
            {
                title: "Submit a Draft",
                description:
                    "Fill out the submission form with your draft and background information.",
            },
            {
                title: "Draft Review",
                description:
                    "Our team reviews each submission to ensure it aligns with our content standards and " +
                    "audience interests.",
            },
            {
                title: "Editing Process",
                description:
                    "We may suggest edits to enhance your article. Collaboration is typically done " +
                    "asynchronously to respect different time zones and schedules.",
            },
            {
                title: "Publish and Promote",
                description:
                    "Once finalized, we'll publish your article on our blog and promote it across our platforms.",
            },
            {
                title: "Share with Your Network",
                description:
                    "Feel free to share your published work with your personal and professional networks.",
            },
        ],
    },
    faqs: {
        title: "FAQs",
        items: [
            {
                title: "Compensation",
                description: "Original articles are compensated at a competitive rate (exact amount to be specified), " +
                    "payable upon publication.",
            },
            {
                title: "Cross-Posting",
                description: "You can cross-post your article on other platforms, provided a canonical link to the " +
                    "Kestra site is included.",
            },
        ],
    },
    footer: {
        title: "Start Writing For Kestra",
        cta: [
            {
                text: "Join Us on Slack",
                href: "/slack",
                style: "btn-dark",
                target: "_blank",
            },
            {
                text: "Submit a draft",
                href,
                style: "btn-animated btn-purple-animated",
                target: "_blank"
            },
        ],
    },
};
