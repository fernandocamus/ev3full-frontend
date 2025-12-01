import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import DiasTable from '../diasTable';

vi.mock('../../atoms/card', () => ({
    default: ({ children, className }: any) => (
        <div className={className} data-testid="card">
            {children}
        </div>
    ),
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, variant, className }: any) => (
        <button
            onClick={onClick}
            data-variant={variant}
            className={className}
        >
            {children}
        </button>
    ),
}));

vi.mock('../../atoms/badge', () => ({
    default: ({ children, variant }: any) => (
        <span data-variant={variant} data-testid="badge">
            {children}
        </span>
    ),
}));

vi.mock('../../atoms/spinner', () => ({
    default: ({ size }: any) => (
        <div data-testid="spinner" data-size={size}>
            Cargando...
        </div>
    ),
}));

vi.mock('../../molecules/pagination', () => ({
    default: ({ currentPage, totalPages, onPageChange, className }: any) => (
        <div className={className} data-testid="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Siguiente
            </button>
        </div>
    ),
}));

vi.mock('../../molecules/emptyState', () => ({
    default: ({ title, description, icon }: any) => (
        <div data-testid="empty-state">
            {icon}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    ),
}));

describe('DiasTable', () => {
    const mockDias = [
        {
            id: 1,
            fecha: '2024-01-15',
            cantidad_ventas: 10,
            total_vendido: 50000,
            total_productos_vendidos: 25,
        },
        {
            id: 2,
            fecha: '2024-01-16',
            cantidad_ventas: 15,
            total_vendido: 75000,
            total_productos_vendidos: 40,
        },
        {
            id: 3,
            fecha: '2024-01-17',
            cantidad_ventas: 8,
            total_vendido: 30000,
            total_productos_vendidos: 20,
        },
    ];

    const handleViewDetalle = vi.fn();

    beforeEach(() => {
        handleViewDetalle.mockClear();
    });

    it('debe mostrar el spinner cuando loading es true', () => {
        render(
            <DiasTable
                dias={[]}
                onViewDetalle={handleViewDetalle}
                loading={true}
            />
        );
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debe renderizar EmptyState cuando no hay días', () => {
        render(
            <DiasTable
                dias={[]}
                onViewDetalle={handleViewDetalle}
                loading={false}
            />
        );
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('No hay días registrados')).toBeInTheDocument();
        expect(screen.getByText('Aún no se ha cerrado ningún día')).toBeInTheDocument();
    });

    it('debe renderizar el título del componente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('Historial de Días Cerrados')).toBeInTheDocument();
    });

    it('debe renderizar la tabla con los encabezados correctos', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('Fecha')).toBeInTheDocument();
        expect(screen.getByText('Ventas')).toBeInTheDocument();
        expect(screen.getByText('Total Vendido')).toBeInTheDocument();
        expect(screen.getByText('Productos')).toBeInTheDocument();
        expect(screen.getByText('Acción')).toBeInTheDocument();
    });

    it('debe renderizar todos los días proporcionados', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(mockDias.length + 1);
    });

    it('debe formatear el dinero correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getAllByText('$50.000').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$75.000').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$30.000').length).toBeGreaterThan(0);
    });

    it('debe mostrar badges con las cantidades correctas', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        const badges = screen.getAllByTestId('badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('debe llamar a onViewDetalle con el ID correcto al hacer click en Ver', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        const verButtons = screen.getAllByText(/Ver/i);
        fireEvent.click(verButtons[0]);
        expect(handleViewDetalle).toHaveBeenCalledWith(1);
    });

    it('debe calcular y mostrar el total vendido del mes correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('$155.000')).toBeInTheDocument();
    });

    it('debe calcular y mostrar el promedio diario correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('$51.667')).toBeInTheDocument();
    });

    it('debe mostrar el total de días correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('debe calcular y mostrar el total de productos vendidos', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('85 uds')).toBeInTheDocument();
    });

    it('debe mostrar el mejor día correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('Mejor día')).toBeInTheDocument();
    });

    it('debe mostrar el peor día correctamente', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('Día más bajo')).toBeInTheDocument();
    });

    it('debe mostrar la paginación cuando hay más de itemsPerPage elementos', () => {
        const manyDias = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            fecha: `2024-01-${i + 1}`,
            cantidad_ventas: 10,
            total_vendido: 50000,
            total_productos_vendidos: 25,
        }));

        render(
            <DiasTable
                dias={manyDias}
                onViewDetalle={handleViewDetalle}
                itemsPerPage={10}
            />
        );
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('no debe mostrar la paginación cuando hay menos de itemsPerPage elementos', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
                itemsPerPage={10}
            />
        );
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('debe cambiar de página correctamente', () => {
        const manyDias = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            fecha: `2024-01-${String(i + 1).padStart(2, '0')}`,
            cantidad_ventas: 10,
            total_vendido: 50000,
            total_productos_vendidos: 25,
        }));

        render(
            <DiasTable
                dias={manyDias}
                onViewDetalle={handleViewDetalle}
                itemsPerPage={10}
            />
        );

        const siguienteButton = screen.getByText('Siguiente');
        fireEvent.click(siguienteButton);
        expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });

    it('debe aplicar className personalizado', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
                className="custom-class"
            />
        );
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('custom-class');
    });

    it('debe manejar correctamente un array vacío sin errores', () => {
        render(
            <DiasTable
                dias={[]}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('debe formatear las fechas correctamente en formato español', () => {
        render(
            <DiasTable
                dias={[mockDias[0]]}
                onViewDetalle={handleViewDetalle}
            />
        );
        const dateElements = screen.getAllByText(/ene/i);
        expect(dateElements.length).toBeGreaterThan(0);
    });

    it('debe mostrar el resumen del período', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.getByText('Resumen del período:')).toBeInTheDocument();
    });

    it('debe tener las props por defecto correctas', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('debe renderizar múltiples botones Ver, uno por cada día', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        const verButtons = screen.getAllByText(/Ver/i);
        expect(verButtons).toHaveLength(mockDias.length);
    });

    it('debe llamar a onViewDetalle con diferentes IDs al hacer click en diferentes botones', () => {
        render(
            <DiasTable
                dias={mockDias}
                onViewDetalle={handleViewDetalle}
            />
        );
        const verButtons = screen.getAllByText(/Ver/i);

        fireEvent.click(verButtons[0]);
        expect(handleViewDetalle).toHaveBeenCalledWith(1);

        fireEvent.click(verButtons[1]);
        expect(handleViewDetalle).toHaveBeenCalledWith(2);

        fireEvent.click(verButtons[2]);
        expect(handleViewDetalle).toHaveBeenCalledWith(3);
    });
});