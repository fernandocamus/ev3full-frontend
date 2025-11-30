import React from "react";
import Input from "../atoms/input";
import Select from "../atoms/select";
import Button from "../atoms/button";
import { HiSearch } from "react-icons/hi";

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: Array<{ value: string; label: string }>;
    onSearch?: () => void;
    placeholder?: string;
    className?: string;
}

const SearchBar = ({
    searchValue,
    onSearchChange,
    filterValue,
    onFilterChange,
    filterOptions,
    onSearch,
    placeholder = "Buscar...",
    className = "",
}: SearchBarProps) => {
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && onSearch) {
            onSearch();
        }
    };

    return (
        <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
            
            <div className="flex-1">
                <Input
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={placeholder}
                    onKeyPress={handleKeyPress}
                />
            </div>

            {filterOptions && onFilterChange && (
                <div className="w-full md:w-48">
                    <Select
                        value={filterValue || ""}
                        onChange={onFilterChange}
                        options={filterOptions}
                    />
                </div>
            )}

            {onSearch && (
                <div className="flex-none">
                    <Button variant="primary" onClick={onSearch} className="w-full md:w-auto h-full">
                        <HiSearch className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;