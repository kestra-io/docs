export const countryCodeToEmoji = (countryCode: string): string | null => {
    if (countryCode === undefined) {
        return null
    }

    let codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + (char as any).charCodeAt())
    return String.fromCodePoint(...codePoints)
}

export const mapJob = (job: DoverJob): Job => {
    return {
        id: job.id,
        title: job.title,
        locations: job.locations
            ? job.locations.map((l) => {
                  if (l.location_option.display_name === "International") {
                      return {
                          code: "INTL",
                          name: "World",
                          emoji: "🌍",
                      }
                  }

                  if (l.location_option.display_name === "Europe") {
                      return {
                          code: "EU",
                          name: "Europe",
                          emoji: "🇪🇺",
                      }
                  }

                  return {
                      code: l.location_option.country ?? "UNKNOWN",
                      name: l.location_option.display_name,
                      emoji: countryCodeToEmoji(l.location_option.country) ?? "🌐",
                  }
              })
            : [],
        remote: job.locations
            ? job.locations.filter((l) => l.location_type === "REMOTE").length > 0
            : false,
        link: `https://app.dover.com/apply/Kestra%20Technologies/${job.id}`,
    }
}

interface DoverJob {
    id: string
    title: string
    locations?: Array<{
        location_type: string
        location_option: {
            country: string
            display_name: string
        }
    }>
}

interface Job {
    id: string
    title: string
    locations: Array<{
        code: string
        name: string
        emoji: string
    }>
    remote: boolean
    link: string
}

export type { Job, DoverJob }