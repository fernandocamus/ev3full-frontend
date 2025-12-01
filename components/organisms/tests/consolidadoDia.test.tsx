import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConsolidadoDia from '../consolidadoDia';

vi.mock('../../atoms/card', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../molecules/statCard', () => ({
  default: ({ title, value, subtitle }: any) => (
    <div>
      <h4>{title}</h4>
      <p>{value}</p>
      <span>{subtitle}</span>
    </div>
  ),
}));

vi.mock('../../atoms/spinner', () => ({
  default: () => <div>Spinner</div>,
}));

describe('ConsolidadoDia', () => {
  const mockConsolidado = {
    totalEfectivo: 20000,
    totalTarjeta: 15000,
    totalTransferencia: 5000,
    totalCaja: 40000,
    cantidadVentas: 20,
    totalVendido: 40000,
    productosVendidos: 100,
    ticketPromedio: 2000,
    ventasEfectivo: 10,
    ventasTarjeta: 7,
    ventasTransferencia: 3,
  };

  it('debe mostrar el spinner cuando loading=true', () => {
    render(<ConsolidadoDia consolidado={mockConsolidado} loading />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('debe mostrar el spinner cuando consolidado=null', () => {
    render(<ConsolidadoDia consolidado={null} />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('debe renderizar encabezados principales', () => {
    render(<ConsolidadoDia consolidado={mockConsolidado} />);
    expect(screen.getByText('Caja del Día')).toBeInTheDocument();
    expect(screen.getByText('Resumen de Ventas')).toBeInTheDocument();
  });

  it('debe renderizar los StatCard con valores correctos', () => {
    render(<ConsolidadoDia consolidado={mockConsolidado} />);
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('$20.000')).toBeInTheDocument();
    expect(screen.getByText('10 ventas')).toBeInTheDocument();

    expect(screen.getByText('Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('$15.000')).toBeInTheDocument();
    expect(screen.getByText('7 ventas')).toBeInTheDocument();

    expect(screen.getByText('Transferencia')).toBeInTheDocument();
    expect(screen.getByText('$5.000')).toBeInTheDocument();
    expect(screen.getByText('3 ventas')).toBeInTheDocument();
  });

  it('debe renderizar el total en caja correctamente', () => {
    render(<ConsolidadoDia consolidado={mockConsolidado} />);
    expect(screen.getByText('Total en Caja')).toBeInTheDocument();
    
    const totals = screen.getAllByText('$40.000');
    expect(totals.length).toBeGreaterThan(0);
  });

  it('debe renderizar el resumen de ventas con valores correctos', () => {
    render(<ConsolidadoDia consolidado={mockConsolidado} />);
    expect(screen.getByText('Cantidad de ventas')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    expect(screen.getByText('Total vendido')).toBeInTheDocument();
    expect(screen.getAllByText('$40.000').length).toBeGreaterThan(0);

    expect(screen.getByText('Productos vendidos')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Ticket promedio')).toBeInTheDocument();
    expect(screen.getByText('$2.000')).toBeInTheDocument();
  });

  it('debe aceptar className adicional y aplicarlo al contenedor', () => {
    const { container } = render(<ConsolidadoDia consolidado={mockConsolidado} className="extra-class" />);
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.className).toContain('extra-class');
  });
});