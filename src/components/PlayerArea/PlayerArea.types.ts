import { ICard, IPlayer } from '../Game/game.types';

export interface IPlayerAreaProps {
    className: string;
    player: IPlayer & { cardsInHand: ICard[] };
}
