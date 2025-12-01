import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../badge';

describe('Badge', () => {
    it('debe renderizar el contenido (children)', () => {
        render(<Badge>Etiqueta</Badge>);
        expect(screen.getByText('Etiqueta')).toBeInTheDocument();
    });

    it('debe aplicar estilos por defecto (variant="gray")', () => {
        render(<Badge>Etiqueta gris</Badge>);
        const badge = screen.getByText('Etiqueta gris');
        expect(badge.className).toContain('bg-gray-100');
        expect(badge.className).toContain('text-gray-800');
    });

    it('debe aplicar estilos correctos para variant="yellow"', () => {
        render(<Badge variant="yellow">Etiqueta amarilla</Badge>);
        const badge = screen.getByText('Etiqueta amarilla');
        expect(badge.className).toContain('bg-yellow-100');
        expect(badge.className).toContain('text-yellow-800');
    });

    it('debe aplicar estilos correctos para variant="blue"', () => {
        render(<Badge variant="blue">Etiqueta azul</Badge>);
        const badge = screen.getByText('Etiqueta azul');
        expect(badge.className).toContain('bg-blue-100');
        expect(badge.className).toContain('text-blue-800');
    });

    it('debe aplicar estilos correctos para variant="green"', () => {
        render(<Badge variant="green">Etiqueta verde</Badge>);
        const badge = screen.getByText('Etiqueta verde');
        expect(badge.className).toContain('bg-green-100');
        expect(badge.className).toContain('text-green-800');
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        render(<Badge className="extra-class">Etiqueta con clase extra</Badge>);
        const badge = screen.getByText('Etiqueta con clase extra');
        expect(badge.className).toContain('extra-class');
    });
});
