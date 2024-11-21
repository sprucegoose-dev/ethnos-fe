import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    IAppReducer,
    ISetAudioEnabledAction,
    ISetAudioMutedAction,
} from './App.reducer.types';

export const appReducer = createSlice({
  name: 'app',
  initialState: {
    audioEnabled: true,
    audioMuted: false,
  },
  reducers: {
    setAudioEnabled: (state: IAppReducer, {payload}:  PayloadAction<ISetAudioEnabledAction>) => {
        state.audioEnabled = payload.audioEnabled;
    },
    setAudioMuted: (state: IAppReducer, {payload}:  PayloadAction<ISetAudioMutedAction>) => {
        state.audioMuted = payload.audioMuted;
    },
  },
})

export const {
    setAudioMuted,
    setAudioEnabled,
} = appReducer.actions;

export default appReducer.reducer;
