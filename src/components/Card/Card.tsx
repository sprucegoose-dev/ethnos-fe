import { useEffect, useState } from 'react';

import { ITribe } from '../../types/game.types';
import TribeApi from '../../api/Tribe.api';
import { ICardProps } from './Card.types';

import './Card.scss';

export function Card({description, image, tribe}: ICardProps): JSX.Element {
    const [tribes, setTribes] = useState<ITribe[]>([]);

    useEffect(() => {
        const getTribes = async () => {
            const response = await TribeApi.getAll();
            setTribes(await response.json());
        };

        getTribes();
    }, [tribes])

    return (
        <div
            className="card"
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className="tribe-name">
                {tribe}
            </div>
            <div className="tribe-description">
                {description}
            </div>
        </div>
    );
}
