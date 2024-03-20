import axios from 'axios'

export const useApi = () => {
    const runtimeConfig = useRuntimeConfig()

    return axios.create({
        baseURL: runtimeConfig.public.apiUrl
    })
};
