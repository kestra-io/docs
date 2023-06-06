import {defineDriver} from "unstorage";

const defaultOptions= {
    ttl: 600,
    dir: "",
};

let plugins = {};
let definitions = {};

export default defineDriver(_opts => {
    const opts = { ...defaultOptions, ..._opts };

    let lastCheck = 0;

    const sync = async () => {
        if (lastCheck + opts.ttl * 1000 > Date.now()) {
            return;
        }

        plugins = {}
        definitions = {}

        await getPlugins;
        lastCheck = Date.now();
    };

    return {
        name: "apidocs",
        options: opts,
        async getKeys() {
            await sync();

            return await fetchAllKeys();
        },
        async hasItem(key) {
            await sync();

            return key in await fetchAllKeys();
        },
        async getItem(key) {
            await sync();

            let isTask = (key.match(/:/g) || []).length > 1;
            if (isTask) {
                return await getDefinitions(key);
            } else {
                return await getPluginsPage(key)
            }
        },
        async getMeta(key) {
            await sync();
            return plugins;
        },
    };
});

async function fetchAllKeys() {
    const keys = [];

    const plugins = await getPlugins();

    for (const [key, plugin] of Object.entries(plugins)) {
        keys.push(key + ":index.md")
        for (const type of ["tasks", "triggers", "conditions"]) {
            for (const cls of plugin.meta[type]) {

                let subGroup = undefined;
                let substring = cls.substring(plugin.meta.group.length + 1);

                if (substring.indexOf(".")) {
                    subGroup = substring.substring(0, substring.lastIndexOf("."));
                }

                keys.push([key, type, subGroup, cls + ".md"].filter(e => e !== undefined && e !== "").join(":"))
            }
        }
    }


    return keys.sort();
}

async function getPlugins() {
    const response = await fetchUrl("/v1/plugins");
    for (const node of response.filter(e => e.storages === undefined || e.storages.length === 0)) {
        const key = node.name;

        plugins[key] = {
            meta: node,
        };
    }

    return plugins;
}

function transformKey(key) {
    const endSuffixLength = key.endsWith("$") ? 4 : 3
    return key.substring(0, key.length - endSuffixLength);
}

async function getPluginsPage(key) {
    key = transformKey(key)
    key = key.substring(0, key.length - 6);

    const item = plugins[key];

    if (!item) {
        return null;
    }

    if (!item.response) {
        item.response = await fetchUrl(`/v1/plugins/${key}`);
    }

    return item.response.body || "";
}

async function getDefinitions(key) {
    key = transformKey(key)
    key = key.split(":").pop();

    const item = definitions[key];

    if (!item) {
        definitions[key] = await fetchUrl(`/v1/plugins/definitions/${key}`);
    }

    return definitions[key].markdown || "";
}

async function fetchUrl(url) {
    try {
        return await (await fetch(`https://api.kestra.io${url}`)).json()
    } catch (error) {
        throw new Error(`[unstorage] [${url}] ${error.message}`, {
            cause: error,
        });
    }
}
