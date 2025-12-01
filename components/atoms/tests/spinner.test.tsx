import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../spinner';

describe('Spinner', () => {
    it('debe renderizar el contenedor principal con clases base', () => {
        const { container } = render(<Spinner />);
        const spinnerContainer = container.firstChild as HTMLElement;

        expect(spinnerContainer.className).toContain('flex');
        expect(spinnerContainer.className).toContain('items-center');
        expect(spinnerContainer.className).toContain('justify-center');
    });

    it('debe renderizar con tamaño md por defecto', () => {
        const { container } = render(<Spinner />);
        const innerSpinner = container.querySelector('.animate-spin') as HTMLElement;

        expect(innerSpinner).toBeDefined();
        expect(innerSpinner.className).toContain('w-8');
        expect(innerSpinner.className).toContain('h-8');
    });

    it('debe renderizar con tamaño sm cuando se pasa size="sm"', () => {
        const { container } = render(<Spinner size="sm" />);
        const innerSpinner = container.querySelector('.animate-spin') as HTMLElement;

        expect(innerSpinner.className).toContain('w-4');
        expect(innerSpinner.className).toContain('h-4');
    });

    it('debe renderizar con tamaño lg cuando se pasa size="lg"', () => {
        const { container } = render(<Spinner size="lg" />);
        const innerSpinner = container.querySelector('.animate-spin') as HTMLElement;

        expect(innerSpinner.className).toContain('w-12');
        expect(innerSpinner.className).toContain('h-12');
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<Spinner className="extra-class" />);
        const spinnerContainer = container.firstChild as HTMLElement;

        expect(spinnerContainer.className).toContain('extra-class');
    });

    it('debe tener las clases de animación y estilo en el spinner interno', () => {
        const { container } = render(<Spinner />);
        const innerSpinner = container.querySelector('.animate-spin') as HTMLElement;

        expect(innerSpinner.className).toContain('border-4');
        expect(innerSpinner.className).toContain('border-gray-200');
        expect(innerSpinner.className).toContain('border-t-purple-600');
        expect(innerSpinner.className).toContain('rounded-full');
        expect(innerSpinner.className).toContain('animate-spin');
    });
});