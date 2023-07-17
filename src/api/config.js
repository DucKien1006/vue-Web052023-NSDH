import axios from "axios";

const urlApi = {
    localUrl: "https://localhost:7034/api/v1",
    localUrlV2: "https://localhost:7166/api/v1",
    ManhNVUrl: "https://cukcuk.manhnv.net/api/v1",
};

/**
 * Khởi tạo đối tượng axios
 */
const axiosAPI = axios.create({
    // baseURL: urlApi.localUrlV2
    baseURL: urlApi.ManhNVUrl
});

/**
 * Custom request
 */
axiosAPI.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * Custom dữ liệu trả về
 */
axiosAPI.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosAPI;
