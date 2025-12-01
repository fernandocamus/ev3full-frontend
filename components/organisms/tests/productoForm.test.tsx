import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ProductoForm from '../productoForm';

vi.mock('../../atoms/card', () => ({
    default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, type, disabled }: any) => (
        <button type={type} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

vi.mock('../../atoms/alert', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../molecules/formField', () => ({
    default: ({ children, label }: any) => (
        <label>
            {label}
            {children}
        </label>
    ),
}));

vi.mock('../../molecules/imageUpload', () => ({
    default: ({ onChange }: any) => (
        <input
            type="file"
            data-testid="image-upload"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
    ),
}));

vi.mock('../../atoms/input', () => ({
    default: ({ value, onChange, placeholder, type = 'text' }: any) => (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

vi.mock('../../atoms/select', () => ({
    default: ({ value, onChange, options }: any) => (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

describe('ProductoForm', () => {
    const handleSubmit = vi.fn(() => Promise.resolve());
    const handleCancel = vi.fn();

    beforeEach(() => {
        handleSubmit.mockClear();
        handleCancel.mockClear();
    });

    it('debe renderizar título "Nuevo Producto" cuando no se pasa producto', () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
    });

    it('debe renderizar título "Editar Producto" cuando se pasa producto', () => {
        const producto = {
            id: 1,
            nombre: 'Producto A',
            descripcion: 'Desc',
            precio_base: 1000,
            iva: 19,
            stock_actual: 5,
            categoriaId: 1,
        };
        render(<ProductoForm producto={producto} onSubmit={handleSubmit} onCancel={handleCancel} />);
        expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    });

    it('debe mostrar error si el nombre está vacío', async () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.click(screen.getByText('Crear Producto'));
        expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('debe mostrar error si el precio es menor o igual a 0', async () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.change(screen.getByPlaceholderText('Ej: Auriculares Bluetooth'), { target: { value: 'Test' } });

        const numberInputs = screen.getAllByPlaceholderText('0');
        fireEvent.change(numberInputs[0], { target: { value: '0' } });

        fireEvent.click(screen.getByText('Crear Producto'));
        expect(await screen.findByText('El precio debe ser mayor a 0')).toBeInTheDocument();
    });

    it('debe mostrar error si el stock es negativo', async () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.change(screen.getByPlaceholderText('Ej: Auriculares Bluetooth'), { target: { value: 'Test' } });

        const numberInputs = screen.getAllByPlaceholderText('0');
        fireEvent.change(numberInputs[0], { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('19'), { target: { value: '19' } });
        fireEvent.change(numberInputs[1], { target: { value: '-1' } });

        fireEvent.click(screen.getByText('Crear Producto'));
        expect(await screen.findByText('El stock no puede ser negativo')).toBeInTheDocument();
    });

    it('debe mostrar error si no se selecciona categoría', async () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.change(screen.getByPlaceholderText('Ej: Auriculares Bluetooth'), { target: { value: 'Test' } });

        const numberInputs = screen.getAllByPlaceholderText('0');
        fireEvent.change(numberInputs[0], { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('19'), { target: { value: '19' } });
        fireEvent.change(numberInputs[1], { target: { value: '10' } });

        fireEvent.click(screen.getByText('Crear Producto'));
        expect(await screen.findByText('Selecciona una categoría')).toBeInTheDocument();
    });

    it('debe llamar a onSubmit con datos válidos', async () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.change(screen.getByPlaceholderText('Ej: Auriculares Bluetooth'), { target: { value: 'Test' } });

        const numberInputs = screen.getAllByPlaceholderText('0');
        fireEvent.change(numberInputs[0], { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('19'), { target: { value: '19' } });
        fireEvent.change(numberInputs[1], { target: { value: '10' } });

        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        fireEvent.click(screen.getByText('Crear Producto'));
        await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    });

    it('debe llamar a onCancel al hacer click en Cancelar', () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);
        fireEvent.click(screen.getByText('Cancelar'));
        expect(handleCancel).toHaveBeenCalled();
    });

    it('debe mostrar el precio final con IVA cuando se ingresa precio', () => {
        render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} />);

        const numberInputs = screen.getAllByPlaceholderText('0');
        fireEvent.change(numberInputs[0], { target: { value: '1000' } });

        expect(screen.getByText(/Precio Final \(con IVA\)/)).toBeInTheDocument();
        expect(screen.getByText('$1.190')).toBeInTheDocument();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<ProductoForm onSubmit={handleSubmit} onCancel={handleCancel} className="extra-class" />);

        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});