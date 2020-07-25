import { create } from "apisauce";
import cache from "../app/utility/cache";
import authStorage from "../app/auth/storage";

const apiClient = create({
  baseURL: "http://192.168.0.110:3000/",
});

apiClient.addAsyncRequestTransform(async (request) => {
  if (request.url !== "/login" && request.url !== "/register") {
    const authToken = await authStorage.getToken();

    if (!authToken) return alert("You must be logged in");
    request.headers["Authorization"] = "Bearer " + authToken;
  }
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
