import { contentPrefix } from "~/content.config.names"

const KEY_CURRENT_SHA =  'current-sha'

export default defineEventHandler(async (event) => {
    const storage = useStorage('kv')

    // get scope from query params
    const body = await readBody(event)
    const scope = body.scope
    const maintenanceKey = scope ? `${contentPrefix}${scope}_${KEY_CURRENT_SHA}` : KEY_CURRENT_SHA

    if (event.method === 'POST') {
        const currentSha = await storage.getItem(maintenanceKey)
        return { sha: currentSha }
    }

    if (event.method === 'PUT') {

        await storage.setItem(maintenanceKey, body.sha)
        return { sha: body.sha }
    }
})