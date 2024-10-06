import {
    IRequestOptions,
    Method,
    requestOptions,
} from './Api.types';

import { RootState, store } from '../reducers/store';

class Api {

    async request(method: Method, url: string, options: IRequestOptions = requestOptions) {
        const {
            authorize,
            payload,
        } = options;

        const baseUrl = process.env.NODE_ENV === 'production' ?
            `${process.env.REACT_APP_BASE_API_URL_PROD}/api` :
            process.env.REACT_APP_BASE_API_URL_DEV;

        const fetchOptions: any = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (authorize) {
            const state = store.getState() as RootState;
            const sessionId = state.auth.sessionId;
            fetchOptions.headers.Authorization = `Bearer ${sessionId}`;
        }

        if (payload && typeof payload === 'object') {
            fetchOptions.body = JSON.stringify(payload);
        }

        const response = await fetch(`${baseUrl}${url}`, fetchOptions);

        return response;
    }
}

export default new Api();
