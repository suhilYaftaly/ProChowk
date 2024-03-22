import * as SecureStore from 'expo-secure-store';

export function saveInLocalStorage(key: string, value: string) {
  SecureStore.setItem(key, value);
}

export function getValueFromLocalStorage(key: string) {
  let result = SecureStore.getItem(key);
  return result;
}

export async function deleteFromLocalStorage(key: string) {
  SecureStore.deleteItemAsync(key);
}
