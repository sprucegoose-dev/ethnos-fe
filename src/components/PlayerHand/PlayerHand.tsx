import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';

import { IPlayerHandProps } from './PlayerHand.types';

import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';
import { calculateCardStyle } from './helpers';

import './PlayerHand.scss';
import { TribeName } from '../Game/Game.types';
import { ActionType, IPlayBandPayload,  } from '../Game/Action.types';
import { setSelectedCardIds, setSelectedLeaderId } from '../Game/Game.reducer';
import { IRootReducer } from '../../reducers/reducers.types';
import { IGameReducer } from '../Game/Game.reducer.types';

export function PlayerHand(props: IPlayerHandProps): JSX.Element {
    const dispatch = useDispatch();
    const {
        selectedCardIds,
        selectedLeaderId,
    } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;
    const {
        className,
        player,
        actions = [],
    } = props;
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(null);
    const [pauseAnimation, setPauseAnimation] = useState<boolean>(false);
    const playBandActions = actions.filter(action => action.type === ActionType.PLAY_BAND) as IPlayBandPayload[];
    const cardsInHand = (player.cardsInHand || []).sort((cardA, cardB) => cardA.index - cardB.index);

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    const dispatchSetSelectedLeaderId = (leaderId: number) => {
        dispatch(setSelectedLeaderId({ leaderId }));
    }

    const dispatchSetSelectedCardIds = (cardIds: number[]) => {
        dispatch(setSelectedCardIds({ cardIds }));
    }

    const assignFallbackLeader = (removedCardId: number) => {
        const fallbackCard = cardsInHand
            .find(card => selectedCardIds.includes(card.id) &&
                card.id !== removedCardId &&
                card.tribe.name !== TribeName.SKELETONS
        );

        if (fallbackCard) {
            dispatchSetSelectedLeaderId(fallbackCard.id);
        }
    }

    const selectCard = (selectedCardId: number) => {
        if (selectedCardIds.includes(selectedCardId)) {
            setPauseAnimation(true);

            if (selectedLeaderId === selectedCardId) {
                dispatchSetSelectedLeaderId(null);
                assignFallbackLeader(selectedCardId);
            }

            dispatchSetSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
        } else {
            if (!selectedCardIds.length) {
                dispatchSetSelectedLeaderId(selectedCardId);
            }

            dispatchSetSelectedCardIds([...selectedCardIds, selectedCardId]);
        }

        setTimeout(() => {
            setPauseAnimation(false);
        }, 0);
    };

    const isSelectable = (cardId: number): boolean => {
        if (selectedCardIds.includes(cardId)) {
            return false;
        }

        if (!selectedCardIds.length) {
            return !!playBandActions.find(action => action.leaderId === cardId);
        }

        return !!playBandActions.find(action =>
            action.cardIds.includes(cardId) &&
            selectedCardIds.every(id => action.cardIds.includes(id))
        );
    }

    return (
        <div className={`player-hand ${className || ''}`}>
            {cardsInHand.map((card, index) =>
                <div
                    key={`tribe-card-${index}`}
                    className={`card-wrapper ${hoveredCardIndex === index ? 'hover' : ''}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    {className.includes('bottom') ?
                        <Card
                            card={card}
                            customStyles={calculateCardStyle({
                                index,
                                totalCards: cardsInHand.length,
                                bottomPosition: className.includes('bottom'),
                                hoveredCardIndex
                            })}
                            isLeader={selectedLeaderId && selectedLeaderId === card.id}
                            pauseAnimation={pauseAnimation}
                            selectable={selectedCardIds.length && isSelectable(card.id)}
                            selected={selectedCardIds.includes(card.id)}
                            onSelect={selectCard}
                            onSetLeader={dispatchSetSelectedLeaderId}
                        /> :
                        <FacedownCard
                            customStyles={calculateCardStyle(({
                                index,
                                totalCards: cardsInHand.length,
                                bottomPosition: className.includes('bottom'),
                            }))}
                            key={`tribe-card-${index}`}
                            showLogo={true}
                        />
                    }
                </div>
            )}
        </div>
    );
}
