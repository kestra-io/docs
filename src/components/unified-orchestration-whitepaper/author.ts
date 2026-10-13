// Single source for the author block: AuthorCard renders it on the page and
// the .md endpoint appends it, so the markdown variant keeps the bio even
// though the section is no longer part of the entry's body.
export const AUTHOR = {
    name: "Kai Waehner",
    role: "Global Field CTO, Kestra",
    bio: "Kai Waehner is Global Field CTO at Kestra. He has spent more than twenty years in enterprise architecture, data integration, process intelligence, and AI, working with Fortune 500 and Global 2000 organizations across Europe, North America, the Middle East, Asia, and Australia. He moves between strategy conversations with CIOs and CTOs and deep architecture reviews with engineering teams across industries, including financial services, manufacturing, telecom, retail, and the public sector. He is an international speaker, blogger, and book author on these topics.",
    links: [
        { label: "kai-waehner.de", href: "https://www.kai-waehner.de" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/kaiwaehner" },
    ],
} as const

export const authorMarkdown = () =>
    `## About the author\n\n${AUTHOR.bio}\n\n` +
    AUTHOR.links.map((l) => `[${l.label}](${l.href})`).join(" · ")
