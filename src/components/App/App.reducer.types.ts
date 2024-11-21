export interface IAppReducer {
    audioEnabled: boolean;
    audioMuted: boolean;
};

export interface ISetAudioEnabledAction {
    audioEnabled: boolean;
}

export interface ISetAudioMutedAction {
    audioMuted: boolean;
}
