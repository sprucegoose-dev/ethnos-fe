import { useState } from 'react';
import throttle from 'lodash.throttle';

import { IPlayerHandProps } from './PlayerHand.types';

import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';
import { calculateCardStyle } from './helpers';

import './PlayerHand.scss';
import { ActionType, IPlayBandPayload } from '../Game/Game.types';

export function PlayerHand(props: IPlayerHandProps): JSX.Element {
    const {
        className,
        player,
        actions = [],
    } = props;
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(null);
    const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
    const [selectedLeaderId, setSelectedLeaderId] = useState<number>(null);
    const [pauseAnimation, setPauseAnimation] = useState<boolean>(false);
    const playBandActions = actions.filter(action => action.type === ActionType.PLAY_BAND) as IPlayBandPayload[];

    const cardsInHand = (player.cardsInHand || []).sort((cardA, cardB) => cardA.index - cardB.index);

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    const selectCard = (selectedCardId: number) => {
        if (selectedCardIds.includes(selectedCardId)) {
            setPauseAnimation(true);

            if (selectedLeaderId === selectedCardId) {
                setSelectedLeaderId(null);
            }

            setSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
        } else {
            if (!selectedCardIds.length) {
                setSelectedLeaderId(selectedCardId);
            }

            setSelectedCardIds([...selectedCardIds, selectedCardId]);
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
                            pauseAnimation={pauseAnimation}
                            selectable={isSelectable(card.id)}
                            selected={selectedCardIds.includes(card.id)}
                            customStyles={calculateCardStyle({
                                index,
                                totalCards: cardsInHand.length,
                                bottomPosition: className.includes('bottom'),
                                hoveredCardIndex
                            })}
                            onClick={selectCard}
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
