import { ICard, IPlayer } from '../Game/Game.types';

export interface IPlayerAreaProps {
    className: string;
    player: IPlayer & { cardsInHand: ICard[] };
}
