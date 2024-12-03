
import { Method, requestOptions } from './Api.types';
import api from './Api';

export default class ChatApi {

    static async getMessages(gameId: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/chat/${gameId}/messages`, options);
    }

    static async sendMessage(gameId: number, message: string) {
        const options = {
            ...requestOptions,
            authorize: true,
            payload: {
                message,
            }
        };

        return await api.request(Method.POST, `/chat/${gameId}/message`, options);
    }
}
