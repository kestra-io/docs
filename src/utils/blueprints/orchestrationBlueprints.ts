import { $fetchApiCachedOptional } from "~/utils/fetch";

export interface BlueprintItem {
  blueprintId?: string;
  [key: string]: unknown;
}

export interface BlueprintRender {
  source: string;
  graph: unknown | null;
}

export interface BlueprintItemWithRender extends BlueprintItem {
  render?: BlueprintRender;
}

export async function resolveBlueprintRenders(
  items: BlueprintItem[]
): Promise<BlueprintItemWithRender[]> {
  const results = await Promise.all(
    items.map(async (item) => {
      if (!item.blueprintId) {
        return item;
      }

      const flow = await $fetchApiCachedOptional<{ source: string }>(
        `/blueprints/${item.blueprintId}/versions/latest`
      );

      if (!flow) {
        return item;
      }

      const graph = await $fetchApiCachedOptional<unknown>(
        `/blueprints/${item.blueprintId}/versions/latest/graph`
      );

      return {
        ...item,
        render: {
          source: flow.source,
          graph: graph ?? null,
        },
      };
    })
  );

  return results;
}

export function buildBlueprintFlowUrl(blueprintId: string): string {
  return `/blueprints/${blueprintId}/versions/latest`;
}

export function buildBlueprintGraphUrl(blueprintId: string): string {
  return `/blueprints/${blueprintId}/versions/latest/graph`;
}

export function buildToolBlueprintCountUrl(toolName: string): string {
  return `/blueprints/versions/latest?q=${encodeURIComponent(toolName)}&size=1`;
}

export async function fetchToolBlueprintCount(toolName: string): Promise<number> {
  const url = buildToolBlueprintCountUrl(toolName);
  const result = await $fetchApiCachedOptional<{ total: number }>(url);
  return result?.total ?? 0;
}