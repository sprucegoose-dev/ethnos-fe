import { Reducer } from '@reduxjs/toolkit';
import { IAppReducer } from '../components/App/App.reducer.types';
import { IAuthReducer } from '../components/Auth/Auth.types';
import { IGameReducer } from '../components/Game/Game.reducer.types';

export interface IRootReducer {
    app: Reducer<IAppReducer>;
    auth: Reducer<IAuthReducer>;
    game: Reducer<IGameReducer>;
}
