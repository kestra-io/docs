import { isEntryAPluginElementPredicate } from "@kestra-io/ui-libs";
import { $fetch } from "../../utils/fetch";
import { getListOfPlugins } from "../../utils/plugins/getListOfPlugins";

export async function GET({ params }: { params: { cls: string } }) {
  const cls = params.cls;
  const response = await fetch(`https://api.kestra.io/v1/plugins/icons/${cls}`);

  if (!response.ok) {
    throw new Error('Failed to fetch icon');
  }

  const svg = await response.text();
  const modifiedSvg = svg.replace(/currentColor/g, "#CAC5DA");

  return new Response(modifiedSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=86400',
    },
  });
}

function resolveSubPlugins(plugins: any[], allPluginsCls: Set<string>) {
    for (const plugin of plugins || []) {
        const entries = Object.entries(plugin).filter(([key, value]) => isEntryAPluginElementPredicate(key, value)) as [string, any][];
        for (const [key, sectionEntries] of entries) {
            if (sectionEntries) {
                for (const {cls} of sectionEntries.filter(({deprecated}) => !deprecated)) {
                    if(cls){
                        allPluginsCls.add(cls);
                    }
                }
            }
        }
    }
}

export async function getStaticPaths() {
  const plugins = await $fetch(`https://api.kestra.io/v1/plugins/subgroups`);

  const allPluginsCls = new Set(getListOfPlugins(plugins).map(p => p.subGroup ?? p.group).filter((cls?: string) => cls !== undefined) as string[]);
  resolveSubPlugins(plugins, allPluginsCls);
  return Array.from(allPluginsCls).map(cls => ({ params: { cls } }));
}