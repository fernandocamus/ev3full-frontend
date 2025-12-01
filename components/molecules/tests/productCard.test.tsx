import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ProductCard from '../productCard';

vi.mock('../atoms/badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../atoms/button', () => ({
    default: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

const mockProducto = {
    id: 1,
    nombre: 'Producto de prueba',
    descripcion: 'Descripción del producto',
    precioBase: 1000,
    iva: 19,
    precioConIva: 1190,
    stockActual: 5,
    rutaImagen: 'imagen.png',
    categoria: { id: 1, nombre: 'Categoría' },
};

describe('ProductCard', () => {
    const handleAdd = vi.fn();

    beforeEach(() => {
        handleAdd.mockClear();
    });

    it('debe renderizar el nombre del producto', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} />);
        expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
    });

    it('debe renderizar la imagen si se pasa rutaImagen', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} />);
        const img = screen.getByAltText('Producto de prueba');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'imagen.png');
    });

    it('debe renderizar el ícono HiPhotograph si no hay rutaImagen', () => {
        const productoSinImagen = { ...mockProducto, rutaImagen: undefined };
        const { container } = render(<ProductCard producto={productoSinImagen} onAdd={handleAdd} />);
        const icon = container.querySelector('svg.w-12.h-12.opacity-50');
        expect(icon).toBeInTheDocument();
    });

    it('debe mostrar el precio neto, IVA y total correctamente', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} />);
        expect(screen.getByText('Neto: $1.000')).toBeInTheDocument();
        expect(screen.getByText('+ IVA (19%): $190')).toBeInTheDocument();
        expect(screen.getByText('Total: $1.190')).toBeInTheDocument();
    });

    it('debe mostrar el stock cuando hay unidades disponibles', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} />);
        expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    });

    it('debe mostrar "Agotado" cuando stockActual=0', () => {
        const productoAgotado = { ...mockProducto, stockActual: 0 };
        render(<ProductCard producto={productoAgotado} onAdd={handleAdd} />);
        expect(screen.getByText('Agotado')).toBeInTheDocument();
    });

    it('debe llamar a onAdd con el producto al hacer click en "Agregar"', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} />);
        fireEvent.click(screen.getByText('Agregar'));
        expect(handleAdd).toHaveBeenCalledWith(mockProducto);
    });

    it('debe deshabilitar el botón "Agregar" si disabled=true', () => {
        render(<ProductCard producto={mockProducto} onAdd={handleAdd} disabled />);
        const button = screen.getByText('Agregar');
        expect(button).toBeDisabled();
    });

    it('debe deshabilitar el botón "Agregar" si el producto está agotado', () => {
        const productoAgotado = { ...mockProducto, stockActual: 0 };
        render(<ProductCard producto={productoAgotado} onAdd={handleAdd} />);
        const button = screen.getByText('Agregar');
        expect(button).toBeDisabled();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<ProductCard producto={mockProducto} onAdd={handleAdd} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});