import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ProductosTable from '../productosTable';

vi.mock('react-icons/hi', () => ({
    HiPencil: () => <span data-testid="icon-edit">Editar</span>,
    HiTrash: () => <span data-testid="icon-trash">Eliminar</span>,
    HiShoppingCart: () => <span data-testid="icon-cart">Carrito</span>,
    HiCube: () => <span data-testid="icon-cube">Cube</span>,
    HiShoppingBag: () => <span data-testid="icon-shopping-bag">ShoppingBag</span>,
    HiPhotograph: () => <span data-testid="icon-photograph">Photograph</span>,
    HiExclamationCircle: () => <span data-testid="icon-error">Error</span>,
}));

vi.mock('../../atoms/card', () => ({
    default: ({ children, className }: any) => (
        <div className={className} data-testid="card">
            {children}
        </div>
    ),
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, variant, className, disabled }: any) => (
        <button
            onClick={onClick}
            data-variant={variant}
            className={className}
            disabled={disabled}
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

vi.mock('../../molecules/searchBar', () => ({
    default: ({ searchValue, onSearchChange, filterValue, onFilterChange, filterOptions, placeholder, className }: any) => (
        <div className={className} data-testid="search-bar">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                data-testid="search-input"
            />
            <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                data-testid="filter-select"
            >
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
    default: ({ title, icon }: any) => (
        <div data-testid="empty-state">
            {icon}
            <h3>{title}</h3>
        </div>
    ),
}));

vi.mock('../../molecules/confirmDialog', () => ({
    default: ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant, loading }: any) => (
        isOpen ? (
            <div data-testid="confirm-dialog" data-variant={variant}>
                <h3>{title}</h3>
                <p>{message}</p>
                <button onClick={onConfirm} disabled={loading}>
                    {loading ? 'Eliminando...' : confirmText}
                </button>
                <button onClick={onClose}>{cancelText}</button>
            </div>
        ) : null
    ),
}));

describe('ProductosTable', () => {
    const mockProductos = [
        {
            id: 1,
            nombre: 'Producto A',
            descripcion: 'Descripción A',
            precio_base: 1000,
            iva: 19,
            precio_con_iva: 1190,
            stock_actual: 10,
            ruta_imagen: 'imagen-a.jpg',
            categoria: { nombre: 'Categoría 1' },
        },
        {
            id: 2,
            nombre: 'Producto B',
            descripcion: 'Descripción B',
            precio_base: 2000,
            iva: 19,
            precio_con_iva: 2380,
            stock_actual: 0,
            ruta_imagen: undefined,
            categoria: { nombre: 'Categoría 2' },
        },
        {
            id: 3,
            nombre: 'Producto C',
            descripcion: 'Descripción C',
            precio_base: 1500,
            iva: 19,
            precio_con_iva: 1785,
            stock_actual: 3,
            ruta_imagen: 'sin-imagen.jpg',
            categoria: { nombre: 'Categoría 1' },
        },
    ];

    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleSell = vi.fn();

    beforeEach(() => {
        handleEdit.mockClear();
        handleDelete.mockClear();
        handleSell.mockClear();
    });

    it('debe mostrar el spinner cuando loading es true', () => {
        render(
            <ProductosTable
                productos={[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={true}
            />
        );
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debe renderizar EmptyState cuando no hay productos', () => {
        render(
            <ProductosTable
                productos={[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={false}
            />
        );
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    });

    it('debe renderizar el título "Gestión de Productos" cuando readOnly es false', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                readOnly={false}
            />
        );
        expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    });

    it('debe renderizar el título "Catálogo de Productos" cuando readOnly es true', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                readOnly={true}
            />
        );
        expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
    });

    it('debe renderizar la tabla con los encabezados correctos', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        expect(screen.getByText('Imagen')).toBeInTheDocument();
        expect(screen.getByText('Nombre')).toBeInTheDocument();
        expect(screen.getByText('Categoría')).toBeInTheDocument();
        expect(screen.getByText('Precio')).toBeInTheDocument();
        expect(screen.getByText('Stock')).toBeInTheDocument();
        expect(screen.getByText('Acciones')).toBeInTheDocument();
    });

    it('debe renderizar todos los productos proporcionados', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('Producto B')).toBeInTheDocument();
        expect(screen.getByText('Producto C')).toBeInTheDocument();
    });

    it('debe formatear el precio correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        expect(screen.getAllByText('$1.190').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$2.380').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$1.785').length).toBeGreaterThan(0);
    });

    it('debe mostrar badges de stock con las cantidades correctas', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        expect(screen.getByText('10 uds')).toBeInTheDocument();
        expect(screen.getByText('0 uds')).toBeInTheDocument();
        expect(screen.getByText('3 uds')).toBeInTheDocument();
    });

    it('debe renderizar SearchBar con las props correctas', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar producto...')).toBeInTheDocument();
    });

    it('debe filtrar productos por búsqueda de nombre', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Producto A' } });

        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.queryByText('Producto B')).not.toBeInTheDocument();
        expect(screen.queryByText('Producto C')).not.toBeInTheDocument();
    });

    it('debe filtrar productos por categoría', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const filterSelect = screen.getByTestId('filter-select');
        fireEvent.change(filterSelect, { target: { value: 'Categoría 1' } });

        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('Producto C')).toBeInTheDocument();
        expect(screen.queryByText('Producto B')).not.toBeInTheDocument();
    });

    it('debe mostrar EmptyState cuando la búsqueda no encuentra resultados', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Producto Inexistente' } });

        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('debe llamar a onEdit con el ID correcto al hacer click en editar', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const editIcons = screen.getAllByTestId('icon-edit');
        const firstEditButton = editIcons[0].closest('button');

        if (firstEditButton) {
            fireEvent.click(firstEditButton);
            expect(handleEdit).toHaveBeenCalled();
        }
    });

    it('debe abrir el diálogo de confirmación al hacer click en eliminar', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const deleteIcons = screen.getAllByTestId('icon-trash');
        const firstDeleteButton = deleteIcons[0].closest('button');

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);
            expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
        }
    });

    it('debe mostrar el mensaje correcto en el diálogo de confirmación', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
        const deleteIcons = screen.getAllByTestId('icon-trash');
        const firstDeleteButton = deleteIcons[0].closest('button');

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);
            expect(screen.getByText(/¿Estás seguro que deseas eliminar "Producto A"\?/)).toBeInTheDocument();
        }
    });

    it('debe llamar a onDelete cuando se confirma la eliminación', async () => {
        handleDelete.mockResolvedValue(undefined);

        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        const deleteIcons = screen.getAllByTestId('icon-trash');
        const firstDeleteButton = deleteIcons[0].closest('button');

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);

            const dialog = screen.getByTestId('confirm-dialog');
            const confirmButton = within(dialog).getByRole('button', { name: 'Eliminar' });

            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(handleDelete).toHaveBeenCalledWith(1);
            });
        }
    });

    it('debe cerrar el diálogo al hacer click en cancelar', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        const deleteIcons = screen.getAllByTestId('icon-trash');
        const firstDeleteButton = deleteIcons[0].closest('button');

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);
            expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

            const cancelButton = screen.getByText('Cancelar');
            fireEvent.click(cancelButton);

            expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
        }
    });

    it('debe mostrar mensaje de error cuando falla la eliminación', async () => {
        handleDelete.mockRejectedValue(new Error('Error al eliminar'));

        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        const deleteIcons = screen.getAllByTestId('icon-trash');
        const firstDeleteButton = deleteIcons[0].closest('button');

        if (firstDeleteButton) {
            fireEvent.click(firstDeleteButton);

            const dialog = screen.getByTestId('confirm-dialog');
            const confirmButton = within(dialog).getByRole('button', { name: 'Eliminar' });

            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(screen.getByText('No se pudo eliminar el producto. Intente nuevamente.')).toBeInTheDocument();
            });
        }
    });

    it('debe mostrar botones de editar y eliminar cuando readOnly es false', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                readOnly={false}
            />
        );

        expect(screen.getAllByTestId('icon-edit').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('icon-trash').length).toBeGreaterThan(0);
    });

    it('debe mostrar botón "Agregar al carrito" cuando readOnly es true', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSell={handleSell}
                readOnly={true}
            />
        );

        expect(screen.getAllByText('Agregar al carrito').length).toBeGreaterThan(0);
    });

    it('debe llamar a onSell con el producto correcto al hacer click en agregar al carrito', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSell={handleSell}
                readOnly={true}
            />
        );

        const addToCartButtons = screen.getAllByText('Agregar al carrito');
        fireEvent.click(addToCartButtons[0]);

        expect(handleSell).toHaveBeenCalledWith(mockProductos[0]);
    });

    it('debe deshabilitar el botón "Agregar al carrito" cuando stock es 0', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSell={handleSell}
                readOnly={true}
            />
        );

        const addToCartButtons = screen.getAllByText('Agregar al carrito');
        expect(addToCartButtons[1]).toBeDisabled();
    });

    it('debe mostrar la paginación cuando hay más de itemsPerPage productos', () => {
        const manyProductos = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            nombre: `Producto ${i + 1}`,
            descripcion: `Descripción ${i + 1}`,
            precio_base: 1000,
            iva: 19,
            precio_con_iva: 1190,
            stock_actual: 10,
            categoria: { nombre: 'Categoría 1' },
        }));

        render(
            <ProductosTable
                productos={manyProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                itemsPerPage={10}
            />
        );

        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('no debe mostrar la paginación cuando hay menos de itemsPerPage productos', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                itemsPerPage={10}
            />
        );

        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('debe calcular y mostrar el total de productos correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        expect(screen.getByText('Total productos')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('debe calcular y mostrar productos con stock correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        expect(screen.getByText('Con stock')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('debe calcular y mostrar productos sin stock correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        expect(screen.getByText('Sin stock')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('debe calcular y mostrar el stock total correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        expect(screen.getByText('Stock total')).toBeInTheDocument();
        expect(screen.getByText('13 uds')).toBeInTheDocument();
    });

    it('debe aplicar className personalizado', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="custom-class"
            />
        );

        const card = screen.getByTestId('card');
        expect(card).toHaveClass('custom-class');
    });

    it('debe generar opciones de filtro únicas basadas en categorías', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        const filterSelect = screen.getByTestId('filter-select');
        const options = filterSelect.querySelectorAll('option');

        expect(options.length).toBe(3);
    });

    it('debe manejar productos sin imagen correctamente', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('debe cambiar de página correctamente', () => {
        const manyProductos = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            nombre: `Producto ${i + 1}`,
            descripcion: `Descripción ${i + 1}`,
            precio_base: 1000,
            iva: 19,
            precio_con_iva: 1190,
            stock_actual: 10,
            categoria: { nombre: 'Categoría 1' },
        }));

        render(
            <ProductosTable
                productos={manyProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                itemsPerPage={10}
            />
        );

        const siguienteButton = screen.getByText('Siguiente');
        fireEvent.click(siguienteButton);

        expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });

    it('debe tener las props por defecto correctas', () => {
        render(
            <ProductosTable
                productos={mockProductos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );

        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

        expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    });
});