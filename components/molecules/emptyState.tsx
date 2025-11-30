import React from "react";
import Button from "../atoms/button";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const EmptyState = ({ icon, title, description, action, className = "" }: EmptyStateProps) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="flex justify-center mb-4 text-gray-300 dark:text-gray-600">
                <div className="text-5xl">
                    {icon}
                </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            
            {description && (
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            
            {action && (
                <div className="flex justify-center">
                    <Button onClick={action.onClick} variant="primary">
                        {action.label}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;