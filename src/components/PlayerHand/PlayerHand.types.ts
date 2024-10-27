import { ICard, IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerHandProps {
    className: string;
    player: IPlayer & { cardsInHand: ICard[] };
}
