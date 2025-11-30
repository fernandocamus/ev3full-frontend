import React from "react";
import Card from "../atoms/card";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    variant?: "green" | "blue" | "purple" | "yellow" | "red";
    className?: string;
}

const VARIANTS = {
    green: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    red: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
};

const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    variant = "purple",
    className = "",
}: StatCardProps) => {
    return (
        <Card className={className}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${VARIANTS[variant]}`}>
                    <div className="text-xl">
                        {icon}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;