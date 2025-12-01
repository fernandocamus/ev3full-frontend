import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import Pagination from '../pagination';

vi.mock('../atoms/button', () => ({
    default: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

describe('Pagination', () => {
    const handlePageChange = vi.fn();

    beforeEach(() => {
        handlePageChange.mockClear();
    });

    it('no debe renderizar nada si totalPages <= 1', () => {
        const { container } = render(
            <Pagination currentPage={1} totalPages={1} onPageChange={handlePageChange} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('debe renderizar el texto de página actual y total', () => {
        render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />);
        expect(screen.getByText(/Página/)).toHaveTextContent('Página 2 de 5');
    });

    it('debe llamar a onPageChange con la página anterior al hacer click en "Anterior"', () => {
        render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);
        fireEvent.click(screen.getByText('Anterior'));
        expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('no debe llamar a onPageChange si currentPage=1 y se hace click en "Anterior"', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);
        fireEvent.click(screen.getByText('Anterior'));
        expect(handlePageChange).not.toHaveBeenCalled();
    });

    it('debe llamar a onPageChange con la página siguiente al hacer click en "Siguiente"', () => {
        render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />);
        fireEvent.click(screen.getByText('Siguiente'));
        expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('no debe llamar a onPageChange si currentPage=totalPages y se hace click en "Siguiente"', () => {
        render(<Pagination currentPage={5} totalPages={5} onPageChange={handlePageChange} />);
        fireEvent.click(screen.getByText('Siguiente'));
        expect(handlePageChange).not.toHaveBeenCalled();
    });

    it('debe deshabilitar el botón "Anterior" cuando currentPage=1', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);
        const prevButton = screen.getByText('Anterior');
        expect(prevButton).toBeDisabled();
    });

    it('debe deshabilitar el botón "Siguiente" cuando currentPage=totalPages', () => {
        render(<Pagination currentPage={5} totalPages={5} onPageChange={handlePageChange} />);
        const nextButton = screen.getByText('Siguiente');
        expect(nextButton).toBeDisabled();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} className="extra-class" />);
        const container = screen.getByText(/Página/).closest('div');
        expect(container?.className).toContain('extra-class');
    });
});
