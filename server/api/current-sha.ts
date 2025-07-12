export default defineEventHandler(async (event) => {
    const currentSHA = useRuntimeConfig().public.currentSHA
    return {
        sha: currentSHA
    }
})