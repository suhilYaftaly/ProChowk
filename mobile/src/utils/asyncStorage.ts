import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDataInAsyncStore = async (keyVal: string, objVal: any) => {
  try {
    const valObj = JSON.stringify(objVal);
    await AsyncStorage.setItem(keyVal, valObj);
  } catch (e) {
    // saving error
    console.log('Error saving data in storage');
  }
};

export const getDataFromAsyncStore = async (keyVal: string) => {
  try {
    const storedVal = await AsyncStorage.getItem(keyVal);
    return storedVal != null ? JSON.parse(storedVal) : null;
  } catch (e) {
    // error reading value
    console.log('Error reading data from storage');
  }
};

export const removeDataFromAsyncStore = async (keyVal: string) => {
  try {
    await AsyncStorage.removeItem(keyVal);
  } catch (e) {
    // remove error
    console.log('Error removing data from storage');
  }
};
