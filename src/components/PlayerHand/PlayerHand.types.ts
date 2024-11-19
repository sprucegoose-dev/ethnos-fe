import { ICard, IPlayer } from '../Game/Game.types';
import { IActionPayload } from '../Game/Action.types';

export interface IPlayerHandProps {
    className: string;
    player: IPlayer & { cardsInHand: ICard[] };
    actions?: IActionPayload[];
    showCards: boolean;
}
