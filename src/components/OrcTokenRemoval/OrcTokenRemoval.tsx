import { useState } from 'react';
import { toast } from 'react-toastify';

import { IOrcTokenRemovalProps } from './OrcTokenRemoval.types';
import { Color } from '../Game/Shared.types';
import { ORC_BOARD_POINTS } from '../Game/Game.types';
import { ActionType, IRemoveOrcTokensPayload } from '../Game/Action.types';

import GameApi from '../../api/Game.api';

import { OrcToken } from '../OrcToken/OrcToken';

import './OrcTokenRemoval.scss';

export function OrcBoardRemoval({ player, action }: IOrcTokenRemovalProps): JSX.Element {
    const [selectedTokens, setSelectedTokens] = useState<Color[]>(player.orcTokens);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSelectOrcToken = (token: Color) => {
        if (selectedTokens.includes(token)) {
            setSelectedTokens(selectedTokens.filter(selectedToken => selectedToken !== token));
        } else {
            setSelectedTokens([...selectedTokens, token]);
        }
    }

    const submitOrcTokensToRemove = async (tokens: Color[]) => {
        if (submitting) {
            return;
        }

        setSubmitting(true);

        const payload: IRemoveOrcTokensPayload = {
            type: ActionType.REMOVE_ORC_TOKENS,
            nextActionId: action.nextActionId,
            tokens,
        };

        const response = await GameApi.sendAction(player.gameId, payload);

        if (!response.ok) {
            const error = await response.json();
            toast.error(error.message);
        }

        setSubmitting(false);
    }

    return (
        <div className="orc-token-removal-container">
            <div className="instructions">
                The Age has ended.
                <br/>
                Remove tokens from the Orc Hoard Board?
            </div>
            <div className="orc-tokens">
                {
                    player.orcTokens.map(color =>
                        <div
                            key={`orc-token-container-${color}`}
                            className={`orc-token-container ${selectedTokens.includes(color) ? 'selected' : ''}`}
                        >
                            <OrcToken
                                color={color}
                                key={`orc-token-${color}`}
                                onSelect={handleSelectOrcToken}
                            />
                        </div>
                    )
                }
            </div>
            <div className="footer">
                <button className="btn btn-primary btn-3d" onClick={() => submitOrcTokensToRemove([])}>
                    Keep all tokens
                </button>
                <button
                    className={`btn btn-action btn-3d ${selectedTokens.length ? '' : 'btn-disabled'}`}
                    onClick={() => selectedTokens.length ? submitOrcTokensToRemove(selectedTokens) : null}
                >
                   Remove {selectedTokens.length} tokens ({ORC_BOARD_POINTS[selectedTokens.length]} VP)
                </button>
            </div>
        </div>
    );
}
