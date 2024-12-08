import { useState, useEffect } from 'react';
import { IPaginatorProps } from './Paginator.types';

import './Paginator.scss';

const Paginator = ({ currentPage, onGoToPageCallback, pages }: IPaginatorProps) => {
    const [filteredPages, setFilteredPages] = useState([]);
    const [targetPage, setTargetPage] = useState<number>(1);

    useEffect(() => {
        setFilteredPages(getPages());
    }, [currentPage, pages]);

    const getPages = () => {
        const filteredPages = [];
        const prevPages = [];
        const nextPages = [];
        const currentPageIndex = pages.findIndex(page => page === currentPage);

        if (currentPageIndex !== -1) {
            filteredPages.push(currentPage);

            for (let i = currentPageIndex + 1; i < pages.length; i++) {
                if (pages[i]) {
                    nextPages.push(pages[i]);
                }
                if (nextPages.length >= 4) break;
            }

            for (let i = currentPageIndex - 1; i >= 0; i--) {
                if (pages[i]) {
                    prevPages.push(pages[i]);
                }
                if (prevPages.length >= 4) break;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (prevPages[i]) {
                filteredPages.push(prevPages[i]);
            }
            if (nextPages[i]) {
                filteredPages.push(nextPages[i]);
            }
            if (filteredPages.length >= 5) {
                break;
            }
        }

        if (pages.length) {
            if (!filteredPages.includes(1)) {
                filteredPages.push(1);
            }

            if (!filteredPages.includes(pages[pages.length - 1])) {
                filteredPages.push(pages[pages.length - 1]);
            }
        }

        return filteredPages.sort((a, b) => a - b);
    };

    const showGap = (page: number, index: number) => {
        const lastPage = pages[pages.length - 1];
        const isSecondToLast = index === filteredPages.length - 2;

        return (
            (index === 0 && filteredPages[1] - 1 > 1) ||
            (pages.length > 5 && isSecondToLast && lastPage - page > 1)
        );
    };

    const handleTargetPageChange = (page: string) => {
        let parsedPage = parseInt(page, 10);

        if (isNaN(parsedPage)) {
            parsedPage = null;
        }

        setTargetPage(parsedPage);
    }

    const onDirectPageNavigation = () => {
        if (pages.includes(targetPage)) {
            onGoToPageCallback(targetPage);
        }
    };

    return (
        <div className="paginator-container">
            <div className="paginator">
                {filteredPages.map((page, index) => (
                    <span key={`page-${page}`} className="page-wrapper">
                        <span
                            className={`page ${page === currentPage ? 'active' : ''}`}
                            onClick={() => onGoToPageCallback(page)}
                        >
                            {page}
                        </span>
                        {showGap(page, index) && <span className="gap">...</span>}
                    </span>
                ))}
            </div>
            {pages.length > 7 && (
                <div className="direct-navigation">
                    <input
                        className="form-control"
                        value={targetPage ? targetPage : ''}
                        onChange={(e) => handleTargetPageChange(e.target.value)}
                        placeholder="Page"
                        name="targetPage"
                        autoComplete="off"
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') onDirectPageNavigation();
                        }}
                    />
                    <button
                        className="btn btn-primary submit-btn"
                        onClick={onDirectPageNavigation}
                    >
                        Go
                    </button>
                </div>
            )}
        </div>
    );
};

export default Paginator;
