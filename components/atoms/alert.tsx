import React from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";

interface AlertProps {
    type: "success" | "error" | "info";
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Alert = ({ type, title, children, className = "" }: AlertProps) => {
    const styles = {
        success: {
            bg: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
            icon: <HiCheckCircle className="w-6 h-6 text-purple-500" />,
            title: "text-purple-800 dark:text-purple-300",
        },
        error: {
            bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
            icon: <HiXCircle className="w-6 h-6 text-red-500" />,
            title: "text-red-800 dark:text-red-300",
        },
        info: {
            bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
            icon: <HiInformationCircle className="w-6 h-6 text-blue-500" />,
            title: "text-blue-800 dark:text-blue-300",
        },
    };

    return (
        <div className={`p-4 rounded-lg border ${styles[type].bg} ${className}`}>
            <div className="flex items-start gap-3">
                {styles[type].icon}
                <div>
                    <h4 className={`font-semibold m-0 ${styles[type].title}`}>{title}</h4>
                    <div className="mt-1 text-gray-600 dark:text-gray-400">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
