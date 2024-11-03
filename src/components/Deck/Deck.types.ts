import { IGameState, IPlayer } from '../Game/Game.types';
import { IActionPayload } from '../Game/Action.types';

export interface IDeckProps {
    activePlayer: IPlayer;
    actions: IActionPayload[];
    gameState: IGameState;
}
