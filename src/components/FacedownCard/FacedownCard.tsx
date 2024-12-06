// import logo from '../../assets/logos/ethnos_logo.webp';

import { IFacedownCardProps } from './FacedownCard.types';

import './FacedownCard.scss';

export function FacedownCard(props: IFacedownCardProps): JSX.Element {
    return (
        <div
            className="card facedown-card"
            style={props.customStyles || {}}
        >
            <div className="card-logo-wrapper">
                {/* {props.showLogo &&
                    <img className="card-logo" src={logo} />
                } */}
            </div>
        </div>
    );
}
