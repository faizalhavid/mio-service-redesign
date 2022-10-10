import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageHelper = {
  getValue: async (key: string) => AsyncStorage.getItem(key),
  setValue: async (key: string, value: string) => 
    // console.log(`Setting ${key} to ${value}`);
     AsyncStorage.setItem(key, value)
  ,
  removeValue: async (key: string) => AsyncStorage.removeItem(key),
  clear: async () => AsyncStorage.clear(),
  printAllValues: async () => {
    (await AsyncStorage.getAllKeys()).forEach(async (key: string) => {
      if (!["TOKEN"].includes(key)) {
        console.log(`${key} - ${await StorageHelper.getValue(key)}`);
      }
    });
  },
};
