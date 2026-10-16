import { $fetchApiCachedOptional } from "~/utils/fetch";

export interface BlueprintRender {
  source: string;
  graph: unknown | null;
}

export async function resolveBlueprintRenders<T extends { blueprintId?: string }>(
  items: T[]
): Promise<(T & { render?: BlueprintRender })[]> {
  return Promise.all(
    items.map(async (item) => {
      if (!item.blueprintId) {
        return item;
      }

      const flow = await $fetchApiCachedOptional<{ flow: string }>(
        buildBlueprintFlowUrl(item.blueprintId)
      );

      if (!flow) {
        return item;
      }

      const graph = await $fetchApiCachedOptional<unknown>(
        buildBlueprintGraphUrl(item.blueprintId)
      );

      return {
        ...item,
        render: {
          source: flow.flow,
          graph: graph ?? null,
        },
      };
    })
  );
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
