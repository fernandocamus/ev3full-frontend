import React, { useState } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Alert from "../atoms/alert";
import FormField from "../molecules/formField";
import ImageUpload from "../molecules/imageUpload";
import Input from "../atoms/input";
import Select from "../atoms/select";
import { HiInformationCircle, HiExclamationCircle } from "react-icons/hi";

interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    iva: number;
    stock_actual: number;
    categoriaId: number;
    ruta_imagen?: string;
}

interface ProductoFormProps {
    producto?: Producto;
    onSubmit: (data: FormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    className?: string;
}

const ProductoForm = ({
    producto,
    onSubmit,
    onCancel,
    loading = false,
    className = "",
}: ProductoFormProps) => {
    const [nombre, setNombre] = useState(producto?.nombre || "");
    const [precioBase, setPrecioBase] = useState(producto?.precio_base.toString() || "");    const [iva, setIva] = useState(producto?.iva.toString() || "19");
    const [stockActual, setStockActual] = useState(producto?.stock_actual.toString() || "");
    const [imagen, setImagen] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [categoriaId, setCategoriaId] = useState(producto?.categoriaId?.toString() || "");

    const categorias = [
    { value: "1", label: "Electrónica" },
    { value: "2", label: "Ropa" },
    { value: "3", label: "Alimentos" },
    { value: "4", label: "Hogar" },
];


    const calcularPrecioConIva = () => {
        const precio = parseFloat(precioBase) || 0;
        const ivaNum = parseFloat(iva) || 0;
        return precio * (1 + ivaNum / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim()) return setError("El nombre es requerido");
        if (!precioBase || parseFloat(precioBase) <= 0) return setError("El precio debe ser mayor a 0");
        if (!stockActual || parseInt(stockActual) < 0) return setError("El stock no puede ser negativo");
        if (!categoriaId) return setError("Selecciona una categoría");

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", nombre);
        formData.append("precio_base", precioBase); 
        formData.append("iva", iva);
        formData.append("stock_actual", stockActual);
        formData.append("categoriaId", categoriaId);
        formData.append("ruta_imagen", "sin-imagen.jpg");
        if (imagen) {
            formData.append("imagen", imagen);
        } else if (!producto) {
             formData.append("ruta_imagen", "sin-imagen.jpg");
        }
        /*if (producto?.id) formData.append("id", producto.id.toString());*/

        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || "Error al guardar el producto");
        }
    };

    return (
        <Card className={className}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {producto ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
                    <HiExclamationCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex justify-center pb-2">
                    <ImageUpload
                        value={producto?.ruta_imagen}
                        onChange={setImagen}
                        preview={producto?.ruta_imagen}
                    />
                </div>

                <FormField label="Nombre del producto" required>
                    <Input
                        value={nombre}
                        onChange={setNombre}
                        placeholder="Ej: Auriculares Bluetooth"
                        disabled={loading}
                    />
                </FormField>

                <FormField label="Categoría" required>
                    <Select
                        value={categoriaId}
                        onChange={setCategoriaId}
                        options={categorias}
                        placeholder="Seleccionar..."
                        disabled={loading}
                    />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Precio Neto" required>
                        <Input
                            type="number"
                            value={precioBase}
                            onChange={setPrecioBase}
                            placeholder="0"
                            disabled={loading}
                        />
                    </FormField>

                    <FormField label="IVA (%)" required>
                        <Input
                            type="number"
                            value={iva}
                            onChange={setIva}
                            placeholder="19"
                            disabled={loading}
                        />
                    </FormField>
                </div>

                {precioBase && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg flex items-center gap-3">
                        <HiInformationCircle className="w-6 h-6 text-purple-500 shrink-0" />
                        <div>
                            <p className="text-xs text-purple-600 dark:text-purple-300 font-medium uppercase tracking-wide">
                                Precio Final (con IVA)
                            </p>
                            <p className="text-xl font-bold text-purple-700 dark:text-purple-200">
                                ${calcularPrecioConIva().toLocaleString("es-CL")}
                            </p>
                        </div>
                    </div>
                )}

                <FormField label="Stock inicial" required>
                    <Input
                        type="number"
                        value={stockActual}
                        onChange={setStockActual}
                        placeholder="0"
                        disabled={loading}
                    />
                </FormField>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        {producto ? "Guardar Cambios" : "Crear Producto"}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ProductoForm;