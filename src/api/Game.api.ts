import { Method, requestOptions } from './Api.types';
import { IActionPayload } from '../types/game.types';
import api from './Api';

export default class GameApi {

    static async getActiveGames() {
        const options = {
            ...requestOptions,
        };

        return await api.request(Method.GET, '/game/all', options);
    }

    static async leave(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/game/${gameId}/leave`, options);
    }

    static async join(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/game/${gameId}/join`, options);
    }

    static async create() {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, '/game', options);
    }

    static async start(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/game/${gameId}/start`, options);
    }

    static async getState(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}`, options);
    }

    static async getActions(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/actions`, options);
    }

    static async sendAction(gameId: number, payload: IActionPayload) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload,
        };

        return await api.request(Method.POST, `/game/${gameId}/action`, options);
    }

}
