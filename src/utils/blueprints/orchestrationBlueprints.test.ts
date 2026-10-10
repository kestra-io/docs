import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  resolveBlueprintRenders,
  fetchToolBlueprintCount,
  buildBlueprintFlowUrl,
  buildBlueprintGraphUrl,
  buildToolBlueprintCountUrl,
} from "./orchestrationBlueprints";

vi.mock("~/utils/fetch", () => ({
  $fetchApiCachedOptional: vi.fn(),
}));

import { $fetchApiCachedOptional } from "~/utils/fetch";

describe("orchestrationBlueprints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("buildBlueprintFlowUrl", () => {
    it("builds correct flow URL", () => {
      expect(buildBlueprintFlowUrl("my-blueprint")).toBe("/blueprints/my-blueprint/versions/latest");
    });
  });

  describe("buildBlueprintGraphUrl", () => {
    it("builds correct graph URL", () => {
      expect(buildBlueprintGraphUrl("my-blueprint")).toBe("/blueprints/my-blueprint/versions/latest/graph");
    });
  });

  describe("buildToolBlueprintCountUrl", () => {
    it("builds correct count URL with encoding", () => {
      expect(buildToolBlueprintCountUrl("my tool")).toBe("/blueprints/versions/latest?q=my%20tool&size=1");
    });

    it("handles special characters", () => {
      expect(buildToolBlueprintCountUrl("tool&name")).toBe("/blueprints/versions/latest?q=tool%26name&size=1");
    });
  });

  describe("resolveBlueprintRenders", () => {
    it("returns items with render when both flow and graph succeed", async () => {
      vi.mocked($fetchApiCachedOptional)
        .mockResolvedValueOnce({ flow: "flow source 1" })
        .mockResolvedValueOnce({ flow: "flow source 2" })
        .mockResolvedValueOnce({ nodes: [], edges: [] })
        .mockResolvedValueOnce({ nodes: [1], edges: [2] });

      const items = [
        { blueprintId: "bp1", name: "Item 1" },
        { blueprintId: "bp2", name: "Item 2" },
      ];

      const result = await resolveBlueprintRenders(items);

      expect(result).toEqual([
        { blueprintId: "bp1", name: "Item 1", render: { source: "flow source 1", graph: { nodes: [], edges: [] } } },
        { blueprintId: "bp2", name: "Item 2", render: { source: "flow source 2", graph: { nodes: [1], edges: [2] } } },
      ]);
    });

    it("returns item without render when flow fetch fails", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce(null);

      const items = [{ blueprintId: "bp1", name: "Item 1" }];

      const result = await resolveBlueprintRenders(items);

      expect(result).toEqual([{ blueprintId: "bp1", name: "Item 1" }]);
    });

    it("returns item with source only when graph fetch fails but flow succeeds", async () => {
      vi.mocked($fetchApiCachedOptional)
        .mockResolvedValueOnce({ flow: "flow source" })
        .mockResolvedValueOnce(null);

      const items = [{ blueprintId: "bp1", name: "Item 1" }];

      const result = await resolveBlueprintRenders(items);

      expect(result).toEqual([
        { blueprintId: "bp1", name: "Item 1", render: { source: "flow source", graph: null } },
      ]);
    });

    it("passes through items without blueprintId unchanged", async () => {
      const items = [{ name: "No blueprint" }, { blueprintId: "bp1", name: "Has blueprint" }];

      vi.mocked($fetchApiCachedOptional)
        .mockResolvedValueOnce({ flow: "flow" })
        .mockResolvedValueOnce({ nodes: [] });

      const result = await resolveBlueprintRenders(items);

      expect(result[0]).toEqual({ name: "No blueprint" });
      expect(result[1]).toHaveProperty("render");
    });

    it("handles empty array", async () => {
      const result = await resolveBlueprintRenders([]);
      expect(result).toEqual([]);
    });

    it("handles fetch returning null gracefully", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce(null);

      const items = [{ blueprintId: "bp1", name: "Item 1" }];

      const result = await resolveBlueprintRenders(items);

      expect(result).toEqual([{ blueprintId: "bp1", name: "Item 1" }]);
    });
  });

  describe("fetchToolBlueprintCount", () => {
    it("returns total on success", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce({ total: 42 });

      const result = await fetchToolBlueprintCount("terraform");

      expect(result).toBe(42);
      expect($fetchApiCachedOptional).toHaveBeenCalledWith("/blueprints/versions/latest?q=terraform&size=1");
    });

    it("returns 0 when total is missing", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce({});

      const result = await fetchToolBlueprintCount("terraform");

      expect(result).toBe(0);
    });

    it("returns 0 on 404", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce(null);

      const result = await fetchToolBlueprintCount("terraform");

      expect(result).toBe(0);
    });

    it("returns 0 when fetch returns null", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce(null);

      const result = await fetchToolBlueprintCount("terraform");

      expect(result).toBe(0);
    });

    it("encodes tool name in URL", async () => {
      vi.mocked($fetchApiCachedOptional).mockResolvedValueOnce({ total: 5 });

      await fetchToolBlueprintCount("my tool");

      expect($fetchApiCachedOptional).toHaveBeenCalledWith("/blueprints/versions/latest?q=my%20tool&size=1");
    });
  });
});