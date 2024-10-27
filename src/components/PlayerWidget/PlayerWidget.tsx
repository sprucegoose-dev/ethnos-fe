import { IPlayerWidgetProps } from './PlayerWidget.types';
import Icon from '../Icon/Icon';

import './PlayerWidget.scss';
import { CardState, TribeName } from '../Game/Game.types';
import { TribeIcon } from '../TribeIcon/TribeIcon';
import { TokenIcon } from '../TokenIcon/TokenIcon';

export function PlayerWidget(props: IPlayerWidgetProps): JSX.Element {
    const {
        className,
        highestGiantToken,
        player,
        tribes
    } = props;

    const cardsInBands = player.cards.filter(card => card.state === CardState.IN_BAND);

    // const trollTokensTotal = player.trollTokens.reduce((total, currentValue) => total + currentValue, 0);

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
        <div className={`player-widget ${className || ''}`}>
            <TokenIcon color={player.color} />
            <span className={`username ${player.color}`}>
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
                        <span>{player.points}</span>
                    </span>
                    <Icon icon="wreath" />
                </span>
                <span className="badge total-bands">
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
                        />
                        <span className="value">
                            {player.giantTokenValue}
                        </span>
                    </span> : null
                }
                {visibleTokens[TribeName.TROLLS] ?
                    <span className={`tribe-token troll-tokens ${tokenPositions[TribeName.TROLLS]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.TROLLS, id: null, description: ''}}
                        />
                        <div className="token-elements">
                            {
                                player.trollTokens.map((token, index) =>
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
                        />
                        <span className="value">
                            {player.merfolkTrackScore}
                        </span>
                    </span>
                : null}
                {visibleTokens[TribeName.ORCS] ?
                    <span className={`tribe-token orc-board ${tokenPositions[TribeName.ORCS]}`}>
                        <TribeIcon
                            showTribeName={false}
                            tribe={{ name: TribeName.ORCS, id: null, description: ''}}
                        />
                        {
                            player.orcTokens.map(color =>
                                <span className="orc-token" key={`orc-token-${color}`}>
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
