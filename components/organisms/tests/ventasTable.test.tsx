import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import VentasTable from '../ventasTable';

vi.mock('../../atoms/card', () => ({
    default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

vi.mock('../../atoms/badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../../molecules/searchBar', () => ({
    default: ({ searchValue, onSearchChange, filterValue, onFilterChange, filterOptions, placeholder }: any) => (
        <div>
            <input
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <select value={filterValue} onChange={(e) => onFilterChange(e.target.value)}>
                {filterOptions.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    ),
}));

vi.mock('../../molecules/pagination', () => ({
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div>
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                Anterior
            </button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                Siguiente
            </button>
        </div>
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

vi.mock('../../atoms/spinner', () => ({
    default: () => <div>Spinner</div>,
}));

describe('VentasTable', () => {
    const ventas = [
        {
            id: 1,
            fecha_hora: new Date('2025-12-01T10:30:00').toISOString(),
            usuario: { nombre: 'Juan Pérez' },
            total: 1000,
            metodo_pago: 'EFECTIVO' as const,
        },
        {
            id: 2,
            fecha_hora: new Date('2025-12-01T11:00:00').toISOString(),
            usuario: { nombre: 'Ana Gómez' },
            total: 2000,
            metodo_pago: 'TARJETA' as const,
        },
    ];

    const handleViewDetalle = vi.fn();

    beforeEach(() => {
        handleViewDetalle.mockClear();
    });

    it('debe mostrar el spinner cuando loading=true', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} loading />);
        expect(screen.getByText('Spinner')).toBeInTheDocument();
    });

    it('debe renderizar encabezado y filtros', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        expect(screen.getByText('Registro de Ventas')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por # o vendedor...')).toBeInTheDocument();
    });

    it('debe renderizar las ventas en la tabla', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('$1.000')).toBeInTheDocument();
        expect(screen.getByText('$2.000')).toBeInTheDocument();
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByText('Ana Gómez')).toBeInTheDocument();
    });

    it('debe llamar a onViewDetalle al hacer click en "Ver"', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        fireEvent.click(screen.getAllByText('Ver')[0]);
        expect(handleViewDetalle).toHaveBeenCalledWith(1);
    });

    it('debe mostrar EmptyState cuando no hay ventas filtradas', () => {
        render(<VentasTable ventas={[]} onViewDetalle={handleViewDetalle} />);
        expect(screen.getByText('No se encontraron ventas')).toBeInTheDocument();
        expect(screen.getByText('No hay ventas que coincidan con los filtros')).toBeInTheDocument();
    });

    it('debe filtrar ventas por búsqueda', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        fireEvent.change(screen.getByPlaceholderText('Buscar por # o vendedor...'), { target: { value: 'Juan' } });
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.queryByText('Ana Gómez')).toBeNull();
    });

    it('debe filtrar ventas por método de pago', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'TARJETA' } });
        expect(screen.getByText('Ana Gómez')).toBeInTheDocument();
        expect(screen.queryByText('Juan Pérez')).toBeNull();
    });

    it('debe mostrar paginación cuando hay más ventas que itemsPerPage', () => {
        const manyVentas = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            fecha_hora: new Date().toISOString(),
            usuario: { nombre: `User ${i + 1}` },
            total: 1000,
            metodo_pago: 'EFECTIVO' as const,
        }));
        render(<VentasTable ventas={manyVentas} onViewDetalle={handleViewDetalle} itemsPerPage={10} />);
        expect(screen.getByText(/Página 1 de 3/)).toBeInTheDocument();
    });

    it('debe mostrar resumen al pie con total mostrado', () => {
        render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} />);
        expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
        expect(screen.getByText(/\| Total: \$3.000/)).toBeInTheDocument();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<VentasTable ventas={ventas} onViewDetalle={handleViewDetalle} className="extra-class" />);

        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});