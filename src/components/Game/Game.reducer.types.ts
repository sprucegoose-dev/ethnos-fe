export interface IGameReducer {
    selectedCardIds: number[];
    selectedLeaderId: number;
    selectedCardIdsToKeep: number[];
    undoModal: {
        description: string;
        show: boolean;
        undoApprovalId: number;
    }
};

export interface ISetCardIdsAction {
    cardIds: number[];
}

export interface ISetLeaderIdAction {
    leaderId: number;
}

export interface ISetUndoModalAction {
    description: string;
    show: boolean;
    undoApprovalId: number;
}
