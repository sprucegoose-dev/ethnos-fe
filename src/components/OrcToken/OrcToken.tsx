import { Color } from '../Game/Shared.types';
import { IOrcTokenProps } from './OrcToken.types';

import orcTokenGreen from '../../assets/orc_tokens/orc_token_green.webp';
import orcTokenGray from '../../assets/orc_tokens/orc_token_gray.webp';
import orcTokenPurple from '../../assets/orc_tokens/orc_token_purple.webp';
import orcTokenOrange from '../../assets/orc_tokens/orc_token_orange.webp';
import orcTokenRed from '../../assets/orc_tokens/orc_token_red.webp';
import orcTokenBlue from '../../assets/orc_tokens/orc_token_blue.webp';

import './OrcToken.scss';

const orcTokens = {
    [Color.GREEN]: orcTokenGreen,
    [Color.GRAY]: orcTokenGray,
    [Color.BLUE]: orcTokenBlue,
    [Color.ORANGE]: orcTokenOrange,
    [Color.RED]: orcTokenRed,
    [Color.PURPLE]: orcTokenPurple,
};

export function OrcToken({ className = '', color, onSelect }: IOrcTokenProps): JSX.Element {
    return (
        <div className={`token-element orc-token ${color} ${className}`}>
            <img
                className={`orc-token-img ${color}`}
                src={orcTokens[color]}
                alt={`orc token ${color}`}
                onClick={() => onSelect ? onSelect(color) : null}
            />
        </div>
    );
}
