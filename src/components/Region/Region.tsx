import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import throttle from 'lodash.throttle';
import { useState } from 'react';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import { IRegionProps } from './Region.types';

import './Region.scss';

export function Region({region}: IRegionProps): JSX.Element {

    return (
        <div className={`region ${region.color}`}>
            {region.values.map(value =>
                <span className="region-value" key={`region-value-${value}`}>
                    {value}
                </span>
            )}
        </div>
    );
}
