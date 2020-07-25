import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    console.log("Error storing auth token.", error);
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Error getting auth token.", error);
  }
};

const getUser = async () => {
  try {
    const token = await getToken();
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.log("Error in getUser: ", error);
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing  auth token.", error);
  }
};

export default { getToken, getUser, storeToken, removeToken };
