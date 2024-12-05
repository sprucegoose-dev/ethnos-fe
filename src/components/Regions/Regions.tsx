import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';

import GameApi from '../../api/Game.api';
import {
    clearSelections,
} from '../Game/Game.reducer';

import {
    TribeName,
} from '../Game/Game.types';
import { IRegion, regionOrder } from '../Region/Region.types';
import { IRegionsProps } from './Regions.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IGameReducer } from '../Game/Game.reducer.types';

import {
    ActionType,
    IActionPayload,
    IAddFreeTokenPayload,
    IKeepCardsPayload,
    IPlayBandPayload,
} from '../Game/Action.types';

import { Region } from '../Region/Region';
import './Regions.scss';

export function Regions(props: IRegionsProps): JSX.Element {
    const {
        actions,
        cardsInHand,
        currentPlayer,
        gameState
    } = props;
    const {
        selectedCardIds,
        selectedCardIdsToKeep,
        selectedLeaderId,
    } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;
    const keepCardsAction = actions.find(action => action.type === ActionType.KEEP_CARDS) as IKeepCardsPayload;

    const dispatch = useDispatch();

    const onSelectRegion = throttle(async (region?: IRegion) => {
        let payload: IActionPayload;

        if (gameState.activePlayerId !== currentPlayer.id) {
            toast.info('Please wait for your turn');
            return;
        }

        const addFreeTokenAction = actions.find(action =>
            action.type === ActionType.ADD_FREE_TOKEN
        ) as IAddFreeTokenPayload;

        if (addFreeTokenAction) {
            payload = {
                type: ActionType.ADD_FREE_TOKEN,
                nextActionId: addFreeTokenAction.nextActionId,
                regionColor: region?.color
            };
        } else {

            if (!selectedCardIds.length) {
                toast.info('Please first select cards in your hand');
                return;
            }

            if (!selectedLeaderId) {
                toast.info('Please first select a leader for your band');
                return;
            }

            const leader = cardsInHand.find(card => card.id === selectedLeaderId);

            if (region && leader.tribe.name !== TribeName.WINGFOLK && leader.color !== region.color) {
                toast.info('Leader color must match the region color');
                return;
            }

            const playBandAction = actions.find(action =>
                action.type === ActionType.PLAY_BAND &&
                action.nextActionId
            ) as IPlayBandPayload;

            payload = {
                type: ActionType.PLAY_BAND,
                nextActionId: playBandAction?.nextActionId,
                regionColor: region?.color,
                leaderId: selectedLeaderId,
                cardIds: selectedCardIds,
            };
        }

        const response = await GameApi.sendAction(gameState.id, payload);

        if (response.ok) {
            dispatch(clearSelections());
        }
    }, 500);

    const submitKeepCardsAction = async () => {
        const payload: IKeepCardsPayload = {
            type: ActionType.KEEP_CARDS,
            nextActionId: keepCardsAction.nextActionId,
            cardIds: selectedCardIdsToKeep,
        };

        const response = await GameApi.sendAction(gameState.id, payload);

        if (response.ok) {
            dispatch(clearSelections());
        }
    };

    const sortedRegions = gameState.regions.sort((regionA, regionB) =>
        regionOrder[regionA.color] - regionOrder[regionB.color]
    );

    const selectedLeaderIsHalfling = selectedLeaderId &&
        cardsInHand.find(card =>
            card.id === selectedLeaderId
        )?.tribe.name === TribeName.HALFLINGS;

    return (
        <div className="regions-container">
            <div className="regions-row">
                {sortedRegions.slice(0, 3).map(region =>
                    <Region
                        key={`region-${region.color}`}
                        region={region}
                        onSelect={onSelectRegion}
                        players={gameState.players}
                    />
                )}
            </div>
            <div className="regions-row">
                {sortedRegions.slice(3).map(region =>
                    <Region
                        key={`region-${region.color}`}
                        region={region}
                        onSelect={onSelectRegion}
                        players={gameState.players}
                    />
                )}
            </div>
            {
                selectedLeaderIsHalfling ?
                <div className="play-band-notification" onClick={() => onSelectRegion()}>
                    Play Band
                </div> : null
            }
            {
                keepCardsAction ?
                <div className="keep-cards-notification">
                    {
                        selectedCardIdsToKeep.length === keepCardsAction.value ?
                        <button
                            className="btn btn-outline btn-3d"
                            onClick={() => submitKeepCardsAction()}
                        >
                                Keep Selected Cards
                        </button>
                        : `Choose ${keepCardsAction.value} cards to keep`
                    }

                </div>  : null
            }
        </div>
    );
}
