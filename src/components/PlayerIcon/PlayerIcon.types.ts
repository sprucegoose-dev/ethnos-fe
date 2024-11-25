import { IPlayer } from '../Game/Game.types';

export interface IPlayerIconProps {
    player: Pick<IPlayer, 'color' | 'user'>;
}
