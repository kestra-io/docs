import { buildBlueprintGraphUrl } from "~/utils/blueprints/orchestrationBlueprints"
import { $fetchApi } from "~/utils/fetch"
import { cachedLoader } from "~/utils/search/loaders"

const graphs = cachedLoader((id) => $fetchApi(buildBlueprintGraphUrl(id)))

export const loadBlueprintGraph = graphs.load

export const isBlueprintGraphLoaded = graphs.isLoaded
