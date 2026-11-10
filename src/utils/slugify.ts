import slugifyLib from "slugify"

slugifyLib.extend({ "(": "-", ")": "" })

export function slugify(text: string): string {
    return slugifyLib(text, {
        lower: true,
        locale: "en",
    })
}
