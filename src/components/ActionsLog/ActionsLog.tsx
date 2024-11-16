import { IActionsLogProps } from './ActionsLog.types';

export function ActionsLog(props: IActionsLogProps): JSX.Element {
    const {
        actionsLog,
    } = props;

    return (
        <div className="actions-log">
            {
                actionsLog.map(log =>
                    <div className="action-log">
                        {log.label}
                    </div>
                )
            }
        </div>
    );
}
