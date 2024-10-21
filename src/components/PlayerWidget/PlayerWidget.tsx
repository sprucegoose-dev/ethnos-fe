import { IPlayerWidgetProps } from './PlayerWidget.types';

import './PlayerWidget.scss';

export function PlayerWidget({className, player}: IPlayerWidgetProps): JSX.Element {

    return (
        <div className={`player-widget ${className || ''}`}>
            {player.user.username}
            {/* cards in hand count */}
            {/* number of bands */}
            {/* troll token total value */}
            {/* merfolk track progress */}
            {/* orc board tokens */}
            {/* giant token score (if in lead) */}
            {/* victory points count */}
        </div>
    );
}
