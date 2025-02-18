import slugifyLib from "slugify";

export function slugify(text:string) {
    return slugifyLib(text, {
        lower: true,
        locale: 'en',
    });
}

export function camelToKebabCase(text:string) {
    return text.replace(/([a-z])([A-Z][a-z])/, '$1-$2').toLowerCase();
}