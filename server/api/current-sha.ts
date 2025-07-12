const KEY_CURRENT_SHA = 'currentSha'

export default defineEventHandler(async (event) => {
     const storage = useStorage()
    // deal with only get and put of currentSha using useStorage
    if (event.method === 'GET') {
        const currentSha = await storage.getItem(KEY_CURRENT_SHA)
        console.log(`Current SHA fetched: ${currentSha}`)
        return { sha: currentSha }
    }

    if (event.method === 'PUT') {
        const body = await readBody(event)
        await storage.setItem(KEY_CURRENT_SHA, body.sha)
        console.log(`Current SHA set: ${body.sha}`)
        return { sha: body.sha }
    }
})