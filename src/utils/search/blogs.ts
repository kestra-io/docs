import type { SearchResult } from "~/utils/searchResults"
import { withFullTextMatches } from "~/utils/search/fullText"
import { fetchJson, loadOnce } from "~/utils/search/loaders"
import { includesAll, MAX_RESULTS, searchTokens } from "~/utils/search/matching"

type BlogAuthor = { name: string; role?: string; avatar?: string }

export type BlogEntry = {
    id: string
    title: string
    description: string
    date: string
    category: string
    authors: BlogAuthor[]
    thumb?: string
    cover?: string
    headings: string[]
    minutes: number
}

export interface BlogSearchResult extends SearchResult {
    blog: Omit<BlogEntry, "title" | "headings"> & {
        author?: BlogAuthor
        authorNames: string
    }
}

export const loadBlogsIndex = loadOnce(() =>
    fetchJson<BlogEntry[]>("/api/blogs-search"),
)

const newestFirst = (a: BlogEntry, b: BlogEntry) => b.date.localeCompare(a.date)

function rankBlogs(posts: BlogEntry[], tokens: string[]) {
    const tier = (post: BlogEntry) => {
        if (includesAll(post.title, tokens)) return 3
        if (includesAll(`${post.title} ${post.description}`, tokens)) return 2
        const rest = [
            post.title,
            post.description,
            post.category,
            ...post.headings,
            ...post.authors.map((author) => author.name),
        ]
        return includesAll(rest.join(" "), tokens) ? 1 : 0
    }
    return posts
        .map((post) => ({ post, tier: tier(post) }))
        .filter(({ tier }) => tier > 0)
        .sort((a, b) => b.tier - a.tier || newestFirst(a.post, b.post))
        .map(({ post }) => post)
}

const dateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    })

const toResult = ({
    title,
    headings: _,
    date,
    ...post
}: BlogEntry): BlogSearchResult => ({
    url: `blogs/${post.id}`,
    type: "BLOGS",
    title,
    blog: {
        ...post,
        date: dateLabel(date),
        author: post.authors[0],
        authorNames: post.authors.map((author) => author.name).join(", "),
    },
})

export function blogsSearchResults(
    posts: BlogEntry[],
    query: string,
    fullTextUrls: string[] = [],
) {
    const tokens = searchTokens(query)
    const matches = tokens.length
        ? withFullTextMatches(
              rankBlogs(posts, tokens),
              posts,
              fullTextUrls,
              "blogs/",
          )
        : [...posts].sort(newestFirst)
    return {
        total: matches.length,
        results: matches.slice(0, MAX_RESULTS).map(toResult),
    }
}
