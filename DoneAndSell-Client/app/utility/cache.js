import AsyncStorage from "@react-native-community/async-storage";

import moment from "moment";

const prefix = "cache";
const expiryTime = 5;

//Store Data
const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (error) {
    console.log("Inside async store: ", error);
  }
};

//Check if the retrieved data is expired or not
const isExpired = (item) => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, "minutes") > expiryTime;
};

//Get Data
const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

    if (!item) return null;

    if (isExpired(item)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.log("Inside async get: ", error);
  }
};

export default { store, get };
