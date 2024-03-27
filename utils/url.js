import slugifyLib from "slugify";

export function slugify(text) {
    return slugifyLib(text, {
        lower: true,
        locale: 'en',
    });
}

export function camelToKebabCase(text) {
    return text.replace(/([a-z])([A-Z][a-z])/, '$1-$2').toLowerCase();
}