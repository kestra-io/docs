
export function prevNext(navigation, path) {
    let prev = null;
    let next = null;
    let found = false;

    const recursiveFetch = (current) => {
        if (current.children) {
            for (const item of current.children.filter(item => item._path !== current._path)) {
                if (next && prev) {
                    break;
                }

                if (found && !next) {
                    next = item;
                }

                if (item._path === path) {
                    found = true;
                }

                if (!found) {
                    prev = item;
                }

                recursiveFetch(item)
            }
        }
    };

    recursiveFetch(navigation[0]);

    if(!found){
        // we're at a section's root
        prev = undefined;
        next = navigation[0].children[0];
    }else if(prev === null) {
        prev = navigation[0];
    }
    return {prev, next};
}

export const recursivePages = (item) => {
    const paths = [];
    if (item.isPage ?? true) {
        paths.push(item._path);
    }
    if (item.children) {
        paths.push(...(item.children.flatMap(child => {
            return recursivePages(child);
        })));
    }

    return paths;
}

export const generatePageNames = (item) => {
    const result = {};
    function traverse(item) {
        if (item._path && item.title) {
            let key = item._path.split("/")[item._path.split("/").length - 1];
            result[key] = item.title;
        }
        if (item.children) {
            item.children.forEach(child => traverse(child));
        }
    }
    traverse(item);
    return result;
}