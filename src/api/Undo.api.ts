import { Method, requestOptions } from './Api.types';
import api from './Api';
import { ISendDecisionPayload } from '../components/Undo/Undo.types';

export default class UndoApi {

    static async getUndoState(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/undo/${gameId}`, options);
    }

    static async requestUndo(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/undo/${gameId}/request`, options);
    }

    static async sendDecision(gameId: number, payload: ISendDecisionPayload) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload
        };

        return await api.request(Method.POST, `/undo/${gameId}/decision`, options);
    }
}
