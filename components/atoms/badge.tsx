import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "gray" | "yellow" | "blue" | "green";
    className?: string;
}

const Badge = ({ children, variant = "gray", className = "" }: BadgeProps) => {
    
    let variantStyles = "";

    if (variant === "yellow") {
        variantStyles = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    } else if (variant === "blue") {
        variantStyles = "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
    } else if (variant === "green") {
        variantStyles = "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    } else {
        variantStyles = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }

    return (
        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;