import axios from "axios"
import { API_URL } from "astro:env/client"

export const useApi = () => {
    // @ts-ignore
    if (typeof useRuntimeConfig === "undefined") {
        return axios.create({
            baseURL: API_URL,
        })
    }
    // @ts-ignore
    const runtimeConfig = useRuntimeConfig()

    return axios.create({
        baseURL: runtimeConfig.public.apiUrl,
    })
}