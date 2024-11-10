import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {useDroppable} from '@dnd-kit/core';

import { IPlayerHandProps } from './PlayerHand.types';

import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';
import { calculateCardStyle } from './helpers';

import './PlayerHand.scss';
import { ICard, TribeName } from '../Game/Game.types';
import { ActionType, IPlayBandPayload,  } from '../Game/Action.types';
import { setSelectedCardIds, setSelectedLeaderId } from '../Game/Game.reducer';
import { IRootReducer } from '../../reducers/reducers.types';
import { IGameReducer } from '../Game/Game.reducer.types';
import { DraggableCard } from '../DraggableCard/DraggableCard';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import GameApi from '../../api/Game.api';

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
    const [cardsOrder, setCardsOrder] = useState<UniqueIdentifier[]>(cardsInHand.map(card => `${card.id}`));
    const [dragging, setDragging] = useState<boolean>(false);
    const sensors = useSensors(
        useSensor(PointerSensor),
    );
    const {setNodeRef} = useDroppable({
        id: 'droppable',
    });

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    const dispatchSetSelectedLeaderId = (leaderId: number) => {
        dispatch(setSelectedLeaderId({ leaderId }));
    };

    const dispatchSetSelectedCardIds = (cardIds: number[]) => {
        dispatch(setSelectedCardIds({ cardIds }));
    };

    const assignFallbackLeader = (removedCardId: number) => {
        const fallbackCard = cardsInHand
            .find(card => selectedCardIds.includes(card.id) &&
                card.id !== removedCardId &&
                card.tribe.name !== TribeName.SKELETONS
        );

        if (fallbackCard) {
            dispatchSetSelectedLeaderId(fallbackCard.id);
        }
    };

    const sortCards = (cardA: ICard, cardB: ICard) =>
        cardsOrder.indexOf(`${cardA.id}`) -
        cardsOrder.indexOf(`${cardB.id}`);

    const handleDragEnd = async (event: DragEndEvent) => {
        if (!className.includes('bottom')) {
            return;
        }

        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = cardsOrder.indexOf(active.id);
            const newIndex = cardsOrder.indexOf(over.id);
            const orderedCardIds = arrayMove(cardsOrder, oldIndex, newIndex);

            if (orderedCardIds.filter(Boolean).length) {
                setCardsOrder(orderedCardIds);

                await GameApi.orderCards(player.gameId, orderedCardIds.map(cardId => parseInt(cardId as string)));
            }
        }

        setTimeout(() => {
            setDragging(false);
        }, 200);
    };

    const handleDragStart = (_event: DragEndEvent) => {
        if (!className.includes('bottom')) {
            return;
        }

        setTimeout(() => {
            setDragging(true);
        }, 200);
    };

    const selectCard = (selectedCard: ICard) => {
        if (dragging) {
            return;
        }

        const selectedCardId = selectedCard.id;

        if (selectedCardIds.includes(selectedCardId)) {
            setPauseAnimation(true);

            if (selectedLeaderId === selectedCardId) {
                dispatchSetSelectedLeaderId(null);
                assignFallbackLeader(selectedCardId);
            }

            dispatchSetSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
        } else {
            const onlySkeletonsSelected = selectedCardIds.every(cardId =>
                cardsInHand.find(card => card.id === cardId)?.tribe.name === TribeName.SKELETONS
            );
            const shouldSetAsLeader = (onlySkeletonsSelected || !selectedCardIds.length) &&
                selectedCard.tribe.name !== TribeName.SKELETONS;

            if (shouldSetAsLeader) {
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
    };

    useEffect(() => {
        setCardsOrder(cardsInHand.map(card => `${card.id}`));
    }, [cardsInHand.length, cardsInHand.map(card => card.id).join(',')]);

    const sortedCardsInHand = [...cardsInHand].sort(sortCards);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={cardsOrder}
                strategy={horizontalListSortingStrategy}
                disabled={!className.includes('bottom')}
            >
            <div className={`player-hand ${className || ''}`} ref={setNodeRef}>
                    {sortedCardsInHand.map((card, index) =>
                        <DraggableCard
                            id={`${card.id}`}
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
                                        hoveredCardIndex,
                                        dragging,
                                        playerPosition: 'bottom'
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
                                    }))}
                                    key={`tribe-card-${index}`}
                                    showLogo={true}
                                />
                            }
                        </DraggableCard>
                    )}
            </div>
            </SortableContext>
        </DndContext>
    );
}
