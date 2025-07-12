import { contentPrefix } from "~/content.config.names"

const KEY_CURRENT_SHA = contentPrefix + 'currentSha'

export default defineEventHandler(async (event) => {
    const storage = useStorage('kv')

    if (event.method === 'GET') {
        const currentSha = await storage.getItem(KEY_CURRENT_SHA)
        return { sha: currentSha }
    }

    if (event.method === 'PUT') {
        const body = await readBody(event)
        await storage.setItem(KEY_CURRENT_SHA, body.sha)
        return { sha: body.sha }
    }
})