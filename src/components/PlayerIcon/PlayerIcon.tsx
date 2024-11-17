import { IPlayerIconProps } from './PlayerIcon.types';

import { TokenIcon } from '../TokenIcon/TokenIcon';

import './PlayerIcon.scss';

export function PlayerIcon(props: IPlayerIconProps): JSX.Element {
    const {
        player,
    } = props;

    return (
        <div className="player-icon">
            <span className={`username ${player.color} username-backdrop`}>
                {player.user.username}
            </span>
            <TokenIcon color={player.color} />
            <span className={`username ${player.color}`}>
                {player.user.username}
            </span>
        </div>
    );
}
