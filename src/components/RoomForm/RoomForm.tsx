import GameApi from '../../api/Game.api';
import { toast } from 'react-toastify';
import { useState } from 'react';

import './RoomForm.scss';

export function RoomForm(): JSX.Element {
    const [password, setPassword] = useState<string>('');
    const [maxPlayers, setMaxPlayers] = useState<number>(4);

    const onSubmit = async () => {
        const response = await GameApi.create({
            password,
            maxPlayers
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Game created successfully');
        } else {
            if (data.code === 401) {
                toast.error('You must be signed in to create a game.');
            } else if (data.code === 400) {
                toast.error(data.message);
            } else {
                toast.error('Error creating game');
            }
        }
    }

    return (
        <div className="room-form">
            <div className="form-title">
                Create a new game
            </div>
            <div className="form-control-wrapper">
                <select
                    className="form-control"
                    name="maxPlayers"
                    value={maxPlayers}
                    onChange={event => setMaxPlayers(Number(event.target.value))}
                >
                {[2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                        {num} Players
                    </option>
                ))}
                </select>
            </div>
            <div className="form-control-wrapper">
                    <input
                        className="form-control"
                        name="password"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder="Password (optional"
                    />
                </div>
            <button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={onSubmit}
            >
                Create Game
            </button>
        </div>
    );
}
