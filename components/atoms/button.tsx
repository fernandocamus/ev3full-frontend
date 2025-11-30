import React from "react";
import { FaSpinner } from "react-icons/fa"; 

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    loading = false,
    fullWidth = false,
    className = "",
}: ButtonProps) => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        >
            {loading && (
                <FaSpinner className="animate-spin h-5 w-5" />
            )}
            
            {children}
        </button>
    );
};

export default Button;