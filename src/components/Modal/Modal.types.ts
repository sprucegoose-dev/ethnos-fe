export interface IModalProps {
    children: React.ReactNode;
    modalClass?: string;
    onClose: () => void;
    onMinimize?: () => void;
    minimized?: boolean;
}
