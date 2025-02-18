import {slugify} from '~/utils/url'

const contentPrefix = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main' ? `${slugify(process.env.CF_PAGES_BRANCH)}-` : ''

export const CollectionNames = {
    docs: `${contentPrefix}docs`,
    blogs: `${contentPrefix}blogs`,
    careers: `${contentPrefix}careers`,
    misc: `${contentPrefix}misc`
} as const