// Shared FAQ entries for the blueprints catalog pages (main index and the
// per-category pages), so the copy lives in one place.
export interface FaqItem {
    question: string
    answer: string
}

export function blueprintFaqItems(categoryList?: string): FaqItem[] {
    return [
        {
            question: "What is a Kestra blueprint?",
            answer: "A blueprint is a pre-built, ready-to-use workflow template that helps you get started quickly. Each blueprint demonstrates a real-world use case with fully configured tasks, triggers, and integrations — so you can import it and adapt it to your needs.",
        },
        {
            question: "How do I use a blueprint?",
            answer: "Browse or search for a blueprint that matches your use case. Click on it to view the full workflow definition, then copy it into your Kestra instance. You can use it as-is or customize the tasks, inputs, and triggers to fit your requirements.",
        },
        {
            question: "What's the difference between a blueprint and a custom blueprint?",
            answer: "Catalog blueprints are maintained by the Kestra team and community, kept current with plugin changes, and ready to copy as-is. A custom blueprint is one your team writes and curates inside your own instance — in Kestra's Enterprise Edition you can publish internal custom blueprints so your organization has its own private catalog alongside this public one. Most teams start from a catalog blueprint, adapt it, and promote the result as a custom blueprint for reuse.",
        },
        {
            question: "Can I modify a blueprint after importing it?",
            answer: "Yes. Blueprints are standard Kestra workflows written in YAML. Once imported, you have full control to add, remove, or reconfigure tasks, change scheduling, update credentials, or extend the flow with additional logic.",
        },
        {
            question: "How do I find blueprints for a specific tool?",
            answer: "Use the search bar at the top of any blueprints page: typing a tool name (Slack, Snowflake, dbt...) suggests it as a filter you can add with one click, showing only blueprints that actually use that tool's plugin. You can combine a tool with a category, or add several tools at once to find blueprints connecting them.",
        },
        {
            question: "What categories of blueprints are available?",
            answer: categoryList
                ? `Blueprints are organized into categories such as ${categoryList}. Each category groups common patterns and integrations to help you find the right starting point.`
                : "Blueprints are organized into categories such as AI, Business, Cloud, Core, Data, and Infrastructure. Each category groups common patterns and integrations to help you find the right starting point.",
        },
        {
            question: "Are blueprints free to use?",
            answer: "Yes. Every blueprint in this catalog is free and works with the open-source edition of Kestra, unless it explicitly relies on an Enterprise Edition plugin (which the blueprint page calls out). Copy the YAML, add your own credentials as secrets, and run it.",
        },
        {
            question: "Are blueprints maintained and updated?",
            answer: "Yes. Blueprints are regularly updated to reflect new plugins, best practices, and platform features. The Kestra team and community continuously contribute new blueprints to cover emerging use cases.",
        },
        {
            question: "Can I contribute my own blueprint?",
            answer: "Yes. If you've built a workflow that solves a common problem, you can contribute it as a blueprint. Community contributions help expand the library and make it easier for others to get started with similar use cases.",
        },
    ]
}
