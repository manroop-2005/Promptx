
import * as SecureStore from 'expo-secure-store';
import Toast from "react-native-toast-message";


export const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('authToken', token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing token:', error);
    Toast.show({
      type: 'error',
      text1: 'Storage Error',
      text2: 'Failed to store authentication token',
    });
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    console.log('Token retrieved successfully:', token);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};