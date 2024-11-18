import { IActionPayload } from '../Game/Action.types';
import { ICard, IGameState, IPlayer } from '../Game/Game.types';

export interface IRegionsProps {
    actions: IActionPayload[];
    cardsInHand: ICard[];
    currentPlayer: IPlayer;
    gameState: IGameState;
}
