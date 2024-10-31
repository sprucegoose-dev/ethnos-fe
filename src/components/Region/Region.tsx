import { IRegionProps } from './Region.types';

import './Region.scss';

export function Region(props: IRegionProps): JSX.Element {
    const { onClick, region } = props;

    return (
        <div className={`region ${region.color}`} onClick={() => onClick(region)}>
            <div className="region-values">
                {region.values.map((value, index) =>
                    <span className="region-value" key={`region-${region.color}-${index}-${value}`}>
                        {value}
                    </span>
                )}
            </div>
        </div>
    );
}
