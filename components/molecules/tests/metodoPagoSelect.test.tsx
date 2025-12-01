import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import MetodoPagoSelector from '../metodoPagoSelect';

vi.mock('../atoms/label', () => ({
    default: ({ children }: any) => <label>{children}</label>,
}));

describe('MetodoPagoSelector', () => {
    const handleChange = vi.fn();

    beforeEach(() => {
        handleChange.mockClear();
    });

    it('debe renderizar el label correctamente', () => {
        render(<MetodoPagoSelector selected="" onChange={handleChange} />);
        expect(screen.getByText('Método de pago:')).toBeInTheDocument();
    });

    it('debe renderizar todas las opciones de método de pago', () => {
        render(<MetodoPagoSelector selected="" onChange={handleChange} />);
        expect(screen.getByText('Efectivo')).toBeInTheDocument();
        expect(screen.getByText('Tarjeta')).toBeInTheDocument();
        expect(screen.getByText('Transf.')).toBeInTheDocument();
    });

    it('debe llamar a onChange con el valor correcto al hacer click en una opción', () => {
        render(<MetodoPagoSelector selected="" onChange={handleChange} />);
        fireEvent.click(screen.getByText('Tarjeta'));
        expect(handleChange).toHaveBeenCalledWith('TARJETA');
    });

    it('debe aplicar estilos de selección cuando una opción está seleccionada', () => {
        render(<MetodoPagoSelector selected="EFECTIVO" onChange={handleChange} />);
        const efectivoButton = screen.getByText('Efectivo').closest('button');
        expect(efectivoButton?.className).toContain('border-purple-600');
        expect(efectivoButton?.className).toContain('bg-purple-50');
    });

    it('debe aplicar estilos no seleccionados cuando una opción no está seleccionada', () => {
        render(<MetodoPagoSelector selected="EFECTIVO" onChange={handleChange} />);
        const tarjetaButton = screen.getByText('Tarjeta').closest('button');
        expect(tarjetaButton?.className).toContain('border-gray-200');
        expect(tarjetaButton?.className).toContain('bg-white');
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        render(<MetodoPagoSelector selected="" onChange={handleChange} className="extra-class" />);
        const container = screen.getByText('Método de pago:').closest('div');
        expect(container?.className).toContain('extra-class');
    });
});
