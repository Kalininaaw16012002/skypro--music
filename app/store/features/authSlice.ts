import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  userName: string;
  access: string; 
  refresh: string; 
};

const initialState: initialStateType = {
  userName: '',
  access: '',
  refresh: '',
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
        state.userName = action.payload;
    },
    setAccess: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
    },
    setRefresh: (state, action: PayloadAction<string>) => {
      state.refresh = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ userName: string; access: string; refresh: string }>) => {
      state.userName = action.payload.userName;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    clearAuth: (state) => {
      state.userName = '';
      state.access = '';
      state.refresh = '';
    },
  },
});

export const {
  setUserName,
  setAccess,     
  setRefresh,    
  setAuth,        
  clearAuth,      
} = authSlice.actions;
export const authSliceReducer = authSlice.reducer;