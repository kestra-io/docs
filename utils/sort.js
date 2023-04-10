import {getCollection, getEntryBySlug} from "astro:content";

function sortList(a, b) {
    if (a.data.order && b.data.order) {
        return a.data.order > b.data.order ? 1 : -1
    }

    if (a.data.title && b.data.title) {
        return a.data.title.localeCompare(b.data.title);
    }

    return a.slug.localeCompare(b.slug)
}

function filterList(allDocs, parentSlug, direct) {
    return allDocs
        .filter(r => {
            return r.slug !== parentSlug &&
                r.slug.startsWith(parentSlug) &&
                (
                    (direct && r.slug.split("/").length === parentSlug.split("/").length + 1) ||
                    !direct
                )
        })
        .sort(sortList);
}

function recursiveFill(allDocs, items) {
    const result = [];

    items.forEach(item => {
        let filtered = filterList(allDocs, item.slug, true);

        result.push(item);

        if (filtered.length > 0) {
            // find direct childs
            let filteredResult = recursiveFill(allDocs, filtered);
            result.push(...filteredResult);
        } else {
            // find childs without direct relation
            let filtered = filterList(allDocs, item.slug, false);
            result.push(...filtered);
        }
    })

    return result;
}

function log(list) {
    list.forEach(r => {
        console.log((r?.data?.order || "X") + ' - ' + r.slug);
        if (r.childs) {
            log(r.childs);
        }
    })
}

export async function sortCollection(name) {
    const allDocs = (await getCollection("docs"))
        .sort((a, b) => a.slug.localeCompare(b.slug))

    let root = allDocs.filter(r => r.slug.split("/").length === 1)
        .sort(sortList);

    let results = recursiveFill(allDocs, root);
    // log(results);

    return results;
}

function logHeading(list) {
    list.forEach(r => {
        console.log(r);
        if (r.child) {
            logHeading(r.child);
        }
    })
}

export async function getSortedHeaders(collection, slug) {
    const entry = await getEntryBySlug(collection, slug);
    const {headings} = await entry.render();
    let nestedHeadings = [];
    let stack = [];
    for (const heading of headings) {
        const {depth} = heading;

        while (stack.length > 0 && stack[0].depth >= depth) {
            stack.shift();
        }
        if (stack.length > 0) {
            stack[0].children.push(heading);
        } else {
            nestedHeadings.push(heading);
        }
        if (!heading.children) {
            heading.children = [];
        }
        stack.unshift(heading);
    }

    return nestedHeadings;
}

export async function getPrettyCollection() {
    const allDocs = (await sortCollection("docs"))
    const root = allDocs.filter(doc => doc.slug.split('/').length === 1);
    return root.map(rootDoc => ({
        ...rootDoc,
        child: _getPrettyCollection(allDocs, rootDoc.slug)
    }));
}

export function _getPrettyCollection(allDocs, parentSlug) {
    let nestedDoc = [];
    // Loop through all documents
    for (let doc of allDocs) {
        if (doc.slug.startsWith(parentSlug + "/") && doc.slug.split("/").length === parentSlug.split("/").length + 1) {
            let child = {
                ...doc,
                child: _getPrettyCollection(allDocs, doc.slug)
            };
            nestedDoc.push(child);
        }
    }

    return nestedDoc;
}