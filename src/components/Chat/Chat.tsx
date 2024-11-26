import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { IChatMessagePayload, IChatProps } from './Chat.types';
import ChatApi from '../../api/Chat.api';
import { socket } from '../../socket';
import './Chat.scss';

export function Chat({ gameId, players }: IChatProps): JSX.Element {
    const [message, setMessage] = useState('');
    const [textareaRows, setTextareaRows] = useState(1);
    const messagesRef = useRef(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [messages, setMessages] = useState<IChatMessagePayload[]>([]);
    const [readMessagesCount, setReadMessagesCount] = useState<number>(0);
    const [showChat, setShowChat] = useState<boolean>(false);

    const unreadMessagesCount = messages.length - readMessagesCount;

    useEffect(() => {
        scrollToBottom();

        const updateChatMessages = (messages: IChatMessagePayload[]) => {
            setMessages(messages);

            if (expanded) {
                setReadMessagesCount(messages.length);
            }
        }

        const getMessages = async () => {
            const response = await ChatApi.getMessages(gameId);

            if (response.ok) {
                const messages = await response.json();
                setMessages(messages)
                setReadMessagesCount(messages.length);
            }
        }

        socket.on('onUpdateChat', updateChatMessages);

        getMessages();

        return () => {
            socket.off('onUpdateChat', updateChatMessages);
        }
    }, [expanded, readMessagesCount]);

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    };

    const toggle = async () => {
        const newExpandedState = !expanded;
        setExpanded(newExpandedState);

        if (newExpandedState) {
            setReadMessagesCount(messages.length);
            scrollToBottom();
        }
    };

    const onSubmit = async () => {
        if (message.trim()) {
            const originalMsg = message;
            const originalTextAreaRows = textareaRows;

            setMessage('');
            setTextareaRows(1);

            const response = await ChatApi.sendMessage(gameId, message);

            if (!response.ok) {
                setMessage(originalMsg);
                setTextareaRows(originalTextAreaRows);
                const error = await response.json();
                toast.error(error);
            }
        }
    };

    const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {

            if (event.shiftKey) {
                return;
            }

            event.preventDefault();
            onSubmit();
        }
    };

    const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value;
        setMessage(newMessage);

        let chars = newMessage.length;
        const charsPerRow = 42;
        const lineBreaks = newMessage.match(/\r|\n/g) || [];

        chars += lineBreaks.length * charsPerRow;

        let textAreaRows;

        if (chars < charsPerRow) {
            textAreaRows = 1;
        } else if (chars >= charsPerRow && chars <= charsPerRow * 2) {
            textAreaRows = 2;
        } else if (chars >= charsPerRow * 2 && chars <= charsPerRow * 3) {
            textAreaRows = 3;
        } else {
            textAreaRows = 4;
        }

        setTextareaRows(textAreaRows);
    };

    const getLabelColor = (username: string) => {
        return players.find(player => player.user.username === username).color;
    };

    return (
        <div className={`chat ${expanded ? 'expanded' : ''}`}>
            <div className="chat-title" onClick={toggle}>
                {expanded ?
                    <div className="title-text">
                        <span className="chat-toggle">
                            <FontAwesomeIcon
                                className="toggle-icon expand-icon"
                                icon={expanded ? faChevronDown : faChevronUp}
                            />
                        </span> Chat
                    </div> :
                    <button className="btn btn-outline btn-round toggle-chat-btn" onClick={() => setShowChat(!showChat)}>
                        <FontAwesomeIcon icon={faComment} />
                    </button>
                }
                {!expanded && unreadMessagesCount > 0 && (
                    <span className="unread-messages-count">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                )}
            </div>
            <div className="chat-inner-wrapper">
                <div className="messages" ref={messagesRef}>
                    {messages.map((message) => (
                        <div
                            className="message-wrapper"
                            key={`message-${message.id}`}
                        >
                            <span className="username">
                                <span
                                    className={`label ${getLabelColor(
                                        message.username
                                    )}`}
                                >
                                    {message.username}
                                </span>
                                :
                            </span>
                            <span className="message">
                                {message.message}
                            </span>
                        </div>
                    ))}
                </div>
                <form
                    className="chat-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <textarea
                        className="form-control chat-input"
                        value={message}
                        onChange={onInputChange}
                        onKeyDown={onEnter}
                        placeholder="Send a message"
                        name="message"
                        rows={textareaRows}
                        autoComplete="off"
                    />
                    {message.length > 0 ?
                        <button
                            type="button"
                            className="btn btn-primary submit-btn"
                            onClick={onSubmit}
                        >
                            Send
                        </button>
                    : null}
                </form>
            </div>
        </div>
    );
};
