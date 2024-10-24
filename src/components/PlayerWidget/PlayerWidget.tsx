import { IPlayerWidgetProps } from './PlayerWidget.types';
import Icon from '../Icon/Icon';

import './PlayerWidget.scss';

export function PlayerWidget({className, player}: IPlayerWidgetProps): JSX.Element {

    return (
        <div className={`player-widget ${className || ''}`}>
            <span className="username">
                {player.user.username}
            </span>
            <span className="points">
                {player.points}VP
            </span>
            <span className="cards-in-hand">
                <Icon icon="cards" /> {player.cardsInHand.length}
            </span>
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
