interface YouTubeThumbnail {
    extractVideoId: (url?: string) => string | null
    getThumbnailUrl: (urlOrId?: string) => string | null
    isValidVideoId: (id: string) => boolean
}

const YOUTUBE_PATTERNS = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
] as const

const VIDEO_ID_LENGTH = 11

export const useYoutube = (): YouTubeThumbnail => {
    const extractVideoId = (url?: string): string | null => {
        if (!url) return null

        for (const pattern of YOUTUBE_PATTERNS) {
            const match = url.match(pattern)
            if (match?.[1]) return match[1]
        }

        return null
    }

    const isValidVideoId = (id: string): boolean =>
        id.length === VIDEO_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(id)

    const getThumbnailUrl = (urlOrId?: string): string | null => {
        if (!urlOrId) return null

        const videoId = isValidVideoId(urlOrId) ? urlOrId : extractVideoId(urlOrId)
        return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null
    }

    return {
        extractVideoId,
        getThumbnailUrl,
        isValidVideoId,
    }
}