import { IGameState, IPlayer } from '../Game/Game.types';

export interface IDeckProps {
    activePlayer: IPlayer;
    gameState: IGameState;
}
