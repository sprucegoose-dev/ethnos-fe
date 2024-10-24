import { ICard, IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerAreaProps {
    className: string;
    highestGiantToken: number;
    player: IPlayer & { cardsInHand: ICard[] };
    tribes: TribeName[];
}
