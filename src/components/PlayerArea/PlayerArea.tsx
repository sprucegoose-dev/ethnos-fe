import { useState } from 'react';
import throttle from 'lodash.throttle';

import { CardState } from '../Game/game.types';

import { IPlayerAreaProps } from './PlayerArea.types';
import { Card } from '../Card/Card';
import { FacedownCard } from '../FacedownCard/FacedownCard';

import './PlayerArea.scss';

export function PlayerArea({className, player}: IPlayerAreaProps): JSX.Element {
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    const cardsInHand = [
        ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
        // ...player.cards.filter(card => card.state === CardState.IN_HAND),
    ];

    const calculateCardStyle = (index: number, totalCards: number) => {
        let middle = (totalCards / 2);
        middle = middle % 2 ? middle - .5 : middle;
        const offset = 2;
        const translateOffsetX = className.includes('bottom') ? 80 : 20;
        const translateOffsetY = className.includes('bottom') ? 8 : 6;
        let rotate = 0;
        let translateX = 0;
        let translateY = className.includes('bottom') ? 5 : 15;

        if (index < middle) {
          rotate = (index - middle) * offset;
          translateX = (index - middle) * translateOffsetX;
          translateY = translateOffsetY * (middle - index);
        } else if (index > middle) {
          rotate = (index - middle) * offset;
          translateX = (index - middle) * translateOffsetX;
          translateY = translateOffsetY * (index - middle);
        }

        if (hoveredCardIndex === index) {
            translateY = -144;
            rotate = 0;
        }

        return {
          transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
        };
    };

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    return (
        <div className={`player-area ${className || ''}`}>
            <div className="bands">

            </div>
            <div className="player-hand">
                <div className="cards">
                    {cardsInHand.map((card, index) =>
                        className.includes('bottom') ?
                            <Card
                                key={`tribe-card-${index}`}
                                card={card}
                                customStyles={calculateCardStyle(index, cardsInHand.length)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            /> :
                            <FacedownCard
                                customStyles={calculateCardStyle(index, cardsInHand.length)}
                                key={`tribe-card-${index}`}
                                showLogo={true}
                            />
                    )}
                </div>
            </div>
        </div>
    );
}
