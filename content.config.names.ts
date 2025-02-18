import slugifyLib from "slugify";

export function slugify(text:string) {
    return slugifyLib(text, {
        lower: true,
        locale: 'en',
    });
}

const contentPrefix = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main' ? `${slugify(process.env.CF_PAGES_BRANCH)}-` : ''

export const CollectionNames = {
    docs: `${contentPrefix}docs`,
    blogs: `${contentPrefix}blogs`,
    careers: `${contentPrefix}careers`,
    misc: `${contentPrefix}misc`
} as const