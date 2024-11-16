export interface IGameReducer {
    selectedCardIds: number[];
    selectedLeaderId: number;
    selectedCardIdsToKeep: number[];
};

export interface ISetCardIdsAction {
    cardIds: number[];
}

export interface ISetLeaderIdAction {
    leaderId: number;
}
