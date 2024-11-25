import { Method, requestOptions } from './Api.types';
import { IGameSettings, PlayerColor } from '../components/Game/Game.types';
import { IActionPayload } from '../components/Game/Action.types';
import { ICreateGamePayload } from '../components/RoomForm/RoomForm.types';
import api from './Api';

export default class GameApi {

    static async addBotPlayer(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/game/${gameId}/addBot`, options);
    }

    static async assignPlayerColor(gameId: number, color: PlayerColor) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload: {
                color
            }
        };

        return await api.request(Method.POST, `/game/${gameId}/assignColor`, options);
    }

    static async create(payload: ICreateGamePayload) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload,
        };

        return await api.request(Method.POST, '/game/create', options);
    }

    static async getActionsLog(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/actionsLog`, options);
    }

    static async getActions(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/actions`, options);
    }

    static async getActiveGames() {
        const options = {
            ...requestOptions,
        };

        return await api.request(Method.GET, '/game/all', options);
    }

    static async getAgeResults(gameId: number, age: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/age/${age}`, options);
    }

    static async getCardsInHand(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/hand`, options);
    }

    static async getGameCards(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/cards`, options);
    }

    static async getPlayerHands(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}/playerHands`, options);
    }

    static async getState(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/game/${gameId}`, options);
    }

    static async join(gameId: number, password: string = null) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload: {
                password
            }
        };

        return await api.request(Method.POST, `/game/${gameId}/join`, options);
    }

    static async leave(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.POST, `/game/${gameId}/leave`, options);
    }

    static async orderCards(gameId: number, cardIds: number[]) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload: {
                cardIds,
            },
        };

        return await api.request(Method.POST, `/game/${gameId}/orderCards`, options);
    }

    static async removeBotPlayer(gameId: number, botPlayerId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.DELETE, `/game/${gameId}/removeBot/${botPlayerId}`, options);
    }

    static async sendAction(gameId: number, payload: IActionPayload) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload,
        };

        return await api.request(Method.POST, `/game/${gameId}/action`, options);
    }

    static async start(gameId: number, payload: IGameSettings) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload,
        };

        return await api.request(Method.POST, `/game/${gameId}/start`, options);
    }

    static async updateSettings(gameId: number, payload: IGameSettings) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload,
        };

        return await api.request(Method.POST, `/game/${gameId}/updateSettings`, options);
    }
}
