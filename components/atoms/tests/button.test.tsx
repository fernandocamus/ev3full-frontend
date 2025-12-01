import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../button';

describe('Button', () => {
    it('debe renderizar el contenido (children)', () => {
        render(<Button>Click aquí</Button>);
        expect(screen.getByText('Click aquí')).toBeInTheDocument();
    });

    it('debe ejecutar la función onClick cuando se hace click', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        fireEvent.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe tener type="button" por defecto', () => {
        render(<Button>Botón</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    it('debe aceptar type="submit"', () => {
        render(<Button type="submit">Enviar</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('debe aplicar estilos correctos para variant="primary"', () => {
        render(<Button variant="primary">Primario</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-purple-600');
        expect(button.className).toContain('text-white');
    });

    it('debe aplicar estilos correctos para variant="secondary"', () => {
        render(<Button variant="secondary">Secundario</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-gray-200');
        expect(button.className).toContain('text-gray-800');
    });

    it('debe aplicar estilos correctos para variant="danger"', () => {
        render(<Button variant="danger">Peligro</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-red-600');
        expect(button.className).toContain('text-white');
    });

    it('debe estar deshabilitado cuando disabled=true', () => {
        render(<Button disabled>Deshabilitado</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('debe mostrar el spinner cuando loading=true', () => {
        render(<Button loading>Loading</Button>);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        const button = screen.getByRole('button');
        const spinner = button.querySelector('.animate-spin');

        expect(spinner).toBeInTheDocument();
    });

    it('debe estar deshabilitado cuando loading=true', () => {
        render(<Button loading>Loading</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('debe aplicar clase w-full cuando fullWidth=true', () => {
        render(<Button fullWidth>Full Width</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('w-full');
    });

    it('debe aceptar className adicional y aplicarlo al botón', () => {
        render(<Button className="extra-class">Con clase extra</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('extra-class');
    });
});
