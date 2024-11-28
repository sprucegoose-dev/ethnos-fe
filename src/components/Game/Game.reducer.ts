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
    selectedCardIdsToKeep: [],
    selectedLeaderId: null,
  },
  reducers: {
    setSelectedCardIds: (state: IGameReducer, {payload}: PayloadAction<ISetCardIdsAction>) => {
        state.selectedCardIds = payload.cardIds;
    },
    setSelectedCardIdsToKeep: (state: IGameReducer, {payload}: PayloadAction<ISetCardIdsAction>) => {
        state.selectedCardIdsToKeep = payload.cardIds;
    },
    setSelectedLeaderId: (state: IGameReducer, {payload}: PayloadAction<ISetLeaderIdAction>) => {
        state.selectedLeaderId = payload.leaderId;
    },
    clearSelections: (state: IGameReducer) => {
        state.selectedCardIds = [];
        state.selectedCardIdsToKeep = [];
        state.selectedLeaderId = null;
    }
  },
})

export const {
    clearSelections,
    setSelectedCardIds,
    setSelectedLeaderId,
    setSelectedCardIdsToKeep,
} = gameReducer.actions;

export default gameReducer.reducer;
