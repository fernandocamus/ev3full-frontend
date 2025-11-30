import React from "react";

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    onClick?: () => void;
    noPadding?: boolean;
}

const Card = ({ children, title, className = "", onClick, noPadding = false }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
        ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow duration-300" : ""} 
        ${className}`}
        >
            {title && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
            )}
            <div className={noPadding ? "" : "p-6"}>
                {children}
            </div>
        </div>
    );
};

export default Card;