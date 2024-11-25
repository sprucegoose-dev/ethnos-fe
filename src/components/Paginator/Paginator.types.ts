export interface IPaginatorProps {
    currentPage: number;
    onGoToPageCallback: (page: number) => void;
    pages: number[];
}
