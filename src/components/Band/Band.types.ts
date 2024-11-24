import { ICard } from '../Game/Game.types';

export interface IBandProps {
    cards: ICard[];
    leaderId: number;
    showBandScore?: boolean;
}
