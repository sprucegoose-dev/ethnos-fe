import { TribeName } from '../Game/Game.types';
import { ITrolLTokensProps } from './TrollTokens.types';
import { TribeIcon } from '../TribeIcon/TribeIcon';

import './TrollTokens.scss';

export function TrollTokens(props: ITrolLTokensProps): JSX.Element {
    const { players } = props;

    const tokens = Array.from({ length: 6 }, (_, i) => i);

    const claimedTokens: number[] = [];

    for (const player of players) {
        for (const token of player.trollTokens) {
            claimedTokens.push(token);
        }
    }

    return (
        <div className="troll-tokens-container">
            <div className="title">
                Available troll tokens
            </div>
            <div className="available-troll-tokens">
                {
                    tokens.map((_token, index) =>
                        !claimedTokens.includes(index + 1) ?
                        <div className="token-container" key={`token-container-${index}`}>
                            <TribeIcon
                                tribe={{ name: TribeName.TROLLS, id: null, description: ''}}
                                showTribeName={false}
                            />
                            <div className="token-value">
                                {index + 1}
                            </div>
                        </div>  : null
                    )
                }
            </div>
            {claimedTokens.length ? <div className="title claimed-tokens-title">
                Claimed troll tokens
            </div> : null}
            <div className="claimed-troll-tokens">
                    {
                    players.map((player, index) =>
                        player.trollTokens.length ?
                        <div className="player-container" key={`player-container-${index}`}>
                            <div className="username">
                                {player.user.username}
                            </div>
                            <div className="troll-tokens">
                                {player.trollTokens.map(token =>
                                    <div className="token-container" key={`troll-token-${token}`}>
                                        <TribeIcon

                                            tribe={{ name: TribeName.TROLLS, id: null, description: ''}}
                                            showTribeName={false}
                                        />
                                        <div className="token-value">
                                            {token}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>  : null
                    )
                }
            </div>
        </div>
    );
}
