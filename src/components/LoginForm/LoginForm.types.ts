export interface ILoginFormErrors {
    email: string;
    username: string;
    password: string;
}

export enum LoginFormType {
    SIGN_IN = 'SIGN_IN',
    SIGN_UP = 'SIGN UP'
}

export interface ISignUpRequest {
    email: string;
    username: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IUser {
    username: string;
    id: number;
}
