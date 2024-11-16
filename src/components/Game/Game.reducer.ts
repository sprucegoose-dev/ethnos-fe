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
    selectedCardIdsToKeep: [],
  },
  reducers: {
    setSelectedCardIds: (state: IGameReducer, {payload}:  PayloadAction<ISetCardIdsAction>) => {
        state.selectedCardIds = payload.cardIds;
    },
    setSelectedLeaderId: (state: IGameReducer, {payload}:  PayloadAction<ISetLeaderIdAction>) => {
        state.selectedLeaderId = payload.leaderId;
    },
    setSelectedCardIdsToKeep: (state: IGameReducer, {payload}:  PayloadAction<ISetCardIdsAction>) => {
        state.selectedCardIdsToKeep = payload.cardIds;
    },
  },
})

export const {
    setSelectedCardIds,
    setSelectedLeaderId,
    setSelectedCardIdsToKeep,
} = gameReducer.actions;

export default gameReducer.reducer;
