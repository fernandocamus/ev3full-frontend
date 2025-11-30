import React from "react";
import { HiCash, HiCreditCard, HiDeviceMobile } from "react-icons/hi";
import Label from "../atoms/label"; 

interface MetodoPagoSelectorProps {
    selected: string;
    onChange: (metodo: string) => void;
    className?: string;
}

const MetodoPagoSelector = ({ selected, onChange, className = "" }: MetodoPagoSelectorProps) => {
    
    const metodos = [
        { value: "EFECTIVO", label: "Efectivo", icon: <HiCash className="w-5 h-5" /> },
        { value: "TARJETA", label: "Tarjeta", icon: <HiCreditCard className="w-5 h-5" /> },
        { value: "TRANSFERENCIA", label: "Transf.", icon: <HiDeviceMobile className="w-5 h-5" /> },
    ];

    return (
        <div className={className}>
            <Label className="mb-2">Método de pago:</Label>
            
            <div className="flex gap-2">
                {metodos.map((metodo) => {
                    const isSelected = selected === metodo.value;
                    return (
                        <button
                            key={metodo.value}
                            type="button"
                            onClick={() => onChange(metodo.value)}
                            className={`
                                flex-1 flex items-center justify-center gap-2
                                py-3 px-2 rounded-lg border transition-all duration-200
                                text-sm font-semibold
                                ${isSelected
                                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }
                            `}
                        >
                            {metodo.icon}
                            <span>{metodo.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MetodoPagoSelector;