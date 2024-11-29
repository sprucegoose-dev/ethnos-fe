import './LoadingScreen.scss';

export function LoadingScreen(): JSX.Element {
    return (
        <div className="loading-screen">
        <div className="loading-text">
            Loading<span className="dots"></span>
        </div>
    </div>
    );
}
