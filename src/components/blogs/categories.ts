export const ALL_NEWS = "$all"

export const allBlogCategories = new Map([
    [ALL_NEWS, "All news"],
    ["$company-news", "Company news"],
    ["$news-products-updates", "News & Products Updates"],
    ["$solutions", "Solutions"],
])

export const categoryMap: Record<string, string> = {
    "Company News": "Company news",
    "News & Products Updates": "News & Products Updates",
    "News & Product Updates": "News & Products Updates",
    Solutions: "Solutions",
    Solution: "Solutions",
}
