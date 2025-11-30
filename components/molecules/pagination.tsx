import React from "react";
import Button from "../atoms/button";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
    
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={`flex items-center justify-center gap-4 ${className}`}>
            <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                <HiChevronLeft className="w-4 h-4" />
                Anterior
            </Button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
                Página <span className="font-semibold">{currentPage}</span> de{" "}
                <span className="font-semibold">{totalPages}</span>
            </span>

            <Button
                variant="secondary"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Siguiente
                <HiChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default Pagination;