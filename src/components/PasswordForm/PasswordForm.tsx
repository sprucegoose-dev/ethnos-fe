import { toast } from 'react-toastify';
import { useState } from 'react';

import GameApi from '../../api/Game.api';
import { IPasswordFormProps } from './PasswordForm.types';

import './PasswordForm.scss';

export function PasswordForm(props: IPasswordFormProps): JSX.Element {
    const [password, setPassword] = useState<string>('');

    const submitPassword = async () => {
        const response = await GameApi.join(props.gameId, password);

        if (response.ok) {
            props.onSuccess();
            toast.success('Joined game successfully');
        } else {
            toast.error('Incorrect password');
        }
    }

    return (
        <div className="password-form">
            <div className="form-title">
                Enter Room Password
            </div>
            <div className="form-control-wrapper">
                    <input
                        className="form-control"
                        name="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder="Password*"
                    />
                </div>
            <button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={submitPassword}
            >
                Join Game
            </button>
        </div>
    );
}
