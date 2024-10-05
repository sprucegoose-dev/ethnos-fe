import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../components/Auth/Auth.reducer';
import { IRootReducer } from './reducers.types';

export const rootReducer = combineReducers<IRootReducer>({
    auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
