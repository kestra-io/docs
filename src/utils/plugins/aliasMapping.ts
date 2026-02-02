import { extractPluginElements, type Plugin } from "@kestra-io/ui-libs";

export function getAliasMapping(allPlugins: Plugin[]) {
    const aliasMap: Record<string, string> = {};

    allPlugins?.forEach(plugin => {
        if (!plugin.aliases?.length) return;

        const allElements = Object.values(extractPluginElements(plugin)).flat();

        for (const alias of plugin.aliases) {
            const match = allElements.find(cls =>
                cls?.toLowerCase() === alias.toLowerCase() ||
                cls?.toLowerCase().endsWith('.' + alias.split('.').pop()?.toLowerCase())
            );
            if (match) aliasMap[alias.toLowerCase()] = match;
        }
    });

    return aliasMap;
}

/**
* Handle alias redirects before fetching page data to avoid broken layout.
* This ensures instant redirects for old URLs that use plugin aliases.
*
* @example
* Old URL: /plugins/plugin-notifications/tasks/twilio/io.kestra.plugin.notifications.twilio.twilioalert
* Redirects to: /plugins/plugin-twilio/notify/io.kestra.plugin.twilio.notify.twilioalert
*/
export function redirectAlias(aliasMapping: Record<string, string>, slug: string, pageList: string[] | undefined, pluginType: string | undefined) {
    if (pluginType && aliasMapping && !pageList?.includes(slug)) {
        let redirectPath = pageList?.find(page => page?.endsWith("/" + pluginType));

        if (!redirectPath) {
            const actualClass = aliasMapping[pluginType.toLowerCase()];
            if (actualClass) {
                redirectPath = pageList?.find(page =>
                    page?.toLowerCase().endsWith("/" + actualClass.toLowerCase())
                );
            }
        }

        if (!redirectPath) {
            throw Error(`Plugin page not found: ${slug}`)
        }

        return redirectPath;
    }else{
        return null;
    }
}