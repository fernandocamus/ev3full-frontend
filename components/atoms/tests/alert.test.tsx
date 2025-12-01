import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Alert from '../alert';

describe('Alert', () => {
    it('debe renderizar el título correctamente', () => {
        render(
            <Alert type="success" title="Operación exitosa">
                Todo salió bien
            </Alert>
        );
        const heading = screen.getByRole('heading', { level: 4 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Operación exitosa');
    });

    it('debe renderizar el contenido (children)', () => {
        render(
            <Alert type="info" title="Información importante">
                Este es un mensaje informativo
            </Alert>
        );
        expect(screen.getByText('Este es un mensaje informativo')).toBeInTheDocument();
    });

    it('debe aplicar estilos correctos para type="success"', () => {
        render(
            <Alert type="success" title="Éxito">
                Mensaje de éxito
            </Alert>
        );
        const title = screen.getByText('Éxito');
        // Subir 3 niveles: h4 -> div -> div (flex) -> div (contenedor principal)
        const container = title.parentElement?.parentElement?.parentElement;
        expect(container?.className).toContain('bg-purple-50');
        expect(title.className).toContain('text-purple-800');
    });

    it('debe aplicar estilos correctos para type="error"', () => {
        render(
            <Alert type="error" title="Error">
                Mensaje de error
            </Alert>
        );
        const title = screen.getByText('Error');
        const container = title.parentElement?.parentElement?.parentElement;
        expect(container?.className).toContain('bg-red-50');
        expect(title.className).toContain('text-red-800');
    });

    it('debe aplicar estilos correctos para type="info"', () => {
        render(
            <Alert type="info" title="Info">
                Mensaje informativo
            </Alert>
        );
        const title = screen.getByText('Info');
        const container = title.parentElement?.parentElement?.parentElement;
        expect(container?.className).toContain('bg-blue-50');
        expect(title.className).toContain('text-blue-800');
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        render(
            <Alert type="success" title="Extra" className="custom-class">
                Con clase extra
            </Alert>
        );
        const title = screen.getByText('Extra');
        const container = title.parentElement?.parentElement?.parentElement;
        expect(container?.className).toContain('custom-class');
    });
});