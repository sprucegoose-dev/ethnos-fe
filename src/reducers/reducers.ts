import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../components/App/App.reducer';
import authReducer from '../components/Auth/Auth.reducer';
import gameReducer from '../components/Game/Game.reducer';
import { IRootReducer } from './reducers.types';

export const rootReducer = combineReducers<IRootReducer>({
    app: appReducer,
    auth: authReducer,
    game: gameReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
