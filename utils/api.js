import axios from 'axios'

const baseURL = 'https://api.kestra.io/v1'

export const kestraInstance = axios.create({
    baseURL
})