/** The fields BlogCard renders, and so the only ones /blogs puts in the island's props. */
export interface BlogCardEntry {
    path: string
    title: string
    category: string
    date: Date
    image: string
    author?: { name: string }
    authors?: { name: string }[]
}
