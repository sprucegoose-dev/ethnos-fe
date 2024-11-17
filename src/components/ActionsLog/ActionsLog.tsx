import { IActionsLogProps } from './ActionsLog.types';
import './ActionsLog.scss';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { Card } from '../Card/Card';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export function ActionsLog(props: IActionsLogProps): JSX.Element {
    const {
        actionsLog,
    } = props;

    const [logExpanded, setLogExpanded] = useState<boolean>(false)

    const logs = actionsLog.slice(0, logExpanded ? actionsLog.length : 1);

    const highlightColor = (label: string) => {
        const colors = ['green', 'blue', 'gray', 'orange', 'purple', 'red'];
        const colorRegex = new RegExp(`(?<=\\s)(${colors.join('|')})`, 'gi');

        return label.split(colorRegex).reduce((acc, part, index) => {
            if (colors.includes(part.toLowerCase())) {
                acc.push(<span key={`color-${index}`} className={`region-${part.toLowerCase()}`}>{part}</span>);
            } else {
                acc.push(part);
            }
            return acc;
        }, [] as (string | JSX.Element)[]);
    };

    return (
        <div className={`actions-log-container ${logExpanded ? 'expanded' : ''}`}>
            <div className="logs">
                {
                    logs.map((log, index) =>
                        <div className={`log ${index === logs.length - 1 ? 'is-last': ''}`} key={`log-${log.id}`}>

                            <div className="player-color">
                                <TokenIcon color={log.playerColor} />
                            </div>
                            <div className="action-log-label">
                                {highlightColor(log.label)}
                            </div>
                            {log.card ?
                                <Card
                                    card={log.card}
                                ></Card> :
                                null
                            }
                        </div>
                    )
                }
            </div>
            <div className="actions-log-bg">
            </div>
            <div className="actions-log-toggle" onClick={() => setLogExpanded(!logExpanded)}>
                { logExpanded ?
                     <FontAwesomeIcon className="toggle" icon={faChevronUp}/> :
                     <FontAwesomeIcon className="toggle" icon={faChevronDown}/>
                }
            </div>
        </div>
    );
}
