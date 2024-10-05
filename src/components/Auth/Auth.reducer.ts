import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthReducer, ISetAuthDetailsAction } from './Auth.types';

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    username: null,
    sessionId: null,
    sessionExp: null,
  },
  reducers: {
    setAuthDetails: (state: IAuthReducer, {payload}:  PayloadAction<ISetAuthDetailsAction>) => {
        state.userId = payload.id;
        state.username = payload.username;
        state.sessionExp = payload.sessionExp;
        state.sessionId = payload.sessionId;
    },
    resetAuthDetails: (state: IAuthReducer) => {
        state.userId = null;
        state.username = null;
        state.sessionExp = null;
        state.sessionId = null;
    }
  },
})

export const { resetAuthDetails, setAuthDetails } = authReducer.actions;

export default authReducer.reducer;
