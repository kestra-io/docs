import slugifyLib from "slugify";

export function slugify(text:string) {
    return slugifyLib(text, {
        lower: true,
        locale: 'en',
        remove: /[^0-9a-zA-Z_]/g
    });
}

const contentPrefix = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main' ? `${slugify(process.env.CF_PAGES_BRANCH)}_` : ''

export const CollectionNames = {
    docs: `${contentPrefix}docs`,
    blogs: `${contentPrefix}blogs`,
    misc: `${contentPrefix}misc`
} as const