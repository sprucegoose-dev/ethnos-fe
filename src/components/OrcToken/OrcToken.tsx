import { Color } from '../Game/Shared.types';
import { IOrcTokenProps } from './OrcToken.types';

import orcTokenGreen from '../../assets/orc_tokens/orc_token_green.png';
import orcTokenGray from '../../assets/orc_tokens/orc_token_gray.png';
import orcTokenPurple from '../../assets/orc_tokens/orc_token_purple.png';
import orcTokenOrange from '../../assets/orc_tokens/orc_token_orange.png';
import orcTokenRed from '../../assets/orc_tokens/orc_token_red.png';
import orcTokenBlue from '../../assets/orc_tokens/orc_token_blue.png';

import './OrcToken.scss';

const orcTokens = {
    [Color.GREEN]: orcTokenGreen,
    [Color.GRAY]: orcTokenGray,
    [Color.BLUE]: orcTokenBlue,
    [Color.ORANGE]: orcTokenOrange,
    [Color.RED]: orcTokenRed,
    [Color.PURPLE]: orcTokenPurple,
};

export function OrcToken({ className = '', color }: IOrcTokenProps): JSX.Element {
    return (
        <span className={`token-element orc-token ${color} ${className}`}>
            <img
                className={`orc-token-img ${color}`}
                src={orcTokens[color]}
                alt={`orc token ${color}`}
            />
        </span>
    );
}
