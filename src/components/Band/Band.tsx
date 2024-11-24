import { useEffect, useRef, useState } from 'react';

import { IBandProps } from './Band.types';
import { Card } from '../Card/Card';
import { getBandScore } from '../Game/helpers';

import './Band.scss';

export function Band(props: IBandProps): JSX.Element {
    const {
        cards,
        leaderId,
        showBandScore,
    } = props;

    const bandRef = useRef<HTMLDivElement | null>(null);
    const [bandHeight, setBandHeight] = useState<number | null>(null);

    const calculateHeight = () => {
        if (bandRef.current && !bandHeight) {
            const height = bandRef.current.offsetHeight;
            const newHeight = Math.floor(height + (cards.length - 1) * (height * 0.25));
            setBandHeight(newHeight);
        }
    };

    useEffect(() => {
        calculateHeight();
    }, [cards]);

    return (
        <div className="band" ref={bandRef} style={{ minHeight: bandHeight !== null ? `${bandHeight}px` : 'none' }}>
            <Card card={cards.find(card => card.id === leaderId)} />
            {cards.map(card => (
                card.id !== leaderId ?
                <Card
                    key={`card-${card.id}`}
                    card={card}
                /> : null
            ))}
            {showBandScore ?
                <div className="band-score">
                    {getBandScore(cards, leaderId)} VP
                </div> : null
            }
        </div>
    );
}
