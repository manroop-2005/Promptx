import { AuthService } from '@/api/Auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { getToken, removeToken, storeToken } from '../helperFunctions/authslice-functions';
import { removeUserData } from '../helperFunctions/userSlice-functions';
import { setUser } from './userSlice';



interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
   error: string | null;
}


const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
   error: null,
};



// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await AuthService.login(credentials);
      const payload = response?.data ?? response;
      const authData = payload?.data ?? payload;

      if (!authData?.token) {
        return rejectWithValue(payload?.message || 'Login failed');
      }

      await storeToken(authData.token);
      if (authData?.user) {
        dispatch(setUser(authData.user));
      }

      return { token: authData.token, user: authData.user };
    } catch (error: any) {
      return rejectWithValue(error?.message || error?.response?.data?.message || 'Login failed');
    }
  }
);



export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { email: string; password: string; name: string },
    { rejectWithValue,dispatch }
  ) => {
    try {
      const response = await AuthService.register(userData);
      const payload = response?.data ?? response;
      const authData = payload?.data ?? payload;
      console.log('Registration response: in authslice', payload);

      if (!authData?.token) {
        return rejectWithValue(payload?.message || 'Registration failed');
      }

      await storeToken(authData.token);
      console.log('User token stored', authData.token);

      // Set user data after successful signup
      if (authData?.newUser || authData?.user) {
        const newUser = authData?.newUser || authData?.user;
        console.log('New user data:', newUser);
        dispatch(setUser(newUser));
      }
      return authData;

    } catch (error: any) {
      return rejectWithValue(error?.message || error?.response?.data?.message || 'Registration failed');
    }
  }
);





export const googleOauth = createAsyncThunk(
  'auth/googleLogin',
  async (
    { idToken, user }: { idToken: string; user: any },{dispatch, rejectWithValue}
  ) => {
    try {
      const response = await AuthService.googleLogin(idToken, user);
      const payload = response?.data ?? response;
      const authData = payload?.data ?? payload;
      console.log("response data",payload)

      if (!authData?.token) {
        return rejectWithValue(payload?.message || 'Google Sign In Failed');
      }

      await storeToken(authData.token);
      dispatch(setUser(authData.user));
      return { token: authData.token, user: authData.user };
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Google Sigin Failed',
        text2: error.response?.data?.message,
      });
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Google Sign In Failed');
      }
  }
)


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token  = await getToken();
      if(token){
        await removeToken();
        await removeUserData();
      }
      return;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Logout',
        text2: error.response?.data?.message,
      });
    }
  }
);



export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await getToken();
      console.log("token in checkauth", token)
      if (!token) return rejectWithValue('No token found');

      const response = await AuthService.checkAuthentication();

      console.log("auth check response",response)

      if (response.success) {
        dispatch(setUser(response.data))
        await storeToken(token)
        return token;
      }

      await removeToken();
      await removeUserData();
      return rejectWithValue(response?.message || 'Unauthorized');
    } catch (error: any) {
      const token = await getToken();
      if(token){
        await removeToken();
        await removeUserData();
      }
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Unauthorized');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder 
     .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(googleOauth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleOauth.fulfilled, (state, action) => {
        state.token = action.payload?.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(googleOauth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

     
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload as string;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state,action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
    }

});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;