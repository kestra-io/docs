import axios from 'axios'

export const useApi = () => {
    // @ts-ignore
    if (typeof useRuntimeConfig === 'undefined') {
        return axios.create({
            baseURL: "https://api.kestra.io/v1"
        })
    }
    // @ts-ignore
    const runtimeConfig = useRuntimeConfig()

    return axios.create({
        baseURL: runtimeConfig.public.apiUrl
    })
};
