import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartItem from '../cartItem';

const mockProducto = {
    id: 1,
    nombre: 'Producto de prueba',
    precioConIva: 1000,
    stockActual: 5,
};

describe('CartItem', () => {
    it('debe renderizar el nombre y precio del producto', () => {
        render(
            <CartItem
                producto={mockProducto}
                cantidad={2}
                onChangeQuantity={() => { }}
                onRemove={() => { }}
            />
        );
        expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
        expect(screen.getByText('$1.000 c/u')).toBeInTheDocument();
    });

    it('debe mostrar la cantidad actual', () => {
        render(
            <CartItem
                producto={mockProducto}
                cantidad={3}
                onChangeQuantity={() => { }}
                onRemove={() => { }}
            />
        );
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('debe calcular y mostrar el total correctamente', () => {
        render(
            <CartItem
                producto={mockProducto}
                cantidad={2}
                onChangeQuantity={() => { }}
                onRemove={() => { }}
            />
        );
        expect(screen.getByText('$2.000')).toBeInTheDocument();
    });

    it('debe llamar a onRemove cuando se hace click en el botón eliminar', () => {
        const handleRemove = vi.fn();
        render(
            <CartItem
                producto={mockProducto}
                cantidad={2}
                onChangeQuantity={() => { }}
                onRemove={handleRemove}
            />
        );
        fireEvent.click(screen.getByLabelText('Eliminar producto'));
        expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('debe incrementar la cantidad cuando se hace click en el botón "+"', () => {
        const handleChangeQuantity = vi.fn();
        render(
            <CartItem
                producto={mockProducto}
                cantidad={2}
                onChangeQuantity={handleChangeQuantity}
                onRemove={() => { }}
            />
        );

        const buttons = screen.getAllByRole('button');
        const incrementButton = buttons[2];

        fireEvent.click(incrementButton);
        expect(handleChangeQuantity).toHaveBeenCalledWith(3);
    });

    it('debe deshabilitar el botón "+" cuando la cantidad es igual al stock', () => {
        render(
            <CartItem
                producto={mockProducto}
                cantidad={5}
                onChangeQuantity={() => { }}
                onRemove={() => { }}
            />
        );
        const incrementButton = screen.getAllByRole('button')[2];
        expect(incrementButton).toBeDisabled();
    });

    it('debe decrementar la cantidad cuando se hace click en el botón "-"', () => {
        const handleChangeQuantity = vi.fn();
        render(
            <CartItem
                producto={mockProducto}
                cantidad={3}
                onChangeQuantity={handleChangeQuantity}
                onRemove={() => { }}
            />
        );
        const decrementButton = screen.getAllByRole('button')[1];
        fireEvent.click(decrementButton);
        expect(handleChangeQuantity).toHaveBeenCalledWith(2);
    });

    it('debe llamar a onRemove cuando la cantidad es 1 y se hace click en "-"', () => {
        const handleRemove = vi.fn();
        render(
            <CartItem
                producto={mockProducto}
                cantidad={1}
                onChangeQuantity={() => { }}
                onRemove={handleRemove}
            />
        );
        const decrementButton = screen.getAllByRole('button')[1];
        fireEvent.click(decrementButton);
        expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(
            <CartItem
                producto={mockProducto}
                cantidad={2}
                onChangeQuantity={() => { }}
                onRemove={() => { }}
                className="extra-class"
            />
        );
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});