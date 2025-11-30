import React from "react";

interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    className?: string;
}

const Label = ({ children, htmlFor, required = false, className = "" }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-semibold text-black dark:text-gray-300 mb-2 ${className}`}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

export default Label;