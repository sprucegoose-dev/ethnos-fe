import { IPlayerWidgetProps, WidgetModal } from './PlayerWidget.types';
import { CardState, TribeName } from '../Game/Game.types';

import Icon from '../Icon/Icon';
import { TribeIcon } from '../TribeIcon/TribeIcon';

import './PlayerWidget.scss';
import { OrcToken } from '../OrcToken/OrcToken';
import { PlayerIcon } from '../PlayerIcon/PlayerIcon';

export function PlayerWidget(props: IPlayerWidgetProps): JSX.Element {
    const {
        className,
        highestGiantToken,
        isActivePlayer,
        player,
        playerCount,
        tribes,
        onSelectWidgetIcon,
    } = props;

    const cardsInBands = player.cards.filter(card => card.state === CardState.IN_BAND);

    const visibleTokens: {[key: string]: boolean} = {
        [TribeName.GIANTS]: highestGiantToken && highestGiantToken === player.giantTokenValue,
        [TribeName.MERFOLK]: tribes.includes(TribeName.MERFOLK),
        [TribeName.TROLLS]: tribes.includes(TribeName.TROLLS),
        [TribeName.ORCS]: tribes.includes(TribeName.ORCS),
    };

    const getTokenPositions = (): {[key: string]: string} => {
        const positionsByTokenCount: {[key: number]: string[]} = {
            0: [],
            1: ['middle'],
            2: ['middle-left', 'middle-right'],
            3: ['far-middle-left', 'middle', 'far-middle-right'],
            4: ['left', 'middle-left', 'middle-right', 'right'],
        };

        const filteredTokens = Object.keys(visibleTokens).filter(key => visibleTokens[key]);
        const tokenCount = filteredTokens.length;
        const positions = positionsByTokenCount[tokenCount] || [];
        const tokenPositions: {[key: string]: string} = {};

        for (let i = 0; i < positions.length; i++) {
            tokenPositions[filteredTokens[i]] = positions[i];
        }

        return tokenPositions;
    };

    const tokenPositions = getTokenPositions();

    return (
        <div className={`player-widget ${className || ''} player-count-${playerCount} ${isActivePlayer ? 'active-player' : ''}`}>
            <PlayerIcon player={player} />
            <div className="badges">
                <span className="badge total-cards-in-hand">
                    <span className="badge-content">
                        <Icon icon="cards" /> {player.cardsInHand.length}
                    </span>
                </span>
                <span className="badge points">
                    <span className="badge-content">
                        <span>{player.points}</span>
                    </span>
                    <Icon icon="wreath" />
                </span>
                <span className="badge total-bands" onClick={() => onSelectWidgetIcon({ type: WidgetModal.BANDS, player })}>
                    <span className="badge-content">
                        <Icon icon="helmet" /> {cardsInBands.length}
                    </span>
                </span>
            </div>
            <div className="tribe-tokens">
                {visibleTokens[TribeName.GIANTS] ?
                    <span className={`tribe-token giant-token ${tokenPositions[TribeName.GIANTS]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.GIANTS, id: null, description: ''}}
                            onSelect={() => onSelectWidgetIcon({ type: WidgetModal.GIANTS, player })}
                        />
                        <span className="tribe-token-value">
                            {player.giantTokenValue}
                        </span>
                    </span> : null
                }
                {visibleTokens[TribeName.TROLLS] ?
                    <span className={`tribe-token troll-token-container ${tokenPositions[TribeName.TROLLS]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.TROLLS, id: null, description: ''}}
                            onSelect={() => onSelectWidgetIcon({ type: WidgetModal.TROLLS, player })}
                        />
                        <div className="token-elements">
                            {
                                player.trollTokens.map(token =>
                                    <span className="token-element troll-token" key={`troll-token-${token}`}>
                                        {token}
                                    </span>
                                )
                            }
                        </div>
                    </span> : null
                }
                {visibleTokens[TribeName.MERFOLK] ?
                    <span className={`tribe-token merfolk-track-score ${tokenPositions[TribeName.MERFOLK]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.MERFOLK, id: null, description: ''}}
                            onSelect={() => onSelectWidgetIcon({ type: WidgetModal.MERFOLK, player })}
                        />
                        <span className="tribe-token-value">
                            {player.merfolkTrackScore || ''}
                        </span>
                    </span>
                : null}
                {visibleTokens[TribeName.ORCS] ?
                    <span className={`tribe-token orc-board ${tokenPositions[TribeName.ORCS]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.ORCS, id: null, description: ''}}
                            onSelect={() => onSelectWidgetIcon({ type: WidgetModal.ORCS, player })}
                        />
                        <div className="token-elements">
                            {
                                player.orcTokens.map(color =>
                                    <OrcToken color={color} key={`orc-token-${color}`} />
                                )
                            }
                        </div>
                    </span>
                : null}
            </div>
        </div>
    );
}
