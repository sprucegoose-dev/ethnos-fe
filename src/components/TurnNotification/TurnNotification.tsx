import { ITurnNotificationProps } from './TurnNotification.types';

import './TurnNotification.scss';
import { TokenIcon } from '../TokenIcon/TokenIcon';

export function TurnNotification(props: ITurnNotificationProps): JSX.Element {
    const {
        className,
        color,
        text,
    } = props;

    const classNames = [
        'turn-notification animated',
        className,
        `${color}`,
    ].join(' ');

    return (
        <div className={classNames}>
            <span className="player-icon-wrapper">
                <TokenIcon color={color} />
            </span>
            <span className="notification-text">
                {text}
            </span>
        </div>
    );
}
