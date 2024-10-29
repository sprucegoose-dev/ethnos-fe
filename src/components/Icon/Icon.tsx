import { useMemo } from 'react';
import { svgPaths } from './svg-paths';
import { IconData, IconProps } from './Icon.types';

import './Icon.scss';

export function Icon({className = '', icon}: IconProps): JSX.Element {
  const toObjectKey = (text: string): string => {
    return text
      .split('-')
      .map((word, index) => (!index ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`))
      .join('');
  };

  const iconData: IconData = useMemo(() => svgPaths[toObjectKey(icon)], [icon]);

  const paths: string[] = iconData.path ? [iconData.path] : iconData.paths || [];

  return (
    <svg
      className={`icon custom-svg-icon ${icon} ${className}`}
      data-name="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox}
    >
      <g transform={iconData.g.transform}>
        {paths.map((path, i) => (
          <path key={`path-${i}`} d={path} transform={iconData.transform} />
        ))}
      </g>
    </svg>
  );
};

export default Icon;
