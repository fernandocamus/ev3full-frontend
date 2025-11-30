import React from "react";
import Label from "../atoms/label";

interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

const FormField = ({ label, error, required = false, children, className = "" }: FormFieldProps) => {
    return (
        <div className={`mb-4 ${className}`}>
            <Label required={required}>{label}</Label>
            {children}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;