import { ITokenIconProps } from './TokenIcon.types';

import blackToken from '../../assets/token_black.png';
import blueToken from '../../assets/token_blue.png';
import greenToken from '../../assets/token_green.png';
import pinkToken from '../../assets/token_pink.png';
import whiteToken from '../../assets/token_white.png';
import yellowToken from '../../assets/token_yellow.png';
import { PlayerColor } from '../Game/Game.types';

import './TokenIcon.scss';

const tokenIcons = {
    [PlayerColor.BLACK]: blackToken,
    [PlayerColor.BLUE]: blueToken,
    [PlayerColor.GREEN]: greenToken,
    [PlayerColor.PINK]: pinkToken,
    [PlayerColor.WHITE]: whiteToken,
    [PlayerColor.YELLOW]: yellowToken,
};

export function TokenIcon({ color }: ITokenIconProps): JSX.Element {
    return (
        <div className={`token-icon ${color}`}>
            <img
                className="token-img"
                // @ts-ignore
                src={tokenIcons[color]}
                alt={`${color} token`}
            />
        </div>
    );
}
