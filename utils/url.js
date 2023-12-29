import slugifyLib from "slugify";

export function slugify(text) {
    return slugifyLib(text, {
        lower: true,
        locale: 'en',
    });
}