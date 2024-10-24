
interface SvgG {
    transform: string;
}

interface SvgIconData {
    path?: string;
    paths?: string[];
    viewBox: string;
    transform?: string;
    g: SvgG;
}

export interface SvgPaths {
    [key: string]: SvgIconData;
}

export interface IconData {
    viewBox: string;
    g: {
        transform: string;
    };
    path?: string;
    paths?: string[];
    transform?: string;
}

export interface IconProps {
    icon: string;
}
