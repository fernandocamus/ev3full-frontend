import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormField from '../formField';

vi.mock('../atoms/label', () => ({
    default: ({ children, required }: any) => (
        <label>
            {children}
            {required && <span>*</span>}
        </label>
    ),
}));

describe('FormField', () => {
    it('debe renderizar el label correctamente', () => {
        render(
            <FormField label="Nombre">
                <input type="text" />
            </FormField>
        );
        expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    it('debe renderizar los children correctamente', () => {
        render(
            <FormField label="Correo">
                <input type="email" placeholder="Ingresa tu correo" />
            </FormField>
        );
        expect(screen.getByPlaceholderText('Ingresa tu correo')).toBeInTheDocument();
    });

    it('debe renderizar el asterisco (*) cuando required=true', () => {
        render(
            <FormField label="Contraseña" required>
                <input type="password" />
            </FormField>
        );
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('no debe renderizar el asterisco cuando required=false', () => {
        render(
            <FormField label="Usuario">
                <input type="text" />
            </FormField>
        );
        expect(screen.queryByText('*')).toBeNull();
    });

    it('debe renderizar el mensaje de error cuando se pasa la prop error', () => {
        render(
            <FormField label="Edad" error="Campo obligatorio">
                <input type="number" />
            </FormField>
        );
        expect(screen.getByText('Campo obligatorio')).toBeInTheDocument();
        const errorMessage = screen.getByText('Campo obligatorio');
        expect(errorMessage.className).toContain('text-red-600');
    });

    it('no debe renderizar el mensaje de error cuando no se pasa la prop error', () => {
        render(
            <FormField label="Teléfono">
                <input type="tel" />
            </FormField>
        );
        expect(screen.queryByText(/Campo obligatorio/i)).toBeNull();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        render(
            <FormField label="Dirección" className="extra-class">
                <input type="text" />
            </FormField>
        );
        const container = screen.getByText('Dirección').closest('div');
        expect(container?.className).toContain('extra-class');
    });

    it('debe tener la clase base mb-4 en el contenedor', () => {
        render(
            <FormField label="País">
                <input type="text" />
            </FormField>
        );
        const container = screen.getByText('País').closest('div');
        expect(container?.className).toContain('mb-4');
    });
});
