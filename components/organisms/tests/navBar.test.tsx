import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import Navbar from '../navBar';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock('../../atoms/button', () => ({
    default: ({ children, onClick, className }: any) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));

vi.mock('../../atoms/badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

describe('Navbar', () => {
    const usuarioAdmin = { nombre: 'Admin User', rol: 'ADMIN' as const };
    const usuarioVendedor = { nombre: 'Seller User', rol: 'VENDEDOR' as const };
    const handleLogout = vi.fn();

    beforeEach(() => {
        handleLogout.mockClear();
    });

    it('debe renderizar el título y la fecha', () => {
        render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} />);
        expect(screen.getByText('Sistema POS')).toBeInTheDocument();
        expect(screen.getByText(/^\w+, \d+ \w+$/i)).toBeInTheDocument();
    });

    it('debe renderizar items de navegación para ADMIN', () => {
        render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} />);
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Productos').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Ventas').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Días').length).toBeGreaterThan(0);
    });

    it('debe renderizar items de navegación para VENDEDOR', () => {
        render(<Navbar usuario={usuarioVendedor} onLogout={handleLogout} />);
        expect(screen.getAllByText('Productos').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Carrito').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Mis Ventas').length).toBeGreaterThan(0);
    });

    it('debe mostrar el nombre y rol del usuario', () => {
        render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} />);
        expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
        expect(screen.getAllByText('ADMIN').length).toBeGreaterThan(0);
    });

    it('debe llamar a onLogout al hacer click en "Cerrar Sesión"', () => {
        render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} />);
        const logoutButtons = screen.getAllByText('Cerrar Sesión');
        fireEvent.click(logoutButtons[0]);
        expect(handleLogout).toHaveBeenCalled();
    });

    it('debe abrir y cerrar el menú móvil', () => {
        const { container } = render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} />);
        const toggleButton = container.querySelector('button.md\\:hidden');
        expect(toggleButton).toBeInTheDocument();

        if (toggleButton) {
            fireEvent.click(toggleButton);
            expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);

            fireEvent.click(toggleButton);
            expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        }
    });

    it('debe renderizar el menú móvil con nombre y rol del usuario', () => {
        const { container } = render(<Navbar usuario={usuarioVendedor} onLogout={handleLogout} />);
        const toggleButton = container.querySelector('button.md\\:hidden');

        if (toggleButton) {
            fireEvent.click(toggleButton);
            expect(screen.getAllByText('Seller User').length).toBeGreaterThan(0);
            expect(screen.getAllByText('VENDEDOR').length).toBeGreaterThan(0);
        }
    });

    it('debe aceptar className adicional y aplicarlo al header', () => {
        render(<Navbar usuario={usuarioAdmin} onLogout={handleLogout} className="extra-class" />);
        const header = screen.getByText('Sistema POS').closest('header');
        expect(header?.className).toContain('extra-class');
    });
});