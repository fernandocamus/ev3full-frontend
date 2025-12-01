import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import BoletaView from '../boletaView';

vi.mock('../atoms/card', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

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

const mockVenta = {
    id: 123,
    fecha_hora: new Date('2025-12-01T10:30:00').toISOString(),
    usuario: { nombre: 'Juan Pérez' },
    subtotal: 1000,
    total_iva: 190,
    total: 1190,
    metodo_pago: 'EFECTIVO',
    detalles: [
        {
            id: 1,
            producto: { nombre: 'Producto A' },
            cantidad: 2,
            precio_unitario_base: 500,
            iva: 19,
            precio_unitario_con_iva: 595,
            subtotal_con_iva: 1190,
        },
    ],
};

describe('BoletaView', () => {
    const handleImprimir = vi.fn();
    const handleDescargar = vi.fn();
    const handleClose = vi.fn();

    beforeEach(() => {
        handleImprimir.mockClear();
        handleDescargar.mockClear();
        handleClose.mockClear();
    });

    it('debe renderizar encabezado con datos de la tienda', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('SISTEMA POS')).toBeInTheDocument();
        expect(screen.getByText('Minimarket La Esquina')).toBeInTheDocument();
        expect(screen.getByText('Av. Principal 123')).toBeInTheDocument();
        expect(screen.getByText('Tel: +56 9 1234 5678')).toBeInTheDocument();
    });

    it('debe renderizar datos de la boleta (id, fecha, hora, vendedor)', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('#000123')).toBeInTheDocument();
        const fecha = new Date(mockVenta.fecha_hora);
        const dia = fecha.getDate().toString().padStart(2, '0');
        expect(screen.getByText(new RegExp(`${dia}-12-2025`))).toBeInTheDocument();
        expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
    });

    it('debe renderizar detalle de productos', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('2 x $595')).toBeInTheDocument();

        const precios = screen.getAllByText('$1.190');
        expect(precios.length).toBeGreaterThan(0);
    });

    it('debe renderizar subtotal, IVA y total', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('Subtotal (Neto):')).toBeInTheDocument();
        expect(screen.getByText('$1.000')).toBeInTheDocument();
        expect(screen.getByText('IVA (19%):')).toBeInTheDocument();
        expect(screen.getByText('$190')).toBeInTheDocument();
        expect(screen.getByText('TOTAL')).toBeInTheDocument();

        const totales = screen.getAllByText('$1.190');
        expect(totales.length).toBeGreaterThan(0);
    });

    it('debe renderizar método de pago en Badge', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('EFECTIVO')).toBeInTheDocument();
    });

    it('debe renderizar montoPagado y vuelto cuando se pasan', () => {
        render(<BoletaView venta={mockVenta} montoPagado={2000} vuelto={810} />);
        expect(screen.getByText('Pagó con:')).toBeInTheDocument();
        expect(screen.getByText('$2.000')).toBeInTheDocument();
        expect(screen.getByText('Vuelto:')).toBeInTheDocument();
        expect(screen.getByText('$810')).toBeInTheDocument();
    });

    it('no debe renderizar vuelto si no se pasa', () => {
        render(<BoletaView venta={mockVenta} montoPagado={2000} />);
        expect(screen.queryByText('Vuelto:')).toBeNull();
    });

    it('debe renderizar mensaje de agradecimiento', () => {
        render(<BoletaView venta={mockVenta} />);
        expect(screen.getByText('Gracias por su compra')).toBeInTheDocument();
        expect(screen.getByText('¡Vuelva pronto!')).toBeInTheDocument();
    });

    it('debe renderizar botones de acción cuando showActions=true', () => {
        render(
            <BoletaView
                venta={mockVenta}
                onImprimir={handleImprimir}
                onDescargar={handleDescargar}
                onClose={handleClose}
            />
        );
        expect(screen.getByText('Imprimir')).toBeInTheDocument();
        expect(screen.getByText('PDF')).toBeInTheDocument();
        expect(screen.getByText('Cerrar')).toBeInTheDocument();
    });

    it('debe llamar a las funciones de acción al hacer click en los botones', () => {
        render(
            <BoletaView
                venta={mockVenta}
                onImprimir={handleImprimir}
                onDescargar={handleDescargar}
                onClose={handleClose}
            />
        );
        fireEvent.click(screen.getByText('Imprimir'));
        expect(handleImprimir).toHaveBeenCalled();
        fireEvent.click(screen.getByText('PDF'));
        expect(handleDescargar).toHaveBeenCalled();
        fireEvent.click(screen.getByText('Cerrar'));
        expect(handleClose).toHaveBeenCalled();
    });

    it('no debe renderizar botones de acción cuando showActions=false', () => {
        render(<BoletaView venta={mockVenta} showActions={false} />);
        expect(screen.queryByText('Imprimir')).toBeNull();
        expect(screen.queryByText('PDF')).toBeNull();
        expect(screen.queryByText('Cerrar')).toBeNull();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<BoletaView venta={mockVenta} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});