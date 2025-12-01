import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import CerrarDiaForm from '../cerrarDiaForm';

vi.mock('../../atoms/card', () => ({
    default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

vi.mock('../../atoms/alert', () => ({
    default: ({ children, title }: any) => (
        <div>
            <h4>{title}</h4>
            {children}
        </div>
    ),
}));

vi.mock('../../atoms/spinner', () => ({
    default: () => <div>Spinner</div>,
}));

describe('CerrarDiaForm', () => {
    const mockConsolidado = {
        cantidadVentas: 10,
        totalVendido: 50000,
        productosVendidos: 25,
        totalEfectivo: 20000,
        totalTarjeta: 25000,
        totalTransferencia: 5000,
    };

    const handleConfirm = vi.fn(() => Promise.resolve());
    const handleCancel = vi.fn();

    beforeEach(() => {
        handleConfirm.mockClear();
        handleCancel.mockClear();
    });

    it('debe mostrar el spinner cuando loading=true', () => {
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} loading />);
        expect(screen.getByText('Spinner')).toBeInTheDocument();
    });

    it('debe mostrar el spinner cuando consolidado=null', () => {
        render(<CerrarDiaForm consolidado={null} onConfirm={handleConfirm} onCancel={handleCancel} />);
        expect(screen.getByText('Spinner')).toBeInTheDocument();
    });

    it('debe renderizar encabezado y fecha', () => {
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} />);
        expect(screen.getByText('Cerrar Día')).toBeInTheDocument();
        expect(screen.getByText(/Importante/)).toBeInTheDocument();
        expect(screen.getByText(/Resumen del día:/)).toBeInTheDocument();
        expect(screen.getByText(/Arqueo de Caja:/)).toBeInTheDocument();
    });

    it('debe mostrar los valores del consolidado', () => {
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} />);
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getAllByText('$50.000').length).toBeGreaterThan(0);
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('$20.000')).toBeInTheDocument();
        expect(screen.getByText('$25.000')).toBeInTheDocument();
        expect(screen.getByText('$5.000')).toBeInTheDocument();
    });

    it('debe llamar a onCancel al hacer click en Cancelar', () => {
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} />);
        fireEvent.click(screen.getByText('Cancelar'));
        expect(handleCancel).toHaveBeenCalled();
    });

    it('debe llamar a onConfirm al hacer click en Confirmar', async () => {
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} />);
        const confirmButton = screen.getByRole('button', { name: /confirmar cierre/i });
        fireEvent.click(confirmButton);

        await waitFor(() => expect(handleConfirm).toHaveBeenCalled());
    });

    it('debe mostrar mensaje de error si onConfirm lanza excepción', async () => {
        const failingConfirm = vi.fn(() => Promise.reject(new Error('Error')));
        render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={failingConfirm} onCancel={handleCancel} />);

        const confirmButton = screen.getByRole('button', { name: /confirmar cierre/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText(/Hubo un problema al cerrar el día/)).toBeInTheDocument();
        });
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<CerrarDiaForm consolidado={mockConsolidado} onConfirm={handleConfirm} onCancel={handleCancel} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});