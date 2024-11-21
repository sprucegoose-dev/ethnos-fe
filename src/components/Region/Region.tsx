import { IRegionProps } from './Region.types';
import { Color } from '../Game/Shared.types';
import { PlayerColor } from '../Game/Game.types';

import blueRegion from '../../assets/regions/blue_region.png';
import blueRegionOutlined from '../../assets/regions/blue_region_outlined.png';
import grayRegion from '../../assets/regions/gray_region.png';
import grayRegionOutlined from '../../assets/regions/gray_region_outlined.png';
import greenRegion from '../../assets/regions/green_region.png';
import greenRegionOutlined from '../../assets/regions/green_region_outlined.png';
import orangeRegion from '../../assets/regions/orange_region.png';
import orangeRegionOutlined from '../../assets/regions/orange_region_outlined.png';
import purpleRegion from '../../assets/regions/purple_region.png';
import purpleRegionOutlined from '../../assets/regions/purple_region_outlined.png';
import redRegion from '../../assets/regions/red_region.png';
import redRegionOutlined from '../../assets/regions/red_region_outlined.png';

import './Region.scss';
import { TokenIcon } from '../TokenIcon/TokenIcon';

const regionImages = {
    [Color.BLUE]: blueRegion,
    [`${Color.BLUE}_outlined`]: blueRegionOutlined,
    [Color.GRAY]: grayRegion,
    [`${Color.GRAY}_outlined`]: grayRegionOutlined,
    [Color.GREEN]: greenRegion,
    [`${Color.GREEN}_outlined`]: greenRegionOutlined,
    [Color.ORANGE]: orangeRegion,
    [`${Color.ORANGE}_outlined`]: orangeRegionOutlined,
    [Color.PURPLE]: purpleRegion,
    [`${Color.PURPLE}_outlined`]: purpleRegionOutlined,
    [Color.RED]: redRegion,
    [`${Color.RED}_outlined`]: redRegionOutlined,
};


export function Region(props: IRegionProps): JSX.Element {
    const { onSelect, region, players } = props;

    const playerColors: { [playerId: number]: PlayerColor } = players.reduce<{ [playerId: number]: PlayerColor }>((acc, player) => {
        acc[player.id] = player.color;
        return acc;
    }, {});

    const playerTokens: { [color: string]: number[] } = region.playerTokens.reduce<{ [color: string]: number[] }>((acc, tokenData) => {
        const color = playerColors[tokenData.playerId];
        acc[color] = Array.from({ length: tokenData.tokens  }, (_, i) => i);
        return acc;
    }, {});

    return (
        <div className={`region ${region.color}`} onClick={() => onSelect(region)}>
            <img
                className="region-img"
                src={regionImages[region.color]}
                alt={`${region.color} region`}
                draggable={false}
            />
            <img
                className="region-img-outlined"
                src={regionImages[`${region.color}_outlined`]}
                alt={`${region.color} region - outlined`}
                draggable={false}
            />
            <div className="region-values">
                {region.values.map((value, index) =>
                    <span className="region-value" key={`region-${region.color}-${index}-${value}`}>
                        {value}
                    </span>
                )}
            </div>
            <div className={`player-tokens-container ${Object.entries(playerTokens).length > 4 ? 'multi-row' : ''}`}>
                {Object.entries(playerTokens).map(([color, tokens], _index) =>
                    <div className="player-tokens" key={`region-${region.id}-player-${color}`}>
                        {tokens.map((_token, index) =>
                            <TokenIcon
                                text={index && index === tokens.length -1 ? tokens.length : null}
                                className="player-token"
                                color={color as PlayerColor}
                                key={`region-${region.id}-player-${color}-${index}`}
                            />
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
