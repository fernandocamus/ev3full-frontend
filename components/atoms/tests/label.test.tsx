import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Label from '../label';

describe('Label', () => {
    it('debe renderizar el contenido (children)', () => {
        render(<Label>Nombre</Label>);
        expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    it('debe renderizar con el atributo htmlFor cuando se pasa', () => {
        render(<Label htmlFor="input-id">Correo</Label>);
        const label = screen.getByText('Correo');
        expect(label).toHaveAttribute('for', 'input-id');
    });

    it('no debe tener atributo htmlFor cuando no se pasa', () => {
        render(<Label>Sin htmlFor</Label>);
        const label = screen.getByText('Sin htmlFor');
        expect(label).not.toHaveAttribute('for');
    });

    it('debe mostrar el asterisco (*) cuando required=true', () => {
        render(<Label required>Campo obligatorio</Label>);
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('*').className).toContain('text-red-500');
    });

    it('no debe mostrar el asterisco cuando required=false', () => {
        render(<Label>Campo opcional</Label>);
        expect(screen.queryByText('*')).toBeNull();
    });

    it('debe aceptar className adicional y aplicarlo al label', () => {
        render(<Label className="extra-class">Con clase extra</Label>);
        const label = screen.getByText('Con clase extra');
        expect(label.className).toContain('extra-class');
    });

    it('debe tener las clases base siempre', () => {
        render(<Label>Con clases base</Label>);
        const label = screen.getByText('Con clases base');
        expect(label.className).toContain('block');
        expect(label.className).toContain('text-sm');
        expect(label.className).toContain('font-semibold');
    });
});
