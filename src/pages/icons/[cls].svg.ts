import { getListOfPlugins } from "../../utils/plugins/getListOfPlugins";

export async function GET({ params }: { params: { cls: string } }) {
  const cls = params.cls;
  const response = await fetch(`https://api.kestra.io/v1/plugins/icons/${cls}`);

  if (!response.ok) {
    throw new Error('Failed to fetch icon');
  }

  const svg = await response.text();
  const modifiedSvg = svg.replaceAll("currentColor", "#CAC5DA");

  return new Response(modifiedSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=86400',
    },
  });
}



export async function getStaticPaths() {
  const pluginsRes = await fetch(`https://api.kestra.io/v1/plugins/subgroups`);
  const pluginsData = await pluginsRes.json();
  const allPluginsCls = new Set(getListOfPlugins(pluginsData).map(p => p.subGroup ?? p.group).filter((cls?: string) => cls !== undefined) as string[]);
  return Array.from(allPluginsCls).map(cls => ({ params: { cls } }));
}