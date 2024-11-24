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
        cards,
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

    const getCardsByLeader = (leaderId: number) => {
        const leader = cards.find(card => card.id === leaderId);
        const cardsInBand = cards.filter(card => card.id !== leaderId && card.leaderId === leaderId);
        return [leader, ...cardsInBand];
    }

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
                                <Card card={log.card} /> :
                                null
                            }
                            {log.leaderId ?
                                getCardsByLeader(log.leaderId).map(card =>
                                    <Card
                                        key={`card-in-band-${card.id}`}
                                        card={card}
                                    />
                                ) : null
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
