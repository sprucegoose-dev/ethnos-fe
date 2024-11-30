import { IGameState, IPlayer } from '../Game/Game.types';

export interface IUndoApprovalProps {
    currentPlayer: IPlayer;
    gameState: IGameState;
}
