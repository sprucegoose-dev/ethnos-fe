import { Reducer } from '@reduxjs/toolkit';
import { IAuthReducer } from '../components/Auth/Auth.types';
import { IGameReducer } from '../components/Game/Game.reducer.types';

export interface IRootReducer {
    auth: Reducer<IAuthReducer>;
    game: Reducer<IGameReducer>;
}
