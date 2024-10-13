import { useState } from 'react';
import throttle from 'lodash.throttle';

import { CardState } from '../Game/game.types';

import { IPlayerAreaProps } from './PlayerArea.types';
import { Card } from '../Card/Card';

import './PlayerArea.scss';

export function PlayerArea({className, player}: IPlayerAreaProps): JSX.Element {
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    const cardsInHand = [
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
        ...player?.cards.filter(card => card.state === CardState.IN_HAND),
    ];

    const calculateCardStyle = (index: number, totalCards: number) => {
        const middle = Math.floor(totalCards / 2);
        const offset = 2;
        const translateOffsetX = 80;
        const translateOffsetY = 8;
        let rotate
        let translateX;
        let translateY;

        if (index < middle) {
          rotate = (index - middle) * offset;
          translateX = (index - middle) * translateOffsetX;
          translateY = translateOffsetY * (middle - index);
        } else if (index > middle) {
          rotate = (index - middle) * offset;
          translateX = (index - middle) * translateOffsetX;
          translateY = translateOffsetY * (index - middle);
        } else {
          rotate = 0;
          translateX = 0;
          translateY = className.includes('bottom') ? 5 : 15;
        }

        if (hoveredCardIndex === index) {
            translateY = -120;
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
                        <Card
                            key={`tribe-card-${index}`}
                            card={card}
                            customStyles={calculateCardStyle(index, cardsInHand.length)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
