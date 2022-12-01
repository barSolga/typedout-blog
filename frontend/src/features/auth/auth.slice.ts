import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { AuthState, iUserResponse, iUserRegister, iUserLogin } from '../../interaces';
import authService from './auth.service';

// Get user from localStorage
const user: iUserResponse = JSON.parse(localStorage.getItem('user') as string);

const initialState: AuthState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk('auth/register', async (user: iUserRegister, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async (user: iUserLogin, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const logout = createAsyncThunk('auth/logout', () => {
    authService.logout();
});

// Slice setup
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = false
          state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state: any) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state: any, action: any) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state: any, action: any) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state: any) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state: any, action: any) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state: any, action: any) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state: any) => {
                state.user = null
            })
    }
});


export const { reset } = authSlice.actions
export default authSlice.reducer

