import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatCard from '../statCard';

vi.mock('../atoms/card', () => ({
    default: ({ children, className }: any) => (
        <div className={className}>{children}</div>
    ),
}));

describe('StatCard', () => {
    const defaultProps = {
        title: 'Ventas',
        value: 1200,
        subtitle: 'Últimos 30 días',
        icon: <span data-testid="icon">📈</span>,
    };

    it('debe renderizar el título correctamente', () => {
        render(<StatCard {...defaultProps} />);
        expect(screen.getByText('Ventas')).toBeInTheDocument();
    });

    it('debe renderizar el valor correctamente', () => {
        render(<StatCard {...defaultProps} />);
        expect(screen.getByText('1200')).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo cuando se pasa como prop', () => {
        render(<StatCard {...defaultProps} />);
        expect(screen.getByText('Últimos 30 días')).toBeInTheDocument();
    });

    it('no debe renderizar el subtítulo cuando no se pasa', () => {
        render(<StatCard {...defaultProps} subtitle={undefined} />);
        expect(screen.queryByText('Últimos 30 días')).toBeNull();
    });

    it('debe renderizar el icono correctamente', () => {
        render(<StatCard {...defaultProps} />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.getByText('📈')).toBeInTheDocument();
    });

    it('debe aplicar estilos correctos para variant="green"', () => {
        render(<StatCard {...defaultProps} variant="green" />);
        const iconContainer = screen.getByTestId('icon').closest('div')?.parentElement;
        expect(iconContainer?.className).toContain('bg-green-100');
        expect(iconContainer?.className).toContain('text-green-600');
    });

    it('debe aplicar estilos correctos para variant="blue"', () => {
        render(<StatCard {...defaultProps} variant="blue" />);
        const iconContainer = screen.getByTestId('icon').closest('div')?.parentElement;
        expect(iconContainer?.className).toContain('bg-blue-100');
        expect(iconContainer?.className).toContain('text-blue-600');
    });

    it('debe aplicar estilos correctos para variant="purple" (por defecto)', () => {
        render(<StatCard {...defaultProps} />);
        const iconContainer = screen.getByTestId('icon').closest('div')?.parentElement;
        expect(iconContainer?.className).toContain('bg-purple-100');
        expect(iconContainer?.className).toContain('text-purple-600');
    });

    it('debe aceptar className adicional y aplicarlo al contenedor Card', () => {
        const { container } = render(<StatCard {...defaultProps} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});