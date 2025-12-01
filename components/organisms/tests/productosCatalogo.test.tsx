import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ProductosCatalogo from '../productosCatalogo';

vi.mock('../../molecules/searchBar', () => ({
    default: ({ searchValue, onSearchChange, filterValue, onFilterChange, filterOptions }: any) => (
        <div>
            <input
                placeholder="Buscar producto..."
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

vi.mock('../../molecules/productCard', () => ({
    default: ({ producto, onAdd }: any) => (
        <div>
            <span>{producto.nombre}</span>
            <button onClick={() => onAdd(producto)}>Agregar</button>
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

describe('ProductosCatalogo', () => {
    const productos = [
        {
            id: 1,
            nombre: 'Producto A',
            descripcion: 'Desc A',
            precioBase: 1000,
            iva: 19,
            precioConIva: 1190,
            stockActual: 5,
            categoria: { id: 1, nombre: 'Electrónica' },
        },
        {
            id: 2,
            nombre: 'Producto B',
            descripcion: 'Desc B',
            precioBase: 2000,
            iva: 19,
            precioConIva: 2380,
            stockActual: 3,
            categoria: { id: 2, nombre: 'Ropa' },
        },
    ];

    const handleSelectProduct = vi.fn();

    beforeEach(() => {
        handleSelectProduct.mockClear();
    });

    it('debe mostrar el spinner cuando loading=true', () => {
        render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} loading />);
        expect(screen.getByText('Spinner')).toBeInTheDocument();
    });

    it('debe renderizar los productos cuando hay datos', () => {
        render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} />);
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('Producto B')).toBeInTheDocument();
    });

    it('debe llamar a onSelectProduct al hacer click en Agregar', () => {
        render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} />);
        const addButtons = screen.getAllByText('Agregar');
        fireEvent.click(addButtons[0]);
        expect(handleSelectProduct).toHaveBeenCalledWith(productos[0]);
    });

    it('debe mostrar EmptyState cuando no hay productos filtrados', () => {
        render(<ProductosCatalogo productos={[]} onSelectProduct={handleSelectProduct} />);
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    });

    it('debe filtrar productos por búsqueda', () => {
        render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} />);
        fireEvent.change(screen.getByPlaceholderText('Buscar producto...'), { target: { value: 'Producto A' } });
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.queryByText('Producto B')).toBeNull();
    });

    it('debe filtrar productos por categoría', () => {
        render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Ropa' } });
        expect(screen.getByText('Producto B')).toBeInTheDocument();
        expect(screen.queryByText('Producto A')).toBeNull();
    });

    it('debe mostrar paginación cuando hay más productos que itemsPerPage', () => {
        const manyProducts = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            nombre: `Producto ${i + 1}`,
            descripcion: 'Desc',
            precioBase: 1000,
            iva: 19,
            precioConIva: 1190,
            stockActual: 5,
            categoria: { id: 1, nombre: 'Electrónica' },
        }));
        render(<ProductosCatalogo productos={manyProducts} onSelectProduct={handleSelectProduct} itemsPerPage={9} />);
        expect(screen.getByText(/Página 1 de 2/)).toBeInTheDocument();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<ProductosCatalogo productos={productos} onSelectProduct={handleSelectProduct} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});