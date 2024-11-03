import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    IGameReducer,
    ISetCardIdsAction,
    ISetLeaderIdAction,
} from './Game.reducer.types';

export const gameReducer = createSlice({
  name: 'game',
  initialState: {
    selectedCardIds: [],
    selectedLeaderId: null,
  },
  reducers: {
    setSelectedCardIds: (state: IGameReducer, {payload}:  PayloadAction<ISetCardIdsAction>) => {
        state.selectedCardIds = payload.cardIds
    },
    setSelectedLeaderId: (state: IGameReducer, {payload}:  PayloadAction<ISetLeaderIdAction>) => {
        state.selectedLeaderId = payload.leaderId
    },
  },
})

export const {
    setSelectedCardIds,
    setSelectedLeaderId,
} = gameReducer.actions;

export default gameReducer.reducer;
