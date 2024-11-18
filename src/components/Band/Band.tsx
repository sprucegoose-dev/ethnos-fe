import { useEffect, useRef, useState } from 'react';

import { IBandProps } from './Band.types';

import { Card } from '../Card/Card';

import './Band.scss';

export function Band(props: IBandProps): JSX.Element {
    const {
        cards,
        leaderId,
    } = props;

    const bandRef = useRef(null);
    const [bandHeight, setBandHeight] = useState<number | null>(null);

    useEffect(() => {
        const calculateHeight = () => {
            if (bandRef.current) {
                const height = bandRef.current.offsetHeight;
                const newHeight = height + (cards.length - 1) * (height * 0.2);
                setBandHeight(newHeight);
            }
        };

        calculateHeight();
    }, [cards]);

    return (
        <div className="band" ref={bandRef} style={{ height: bandHeight ?? 'auto' }}>
            <Card card={cards.find(card => card.id === leaderId)} />
            {cards.map(card => (
                card.id !== leaderId ?
                <Card
                    key={`card-${card.id}`}
                    card={card}
                /> : null
            ))}
        </div>
    );
}
