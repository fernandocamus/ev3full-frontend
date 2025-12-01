import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import AlertasStock from '../alertasStock';

vi.mock('../atoms/card', () => ({
    default: ({ children, title, className }: any) => (
        <div className={className}>
            <h2>{title}</h2>
            {children}
        </div>
    ),
}));

vi.mock('../atoms/badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../atoms/button', () => ({
    default: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

vi.mock('../molecules/emptyState', () => ({
    default: ({ title, description }: any) => (
        <div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    ),
}));

describe('AlertasStock', () => {
    const mockAlertas = [
        { id: 1, nombre: 'Producto A', stock: 0 },
        { id: 2, nombre: 'Producto B', stock: 3 },
    ];

    const handleViewProducto = vi.fn();

    beforeEach(() => {
        handleViewProducto.mockClear();
    });

    it('debe renderizar el título del Card', () => {
        render(<AlertasStock alertas={mockAlertas} />);
        expect(screen.getByText('⚠️ Alertas de Stock')).toBeInTheDocument();
    });

    it('debe renderizar EmptyState cuando no hay alertas', () => {
        render(<AlertasStock alertas={[]} />);
        expect(screen.getByText('Todo en orden')).toBeInTheDocument();
        expect(screen.getByText('No hay alertas de stock en este momento')).toBeInTheDocument();
    });

    it('debe renderizar las alertas con nombre y estado', () => {
        render(<AlertasStock alertas={mockAlertas} />);
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('Sin stock')).toBeInTheDocument();
        expect(screen.getByText('Producto B')).toBeInTheDocument();
        expect(screen.getByText('Stock bajo')).toBeInTheDocument();
    });

    it('debe renderizar el stock en Badge', () => {
        render(<AlertasStock alertas={mockAlertas} />);
        expect(screen.getByText('0 uds')).toBeInTheDocument();
        expect(screen.getByText('3 uds')).toBeInTheDocument();
    });

    it('debe renderizar el botón "Ver" cuando se pasa onViewProducto', () => {
        render(<AlertasStock alertas={mockAlertas} onViewProducto={handleViewProducto} />);
        const buttons = screen.getAllByText('Ver');
        expect(buttons.length).toBe(2);
    });

    it('debe llamar a onViewProducto con el id correcto al hacer click en "Ver"', () => {
        render(<AlertasStock alertas={mockAlertas} onViewProducto={handleViewProducto} />);
        const button = screen.getAllByText('Ver')[0];
        fireEvent.click(button);
        expect(handleViewProducto).toHaveBeenCalledWith(1);
    });

    it('debe aceptar className adicional y aplicarlo al contenedor Card', () => {
        const { container } = render(<AlertasStock alertas={mockAlertas} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});