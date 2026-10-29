export interface GitHubMetrics {
    stars: number
    forks: number
    issues: number
    pullRequests: number
    commits: number
    contributors: number
}

export interface Contributor {
    name: string
    avatar: string
    count: number
}
