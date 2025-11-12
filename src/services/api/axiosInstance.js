import axios from "axios";


export class AxiosClient {
    constructor(baseURL) {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 10000,
            headers: { "Content-Type": "application/json" },
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const apiKey = process.env.REACT_APP_API_KEY;

                config.headers.Authorization = `Bearer ${apiKey}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                console.error("API Error:", error);
                throw this._handleAxiosError(error);
            }
        );
    }

    _handleAxiosError(error) {
        if (error.response) {
            return new Error(error.response.data?.message || "Server error");
        } else if (error.request) {
            return new Error("No response from server");
        } else {
            return new Error(error.message);
        }
    }

    _buildFormData(body) {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
            } else {
                formData.append(key, value);
            }
        });
        return formData;
    }

    async get(apiUrl, { params, responseBytes = false, customBaseUrl } = {}) {
        const instance = customBaseUrl
            ? this.axiosInstance.create({ baseURL: customBaseUrl })
            : this.axiosInstance;

        const responseType = responseBytes ? "arraybuffer" : "json";

        return await instance.get(apiUrl, { params, responseType });
    }

    async post(body, apiUrl, { hasImages = false, customBaseUrl, params } = {}) {
        const instance = customBaseUrl
            ? this.axiosInstance.create({ baseURL: customBaseUrl })
            : this.axiosInstance;

        const data = hasImages ? this._buildFormData(body) : body;
        return await instance.post(apiUrl, data, { params });
    }

    async put(body, apiUrl, { hasImages = false, customBaseUrl, params } = {}) {
        const instance = customBaseUrl
            ? this.axiosInstance.create({ baseURL: customBaseUrl })
            : this.axiosInstance;

        const data = hasImages ? this._buildFormData(body) : body;
        return await instance.put(apiUrl, data, { params });
    }

    async patch(body, apiUrl, { hasImages = false, customBaseUrl, params } = {}) {
        const instance = customBaseUrl
            ? this.axiosInstance.create({ baseURL: customBaseUrl })
            : this.axiosInstance;

        const data = hasImages ? this._buildFormData(body) : body;
        return await instance.patch(apiUrl, data, { params });
    }

    async delete(body, apiUrl, { customBaseUrl, params } = {}) {
        const instance = customBaseUrl
            ? this.axiosInstance.create({ baseURL: customBaseUrl })
            : this.axiosInstance;

        return await instance.delete(apiUrl, { params, data: body });
    }
}