
import { ILoginRequest, ISignUpRequest } from '../components/LoginForm/LoginForm.types';
import { Method, requestOptions } from './Api.types';
import api from './Api';

export default class UserApi {

    static async signUp(payload: ISignUpRequest) {
        const options = {
            ...requestOptions,
            payload,
        }

        return await api.request(Method.POST, '/user/create', options);
    }

    static async login(payload: ILoginRequest) {
        const options = {
            ...requestOptions,
            payload,
        }

        return await api.request(Method.POST, '/user/login', options);
    }

    static async delete() {
        const options = {
            ...requestOptions,
            authorize: true,
        }

        return await api.request(Method.DELETE, '/user', options);
    }

    static async getDetails() {
        const options = {
            ...requestOptions,
            authorize: true,
        }

        return await api.request(Method.GET, '/user', options);
    }


    static async getMatches(username: string, page: number) {
        const options = {
            ...requestOptions,
            authorize: true,
        };

        return await api.request(Method.GET, `/user/${username}/matches?page=${page}`, options);
    }
}
