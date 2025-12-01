import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VentaResumen from '../ventaResumen';

describe('VentaResumen', () => {
    const defaultProps = {
        subtotal: 1000,
        total_iva: 190,
        total: 1190,
    };

    it('debe renderizar el subtotal y el IVA correctamente', () => {
        render(<VentaResumen {...defaultProps} />);
        expect(screen.getByText('Subtotal (sin IVA):')).toBeInTheDocument();
        expect(screen.getByText('$1.000')).toBeInTheDocument();
        expect(screen.getByText('IVA:')).toBeInTheDocument();
        expect(screen.getByText('$190')).toBeInTheDocument();
    });

    it('debe renderizar el total correctamente', () => {
        render(<VentaResumen {...defaultProps} />);
        expect(screen.getByText('TOTAL:')).toBeInTheDocument();
        expect(screen.getByText('$1.190')).toBeInTheDocument();
    });

    it('debe renderizar montoPagado y vuelto cuando se pasan como props', () => {
        render(<VentaResumen {...defaultProps} montoPagado={2000} vuelto={810} />);
        expect(screen.getByText('Pagó con:')).toBeInTheDocument();
        expect(screen.getByText('$2.000')).toBeInTheDocument();
        expect(screen.getByText('Vuelto:')).toBeInTheDocument();
        expect(screen.getByText('$810')).toBeInTheDocument();
    });

    it('no debe renderizar montoPagado si no se pasa o es 0', () => {
        render(<VentaResumen {...defaultProps} montoPagado={0} />);
        expect(screen.queryByText('Pagó con:')).toBeNull();
    });

    it('no debe renderizar vuelto si no se pasa', () => {
        render(<VentaResumen {...defaultProps} montoPagado={2000} />);
        expect(screen.queryByText('Vuelto:')).toBeNull();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<VentaResumen {...defaultProps} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});