import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageHelper = {
  getValue: async (key: string) => {
    return await AsyncStorage.getItem(key);
  },
  setValue: async (key: string, value: string) => {
    // console.log(`Setting ${key} to ${value}`);
    return await AsyncStorage.setItem(key, value);
  },
  removeValue: async (key: string) => {
    return await AsyncStorage.removeItem(key);
  },
  clear: async () => {
    return await AsyncStorage.clear();
  },
  printAllValues: async () => {
    (await AsyncStorage.getAllKeys()).forEach(async (key: string) => {
      if (!["TOKEN"].includes(key)) {
        // console.log(`${key} - ${await StorageHelper.getValue(key)}`);
      }
    });
  },
};
