import { IRemoveOrcTokensPayload } from '../Game/Action.types';
import { IPlayer } from '../Game/Game.types';

export interface IOrcTokenRemovalProps {
    player: IPlayer;
    action: IRemoveOrcTokensPayload;
}
