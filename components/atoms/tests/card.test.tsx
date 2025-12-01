import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from '../card';

describe('Card', () => {
    it('debe renderizar el contenido (children)', () => {
        render(<Card>Contenido de la tarjeta</Card>);
        expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument();
    });

    it('debe renderizar el título si se pasa como prop', () => {
        render(<Card title="Título de prueba">Contenido</Card>);
        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Título de prueba');
    });

    it('debe ejecutar la función onClick cuando se hace click', () => {
        const handleClick = vi.fn();
        render(<Card onClick={handleClick}>Contenido clickeable</Card>);

        fireEvent.click(screen.getByText('Contenido clickeable'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe aplicar clases adicionales cuando se pasa className', () => {
        const { container } = render(<Card className="extra-class">Contenido</Card>);
        const cardRoot = container.firstChild as HTMLElement;
        expect(cardRoot.className).toContain('extra-class');
    });

    it('debe aplicar clases de cursor y hover cuando onClick está definido', () => {
        const handleClick = vi.fn();
        const { container } = render(<Card onClick={handleClick}>Contenido</Card>);
        const cardRoot = container.firstChild as HTMLElement;

        expect(cardRoot.className).toContain('cursor-pointer');
    });
});