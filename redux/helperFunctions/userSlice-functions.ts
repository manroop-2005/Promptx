import * as SecureStore from 'expo-secure-store';
import { UserState } from "../slices/userSlice";


export const storeUserData = async (userData: UserState) => {
  try {
    console.log(" user store successfully",userData)
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const data = await SecureStore.getItemAsync('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};