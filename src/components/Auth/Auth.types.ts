export interface IAuthReducer {
    userId: number;
    username: string;
    sessionId: string;
    sessionExp: string;
};

export interface ISetAuthDetailsAction {
    id: number;
    username: string;
    sessionId: string;
    sessionExp: string;
}
