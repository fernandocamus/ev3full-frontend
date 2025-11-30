import React from "react";

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    uppercase?: boolean;
    className?: string;
    onKeyPress?: (e: React.KeyboardEvent) => void;
}

const Input = ({
    value,
    onChange,
    placeholder = "",
    type = "text",
    disabled = false,
    uppercase = false,
    className = "",
    onKeyPress,
}: InputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = uppercase ? e.target.value.toUpperCase() : e.target.value;
        onChange(newValue);
    };

    return (
        <input
            type={type}
            value={value}
            onChange={handleChange}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition duration-300 ${className}`}
        />
    );
};

export default Input;
