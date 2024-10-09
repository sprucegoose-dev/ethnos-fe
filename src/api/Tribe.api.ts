import { Method, requestOptions } from './Api.types';
import api from './Api';

export default class TribeApi {

    static async getAll() {
        const options = {
            ...requestOptions,
        };
        console.log('got here');

        return await api.request(Method.GET, '/tribe/all', options);
    }
}
