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
import { toast } from 'react-toastify';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';

import { IPlayerHandProps } from './PlayerHand.types';

import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';
import { calculateCardStyle } from './helpers';

import './PlayerHand.scss';
import { ICard, TribeName } from '../Game/Game.types';
import { ActionType, IKeepCardsPayload, IPlayBandPayload,  } from '../Game/Action.types';
import {
    setSelectedCardIds,
    setSelectedCardIdsToKeep,
    setSelectedLeaderId
} from '../Game/Game.reducer';
import { IRootReducer } from '../../reducers/reducers.types';
import { IGameReducer } from '../Game/Game.reducer.types';
import { DraggableCard } from '../DraggableCard/DraggableCard';
import GameApi from '../../api/Game.api';

export function PlayerHand(props: IPlayerHandProps): JSX.Element {
    const dispatch = useDispatch();
    const {
        selectedCardIds,
        selectedCardIdsToKeep,
        selectedLeaderId,
    } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;
    const {
        className,
        player,
        actions = [],
        showCards
    } = props;
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(null);
    const playBandActions = actions.filter(action => action.type === ActionType.PLAY_BAND) as IPlayBandPayload[];
    const cardsInHand = (player.cardsInHand || []).sort((cardA, cardB) => cardA.index - cardB.index);
    const [cardsOrder, setCardsOrder] = useState<UniqueIdentifier[]>(cardsInHand.map(card => `${card.id}`));
    const keepCardsAction = actions.find(action => action.type === ActionType.KEEP_CARDS) as IKeepCardsPayload;
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

    const assignFallbackLeader = (removedCardId: number): number => {
        const fallbackCard = cardsInHand
            .find(card => selectedCardIds.includes(card.id) &&
                card.id !== removedCardId &&
                card.tribe.name !== TribeName.SKELETONS
        );

        if (fallbackCard) {
            dispatchSetSelectedLeaderId(fallbackCard.id);
            return fallbackCard.id;
        }
    };

    const sortCards = (cardA: ICard, cardB: ICard) =>
        cardsOrder.indexOf(`${cardA.id}`) -
        cardsOrder.indexOf(`${cardB.id}`);

    const handleDragEnd = async (event: DragEndEvent) => {
        if (!className.includes('bottom')) {
            return;
        }

        setHoveredCardIndex(null);

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
        if (dragging || !actions.length) {
            return;
        }

        const selectedCardId = selectedCard.id;
        let fallbackLeaderId = null;

        if (selectedCardIds.includes(selectedCardId)) {
            if (selectedLeaderId === selectedCardId) {
                dispatchSetSelectedLeaderId(null);
                fallbackLeaderId = assignFallbackLeader(selectedCardId);

                if (fallbackLeaderId) {
                    dispatchSetSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
                } else {
                    dispatchSetSelectedCardIds([]);
                }
            } else {
                dispatchSetSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
            }
        } else {
            if (!isSelectable(selectedCard.id)) {
                if (selectedCardIds.length) {
                    toast.info("This card can't be added to the band");
                } else {
                    toast.info("This card can't be the leader of a band");
                }
                return;
            }

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
    };

    const selectCardToKeep = (selectedCard: ICard) => {
        if (!keepCardsAction) {
            return;
        }

        const selectedCardId = selectedCard.id;

        if (selectedCardIdsToKeep.includes(selectedCardId)) {
            dispatch(setSelectedCardIdsToKeep({ cardIds: selectedCardIdsToKeep.filter((cardId) => cardId !== selectedCardId) }))
        } else {

            if (selectedCardIdsToKeep.length === keepCardsAction.value) {
                toast.info(`You cannot select more than ${keepCardsAction.value} cards`);
                return;
            }

            dispatch(setSelectedCardIdsToKeep({ cardIds: [...selectedCardIdsToKeep, selectedCardId] }));
        }
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

    const setCardsOrderDependency = cardsInHand.length;
    const cardsInHandString = cardsInHand.map(card => card.id).join(',');

    useEffect(() => {
        setCardsOrder(cardsInHand.map(card => `${card.id}`));
    }, [setCardsOrderDependency, cardsInHandString, cardsInHand]);

    const sortedCardsInHand = [...cardsInHand].sort(sortCards);

    return (
        <div className={`player-hand ${className || ''}`} ref={setNodeRef}>
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
                    {sortedCardsInHand.map((card, index) =>
                        <DraggableCard
                            id={`${card.id}`}
                            key={`tribe-card-${index}`}
                            className={`card-wrapper ${hoveredCardIndex === index ? 'hover' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {showCards ?
                                <Card
                                    card={card}
                                    customStyles={calculateCardStyle({
                                        index,
                                        totalCards: cardsInHand.length,
                                        hoveredCardIndex,
                                        dragging,
                                        playerPosition: 'bottom',
                                        selected: selectedCardIds.includes(card.id)
                                    })}
                                    isLeader={selectedLeaderId && selectedLeaderId === card.id}
                                    selectable={selectedCardIds.length && isSelectable(card.id)}
                                    selected={selectedCardIds.includes(card.id)}
                                    keep={selectedCardIdsToKeep.includes(card.id)}
                                    onSelect={keepCardsAction ? selectCardToKeep : selectCard}
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
                </SortableContext>
            </DndContext>
        </div>
    );
}
