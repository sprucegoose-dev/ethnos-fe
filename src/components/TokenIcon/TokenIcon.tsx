import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { ITokenIconProps } from './TokenIcon.types';

import blackToken from '../../assets/tokens/token_black.webp';
import blueToken from '../../assets/tokens/token_blue.webp';
import greenToken from '../../assets/tokens/token_green.webp';
import pinkToken from '../../assets/tokens/token_pink.webp';
import whiteToken from '../../assets/tokens/token_white.webp';
import yellowToken from '../../assets/tokens/token_yellow.webp';
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

export function TokenIcon(props: ITokenIconProps): JSX.Element {
    const {
        className,
        color,
        disabled,
        onSelect,
        selected,
        text
    } = props;

    return (
        <div className={`token-icon ${color} ${disabled ? 'disabled' : ''} ${className ?? ''}`}>
            <img
                className={`token-img ${onSelect && !disabled ? 'selectable' : ''} ${disabled ? 'disabled' : ''}`}
                // @ts-ignore
                src={tokenIcons[color]}
                alt={`${color} token`}
                onClick={() => onSelect ? onSelect(color) : null}
                draggable={false}
            />
            {selected ?
                <FontAwesomeIcon className="selected-icon" icon={faCheckCircle} /> :
                null
            }
            {disabled ?
                <span className="disabled-icon"></span> :
                null
            }
            {
                text ?
                    <span className="token-text">
                        {text}
                    </span>
                    : null
            }
        </div>
    );
}
