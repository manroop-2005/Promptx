import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserData, removeUserData, storeUserData } from '../helperFunctions/userSlice-functions';


export interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  profilePicture: string | null;
  savedPrompts: number | null;
  createdPrompts: number | null;
  subscriptionType: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  profilePicture: null,
  savedPrompts: null,
  createdPrompts: null,
  subscriptionType: null,
};

// Thunks
export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getUserData();
      if (!userData) return rejectWithValue('No user data found');
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load user data');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      Object.assign(state, userData);
      storeUserData(userData);
    },
    clearUser: (state) => {
      Object.assign(state, initialState);
      removeUserData();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;