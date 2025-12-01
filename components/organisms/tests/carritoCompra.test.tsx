import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import CarritoCompra from '../carritoCompra';

vi.mock('../../atoms/card', () => ({
    default: ({ children, title, className }: any) => (
        <div className={className}>
            <h2>{title}</h2>
            {children}
        </div>
    ),
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

vi.mock('../../atoms/input', () => ({
    default: ({ value, onChange, placeholder }: any) => (
        <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

vi.mock('../../atoms/label', () => ({
    default: ({ children }: any) => <label>{children}</label>,
}));

vi.mock('../../molecules/cartItem', () => ({
    default: ({ producto, cantidad }: any) => (
        <div>
            <span>{producto.nombre}</span>
            <span>{cantidad}</span>
        </div>
    ),
}));

vi.mock('../../molecules/ventaResumen', () => ({
    default: ({ subtotal, totalIva, total, montoPagado, vuelto }: any) => (
        <div>
            <p>Subtotal: {subtotal}</p>
            <p>IVA: {totalIva}</p>
            <p>Total: {total}</p>
            {montoPagado !== undefined && <p>Pagado: {montoPagado}</p>}
            {vuelto !== undefined && <p>Vuelto: {vuelto}</p>}
        </div>
    ),
}));

vi.mock('../../molecules/metodoPagoSelect', () => ({
    default: ({ selected, onChange }: any) => (
        <select value={selected} onChange={(e) => onChange(e.target.value)}>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
        </select>
    ),
}));

vi.mock('../../molecules/emptyState', () => ({
    default: ({ title, description }: any) => (
        <div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    ),
}));

describe('CarritoCompra', () => {
    const mockProducto = {
        id: 1,
        nombre: 'Producto A',
        precioBase: 1000,
        iva: 19,
        precioConIva: 1190,
        stockActual: 5,
    };

    const carrito = [{ producto: mockProducto, cantidad: 2 }];

    const handleChangeQuantity = vi.fn();
    const handleRemove = vi.fn();
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    beforeEach(() => {
        handleChangeQuantity.mockClear();
        handleRemove.mockClear();
        handleConfirm.mockClear();
        handleCancel.mockClear();
    });

    it('debe renderizar EmptyState cuando el carrito está vacío', () => {
        render(
            <CarritoCompra
                carrito={[]}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        expect(screen.getByText('Carrito vacío')).toBeInTheDocument();
        expect(screen.getByText('Agrega productos para comenzar')).toBeInTheDocument();
    });

    it('debe renderizar los items del carrito', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('debe mostrar el resumen de la venta', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        expect(screen.getByText(/Subtotal:/)).toBeInTheDocument();
        expect(screen.getByText(/IVA:/)).toBeInTheDocument();
        expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });

    it('debe mostrar el input de monto pagado cuando el método de pago es EFECTIVO', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        expect(screen.getByPlaceholderText('Ingrese monto recibido')).toBeInTheDocument();
    });

    it('no debe mostrar el botón de registrar venta si el carrito está vacío', () => {
        render(
            <CarritoCompra
                carrito={[]}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        expect(screen.queryByText('Registrar Venta')).not.toBeInTheDocument();
        expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('debe mostrar error si el monto pagado es insuficiente', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        const input = screen.getByPlaceholderText('Ingrese monto recibido');
        fireEvent.change(input, { target: { value: '100' } });
        fireEvent.click(screen.getByText('Registrar Venta'));
        expect(screen.getByText(/Monto insuficiente/)).toBeInTheDocument();
        expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('debe llamar a onConfirm si el monto es suficiente', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        const input = screen.getByPlaceholderText('Ingrese monto recibido');
        fireEvent.change(input, { target: { value: '5000' } });
        fireEvent.click(screen.getByText('Registrar Venta'));
        expect(handleConfirm).toHaveBeenCalled();
    });

    it('debe llamar a onCancel al hacer click en Cancelar', () => {
        render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
        fireEvent.click(screen.getByText('Cancelar'));
        expect(handleCancel).toHaveBeenCalled();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(
            <CarritoCompra
                carrito={carrito}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                className="extra-class"
            />
        );
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});