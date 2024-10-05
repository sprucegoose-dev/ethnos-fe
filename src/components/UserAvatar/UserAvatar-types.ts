export interface IUserAvatarState {
}

export enum UserAvatarTheme {
    DARK = 'dark',
    LIGHT = 'light',
}

export interface IUserAvatarProps {
    label?: string;
    linkTo?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    theme?: UserAvatarTheme;
}
