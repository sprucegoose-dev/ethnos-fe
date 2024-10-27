import { IActionPayload, IGameState, IPlayer } from '../Game/Game.types';

export interface IDeckProps {
    activePlayer: IPlayer;
    actions: IActionPayload[];
    gameState: IGameState;
}
