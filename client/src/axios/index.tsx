import axios, { AxiosInstance } from "axios"
import config from "../Config"

const { BACKEND_URL } = config;

const instance: AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials:true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance
