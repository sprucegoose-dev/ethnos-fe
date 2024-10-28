import { useState } from 'react';
import throttle from 'lodash.throttle';

import { IPlayerHandProps } from './PlayerHand.types';

import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';
import { calculateCardStyle } from './helpers';

import './PlayerHand.scss';

export function PlayerHand(props: IPlayerHandProps): JSX.Element {
    const {
        className,
        player,
    } = props;
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(null);
    const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);

    const cardsInHand = (player.cardsInHand || []).sort((cardA, cardB) => cardA.index - cardB.index);

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    const selectCard = (selectedCardId: number) => {

        if (selectedCardIds.includes(selectedCardId)) {
            setSelectedCardIds(selectedCardIds.filter((cardId) => cardId !== selectedCardId));
        } else {
            setSelectedCardIds([...selectedCardIds, selectedCardId]);
        }
    };

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
