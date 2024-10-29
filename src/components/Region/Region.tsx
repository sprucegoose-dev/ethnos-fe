import { IRegionProps } from './Region.types';

import './Region.scss';

export function Region({region}: IRegionProps): JSX.Element {

    return (
        <div className={`region ${region.color}`}>
            {region.values.map((value, index) =>
                <span className="region-value" key={`region-${region.color}-${index}-${value}`}>
                    {value}
                </span>
            )}
        </div>
    );
}
