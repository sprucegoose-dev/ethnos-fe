import { IPlayerWidgetProps } from './PlayerWidget.types';
import Icon from '../Icon/Icon';

import './PlayerWidget.scss';
import { CardState, TribeName } from '../Game/Game.types';

export function PlayerWidget(props: IPlayerWidgetProps): JSX.Element {
    const {
        className,
        highestGiantToken,
        player,
        tribes
    } = props;

    const cardsInBands = player.cards.filter(card => card.state === CardState.IN_BAND);

    return (
        <div className={`player-widget ${className || ''}`}>
            <span className="username">
                {player.user.username}
            </span>
            <span className="badge points">
                <span className="badge-content">
                    {player.points} VP
                </span>
            </span>
            <span className="badge total-cards-in-hand">
                <span className="badge-content">
                    <Icon icon="cards" /> {player.cardsInHand.length}
                </span>
            </span>
             {tribes.includes(TribeName.GIANTS) ?
                <span className={`giant-token ${highestGiantToken && highestGiantToken === player.giantTokenValue ? 'in-lead' : ''}`}>
                    {player.giantTokenValue}
                </span> : null
            }
            <span className="badge total-bands">
                <span className="badge-content">
                    <Icon icon="helmet" /> {cardsInBands.length}
                </span>
            </span>
            {tribes.includes(TribeName.TROLLS) ?
                <span className="troll-tokens">
                    {
                        player.trollTokens.map(token =>
                            <span className="troll-token">
                                {token}
                            </span>
                        )
                    }
                </span> : null
            }
            {tribes.includes(TribeName.MERFOLK) ?
                <span className="merfolk-track-score">
                    {player.merfolkTrackScore}
                </span>
            : null}
            {tribes.includes(TribeName.ORCS) ?
                <span className="orc-board">
                    {
                        player.orcTokens.map(color =>
                            <span className="troll-token">
                                {color}
                            </span>
                        )
                    }
                </span>
            : null}
        </div>
    );
}
