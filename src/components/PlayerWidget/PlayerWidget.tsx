import { IPlayerWidgetProps } from './PlayerWidget.types';
import Icon from '../Icon/Icon';

import './PlayerWidget.scss';
import { CardState, TribeName } from '../Game/Game.types';
import { TribeIcon } from '../TribeIcon/TribeIcon';

export function PlayerWidget(props: IPlayerWidgetProps): JSX.Element {
    const {
        className,
        highestGiantToken,
        player,
        tribes
    } = props;

    const cardsInBands = player.cards.filter(card => card.state === CardState.IN_BAND);

    const trollTokensTotal = player.trollTokens.reduce((total, currentValue) => total + currentValue, 0);

    return (
        <div className={`player-widget ${className || ''}`}>
            <span className="username">
                {player.user.username}
            </span>
            <div className="badges">
                <span className="badge total-cards-in-hand">
                    <span className="badge-content">
                        <Icon icon="cards" /> {player.cardsInHand.length}
                    </span>
                </span>
                <span className="badge points">
                    <span className="badge-content">
                        <span>{player.points}</span> <span className="content-label">VP</span>
                    </span>
                </span>
                <span className="badge total-bands">
                    <span className="badge-content">
                        <Icon icon="helmet" /> {cardsInBands.length}
                    </span>
                </span>
            </div>
            <div className="tribe-tokens">
                {tribes.includes(TribeName.GIANTS) ?
                    <span className={`tribe-token giant-token ${highestGiantToken && highestGiantToken === player.giantTokenValue ? 'in-lead' : ''}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.GIANTS, id: null, description: ''}}
                        />
                        <span className="value">
                            {player.giantTokenValue}
                        </span>
                    </span> : null
                }
                {tribes.includes(TribeName.TROLLS) ?
                    <span className="tribe-token troll-tokens">
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.TROLLS, id: null, description: ''}}
                        />
                        {
                            player.trollTokens.map(token =>
                                <span className="troll-token">
                                    {token}
                                </span>
                            )
                        }
                        <span className="value">
                            {trollTokensTotal}
                        </span>
                    </span> : null
                }
                {tribes.includes(TribeName.MERFOLK) ?
                    <span className="tribe-token merfolk-track-score">
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.MERFOLK, id: null, description: ''}}
                        />
                        <span className="value">
                            {player.merfolkTrackScore}
                        </span>
                    </span>
                : null}
                {tribes.includes(TribeName.ORCS) ?
                    <span className="tribe-token orc-board">
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.ORCS, id: null, description: ''}}
                        />
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
        </div>
    );
}
