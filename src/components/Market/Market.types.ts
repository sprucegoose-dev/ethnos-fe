import { IGameState, IPlayer } from '../Game/game.types';

export interface IDeckProps {
    activePlayer: IPlayer;
    gameState: IGameState;
}
