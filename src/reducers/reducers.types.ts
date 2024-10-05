import { Reducer } from '@reduxjs/toolkit';
import { IAuthReducer } from '../components/Auth/Auth.types';

export interface IRootReducer {
    auth: Reducer<IAuthReducer>;
}
