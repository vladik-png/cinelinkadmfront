import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EmployeesPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const EmployeesPagination: React.FC<EmployeesPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [showInputKey, setShowInputKey] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showInputKey) {
            inputRef.current?.focus();
            setInputValue('');
        }
    }, [showInputKey]);

    const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const page = parseInt(inputValue, 10);
            if (!isNaN(page) && page > 0 && page <= totalPages) {
                onPageChange(page);
            }
            setShowInputKey(null);
            setInputValue('');
        }
        if (e.key === 'Escape') {
            setShowInputKey(null);
            setInputValue('');
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers: React.ReactNode[] = [];
        const neighbors = 1;

        const renderEllipsis = (key: string) => (
            <div key={key} className="flex items-center justify-center w-8 h-8 text-[#a2a5b9]">
                {showInputKey === key ? (
                    <input
                        ref={inputRef}
                        type="number"
                        min="1"
                        max={totalPages}
                        className="w-12 text-center bg-[#151521] border border-white/[0.1] rounded-md text-white focus:outline-none focus:border-[#3699ff] py-1 text-sm"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handlePageInput}
                        onBlur={() => {
                            setShowInputKey(null);
                            setInputValue('');
                        }}
                    />
                ) : (
                    <button onClick={() => setShowInputKey(key)} className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors">...</button>
                )}
            </div>
        );

        const renderPageButton = (page: number) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                    ? 'bg-[#3699ff] text-white shadow-lg shadow-[#3699ff]/20'
                    : 'bg-[#1e1e2d] border border-white/[0.05] text-[#a2a5b9] hover:text-white hover:bg-white/[0.05]'
                    }`}
            >
                {page}
            </button>
        );

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(renderPageButton(i));
            }
        } else {
            pageNumbers.push(renderPageButton(1));

            if (currentPage > neighbors + 2) {
                pageNumbers.push(renderEllipsis('start-ellipsis'));
            }

            const startPage = Math.max(2, currentPage - neighbors);
            const endPage = Math.min(totalPages - 1, currentPage + neighbors);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(renderPageButton(i));
            }

            if (currentPage < totalPages - neighbors - 1) {
                pageNumbers.push(renderEllipsis('end-ellipsis'));
            }

            pageNumbers.push(renderPageButton(totalPages));
        }

        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#1e1e2d] border border-white/[0.05] text-[#a2a5b9] hover:text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16} />
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#1e1e2d] border border-white/[0.05] text-[#a2a5b9] hover:text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};