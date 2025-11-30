import React, { useRef, useState } from "react";
import { HiCamera, HiX } from "react-icons/hi";

interface ImageUploadProps {
    value?: string;
    onChange: (file: File | null) => void;
    preview?: string;
    className?: string;
}

const ImageUpload = ({ value, onChange, preview, className = "" }: ImageUploadProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>(preview || value || "");
    const [error, setError] = useState<string>(""); 
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError("");

        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Pruebe con otra imagen");
                return;
            }

            onChange(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreviewUrl("");
        setError("");
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div
                className={`
                    relative w-48 h-48 border-2 border-dashed rounded-lg 
                    flex items-center justify-center cursor-pointer 
                    transition-colors overflow-hidden bg-gray-50 dark:bg-gray-700
                    ${error 
                        ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10" 
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                    }
                `}
                onClick={handleClick}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-lg"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className={`flex flex-col items-center ${error ? "text-red-500" : "text-gray-400"}`}>
                        <HiCamera className="w-12 h-12 mb-2" />
                        <span className="text-sm">Subir imagen</span>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="mt-2 text-xs font-semibold text-red-500 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default ImageUpload;