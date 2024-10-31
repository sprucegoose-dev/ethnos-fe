import { IActionPayload, ICard, IPlayBandPayload, IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerHandProps {
    className: string;
    player: IPlayer & { cardsInHand: ICard[] };
    actions?: IActionPayload[];
}
